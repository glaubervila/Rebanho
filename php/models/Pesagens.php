<?php

/**
Tipos de Pesagens
1 - Pesagem de Entrada
2 - Pesagem de Rotina
3 - Pesagem de Compra
4 - Pesagem de Saida
**/

header('Content-Type: text/javascript; charset=UTF-8');

class Pesagens extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "pesagens";


    public function insert($data, $json = true){

        // Criado o Atributo descricao_ocorrencia
        $data->descricao_ocorrencia = "Pesagem - {$data->peso} Kg";

        // Verificar se o Registro e UNICO
        // Chave UNIQUE = confinamento_id + animal_id + tipo
        $unique = $this->findBy(array('confinamento_id','animal_id','data','tipo'), array($data->confinamento_id, $data->animal_id, $data->data, $data->tipo), 'pesagens');

        if ($unique){

            $data->id = $unique->id;

            $update = Pesagens::update($data, $json);

            $result = new StdClass();
            if ($update) {
                $result->success = true;
            }
            else {
                $result->success = false;
            }

            return $result;
        }
        else {
            $db = $this->getDb();
            // Iniciando uma Transacao
            $db->beginTransaction();

            $query = 'INSERT INTO pesagens (confinamento_id, quadra_id, animal_id, data, peso, tipo) VALUES (:confinamento_id, :quadra_id, :animal_id, :data, :peso, :tipo);';

            $stm = $db->prepare($query);

            $stm->bindValue(':confinamento_id', $data->confinamento_id);
            $stm->bindValue(':quadra_id', $data->quadra_id);
            $stm->bindValue(':animal_id', $data->animal_id);
            $stm->bindValue(':data', $data->data);
            $stm->bindValue(':peso', $data->peso);
            $stm->bindValue(':tipo', $data->tipo);

            $stm->execute();

            $insert = $db->lastInsertId($query);

            // Criando uma Ocorrencia de Pesagem
            $ocorrencia = Pesagens::criarOcorrenciaPesagem($data, false);

            if (!$ocorrencia->success){
                // Se nao Criou a Ocorrencia Para Tudo
                $db->rollback();
                if ($json){
                    die(json_encode($ocorrencia));
                }
                else {
                    return $ocorrencia;
                }
            }

            if ($insert) {

                $db->commit();
                $newData = $data;
                $newData->id = $insert;

                if ($json) {
                    $this->ReturnJsonSuccess($msg,$data);
                }
                else {
                    $return->success = true;
                }
            }
            else {
                $db->rollback();
                $error = $stm->errorInfo();
                if ($json) {
                    $this->ReturnJsonError($error);
                }
                else {
                    $return->failure = true;
                    $result->id  = $data->id;
                    $return->msg = "Falha ao Inserir o Registro de Pesagem.";
                    $return->error = $error[1];
                }
            }
            return $return;
        }
    }

    public function update($data, $json = true){

        $db = $this->getDb();

        $query = 'UPDATE pesagens SET confinamento_id = :confinamento_id, quadra_id = :quadra_id, animal_id = :animal_id, data = :data, peso = :peso, tipo =:tipo WHERE id = :id';

        $stm = $db->prepare($query);

        $stm->bindValue(':id', $data->id);
        $stm->bindValue(':confinamento_id', $data->confinamento_id);
        $stm->bindValue(':quadra_id', $data->quadra_id);
        $stm->bindValue(':animal_id', $data->animal_id);
        $stm->bindValue(':data', $data->data);
        $stm->bindValue(':peso', $data->peso);
        $stm->bindValue(':tipo', $data->tipo);

        $stm->execute();

        $update = $stm->execute();

        // Criando uma Ocorrencia de Pesagem
        $ocorrencia = Pesagens::criarOcorrenciaPesagem($data, false);

        if (!$ocorrencia->success){
            // Se nao Criou a Ocorrencia Para Tudo
            $db->rollback();
            if ($json){
                die(json_encode($ocorrencia));
            }
            else {
                return $ocorrencia;
            }
        }

        if ($update) {

            if ($json) {
                $this->ReturnJsonSuccess($msg,$data);
            }
            else {
                return $update;
            }
        }
        else {
            $error = $stm->errorInfo();
            $this->ReturnJsonError($error);
        }
    }

    /** Metodo: criarOcorrenciaPesagem
     * Cria um objeto de ocorrencia para a Pesagem
     * usa o metodo insert da Classe Ocorrencia
     * se for um update a classe vai identificar o registro e fazer a atualizacao.
     */
    public function criarOcorrenciaPesagem($data){

        // Criando o Obj Ocorrencia
        $objOcorrencia = new StdClass();
        $objOcorrencia->confinamento_id = $data->confinamento_id;
        $objOcorrencia->quadra_id = $data->quadra_id;
        $objOcorrencia->animal_id = $data->animal_id;
        $objOcorrencia->ocorrencia = 'Pesagem';
        $objOcorrencia->data = $data->data;

        // Classificando o Tipo de Ocorrencia
        if ($data->tipo == 1) {
            // Se a Pesagem for de Entrada(1) a ocorrencia e de Entrada(2)
            $objOcorrencia->tipo = 2;
            $objOcorrencia->descricao = "Pesagem de Entrada - {$data->peso}";
        }
        else if ($data->tipo == 2) {
            // Se a Pesagem for de Rotina(2) a ocorrencia e de Pesagem(4)
            $objOcorrencia->tipo = 4;
            $objOcorrencia->descricao = "Pesagem - {$data->peso}";
        }
        else if ($data->tipo == 3) {
            // Se a Pesagem for de Compra(3) a ocorrencia e de Compra(3)
            $objOcorrencia->tipo = 3;
            $objOcorrencia->descricao = "Pesagem de Compra - {$data->peso} Kg";
        }
        else if ($data->tipo == 4) {
            // Se a Pesagem for de Saida(4) a ocorrencia e de Pesagem de Saida(6)
            $objOcorrencia->tipo = 6;
            $objOcorrencia->descricao = "Pesagem de Saida - {$data->peso} Kg";
        }


        $return = Ocorrencias::insert($objOcorrencia, false);

        if ($return->success){
            $return->success = true;
        }
        else {
            $return->failure = true;
            $return->msg = "Falha ao Criar a Ocorrencia de Pesagem";
        }

        return $return;
    }


    /** Metodo: getPesagemEntrada
     * Retorna a pesagem que tiver o tipo = 1 para o confinamento que ta no objeto nota
     * da entrada do animal
     * @param:$animal - id do animal
     * @param:$confinamento - id do Confinamento que se quer a entrada
     */
    public function getPesagemEntrada($animal, $confinamento){

        // Recuperando o Peso de Entrada Usando o Confinamento o animal e o tipo
        $pesagem = $this->findBy(array('confinamento_id','animal_id','tipo'), array($confinamento, $animal, 1), 'pesagens');

        return $pesagem;
    }

    /** Metodo: getPesagemCompra
     * Retorna a pesagem que tiver o tipo = 3 para o confinamento que ta no objeto nota
     * da entrada do animal
     * @param:$animal - id do animal
     * @param:$confinamento - id do Confinamento que se quer a entrada
     */
    public function getPesagemCompra($animal, $confinamento){

        // Recuperando o Peso de Compra Usando o Confinamento o animal e o tipo
        $pesagem = $this->findBy(array('confinamento_id','animal_id','tipo'), array($confinamento, $animal, 3), 'pesagens');

        return $pesagem;
    }

    /** Metodo: getPesagemRecente
     * Retorna a Pesagem mais recente, busca todas as pesagens pelo animal_id e confinamento_id
     * que seja do tipo 2 ordenado pela data decrescente (mais recente) e limitado a 1
     * @param:$animal - id do animal
     * @param:$confinamento - id do Confinamento que se quer a entrada
     */
    public function getPesagemRecente($animal, $confinamento){

        $query = new StdClass();
        $query->sql = "SELECT * FROM pesagens WHERE animal_id = {$animal} AND confinamento_id = {$confinamento} AND tipo = 2 ORDER BY data DESC LIMIT 1;";
        $query->filter = false;
        $query->limit  = false;
        $query->order  = false;

        $pesagem = $this->fetchAll($query);
        return $pesagem->data[0];
    }



    public function getCntPesados($data){

        // Recuperando os Paramentros
        $nota_aberta = $data['nota_aberta'];

        // Recuperando o ObjNota
        $objNota = $this->find($nota_aberta, 'compras');

        // Recuperar Todos os Animais
        $animais = $this->findAllBy('compra_id', $objNota->id, 'animais');

        foreach ($animais as $animal){

            $aIds[] = $animal->id;

        }

        $ids = implode(', ', $aIds);

        $db = $this->getDb();

        $sql = "SELECT * FROM pesagens WHERE confinamento_id = {$objNota->confinamento_id} AND animal_id IN ($ids) AND tipo = 1";

        $stm = $db->prepare($sql);
        $stm->execute();
        $pesagens = $stm->fetchAll(\PDO::FETCH_OBJ);

        $peso_total = 0;
        $pesados = 0;
        foreach($pesagens as $objPeso){
            if ($objPeso->peso > 0) {
                $peso_total = ($objPeso->peso + $peso_total);
                $pesados++;
            }
        }

        $result = new StdClass();
        $result->peso_total  = $peso_total;
        $result->pesados     = $pesados;
        $result->quantidade  = $objNota->quantidade;


        return $result;
    }

    public function getPesagens($data){

        $strFiltros = $this->parseFilter($data["filter"]);
        $strSorters = $this->parseSorter($data["sort"]);

        $aResult = $this->filter(null, 'pesagens', $strFiltros, $strSorters, false);

        // Recuperar as Informacoes de cada animal
        foreach ($aResult as $row){

            $registro = $row;

            // Informacoes do Animal
            $animal = $this->find($row->animal_id, 'animais');
            $registro->sexo = $animal->sexo;
            $registro->idade = $animal->idade;

            // Informacoes do Codigo
            $codigos = Animais::getCodigosById($row->animal_id, $animal->confinamento_id);
            $registro->codigo = $codigos[0]->codigo;

            // Informacoes da Quadra
            $quadra = $this->find($animal->quadra_id, 'quadras', 'quadra');
            $registro->quadra = $quadra->quadra;

            $vacina = $this->filter(null, 'ocorrencias', "confinamento_id = {$registro->confinamento_id} AND animal_id = {$registro->animal_id} AND data = '{$registro->data}' AND tipo = 'V'", false, false);

           
            $registro->vacina = utf8_encode($vacina[0]->descricao);

            $aRegistros[] = $registro;
        }



        $result = new StdClass();
        $result->success = true;
        $result->data    = $aRegistros;
        $result->total   = count($aRegistros);

        if ($data["returnJson"]){

            echo json_encode($result);
        }
        else {
            return $result;
        }
    }


    public function RelatorioPorData($request){

        $confinamento = $request["confinamento"];
        // Lembrar de Tratar a Data AKI!!!
        $data = $request["data"];


        // Recuperar Todas As Informacoes para o Relatorio Por Data

        // Instanciar a Classe Reports do Relatorio
        $report = new PesagensPorData();
        $report->geraRelatorio();

    }

    /** Metodo: criarPesagemCompra($compra_id)
     * Recebe uma nota, busca todos os animais da nota
     * para cada animal recupera o peso de entrada deste animal
     * cria uma nova pesagem para cada animal com o tipo '3 - compra'
     * peso de compra = peso de entrada + diferenca_media
     * @param:$compra_id - Chave de Compra que se quer criar as pesagens de compra
     * @param:$data_entrada - Data que fez a pesagem
     */
    public function criarPesagemCompra($compra_id, $data_entrada){

        $db = $this->getDb();

        // Recuperar Dados da Compra
        $compra = $this->find($compra_id, 'compras');

        $compra_id = (int)$compra->id;

        // Recuperar Todos os Animais para Criar os Pesos de Compra
        $animais_tmp = NotasEntrada::getAnimaisNota($data, false, $compra_id);

        $animais = $animais_tmp->data;

        // Diferenca Media
        $diferenca_media = $compra->diferenca_media;
        $data_compra = $compra->data_compra;

        // Iniciando uma Transacao
        $db->beginTransaction();

        foreach ($animais as $animal){

            // Somando Diferca + peso_entrada
            $peso_compra = ($animal->peso_entrada + $diferenca_media);

            $query = 'INSERT INTO pesagens (confinamento_id, quadra_id, animal_id, data, peso, tipo) VALUES (:confinamento_id, :quadra_id, :animal_id, :data, :peso, :tipo);';

            $stm = $db->prepare($query);

            $stm->bindValue(':confinamento_id', $animal->confinamento_id);
            $stm->bindValue(':quadra_id', $animal->quadra_id);
            $stm->bindValue(':animal_id', $animal->id);
            $stm->bindValue(':data', $data_compra);
            $stm->bindValue(':peso', $peso_compra);
            $stm->bindValue(':tipo', 3);

            $stm->execute();

            // Crio a Ocorrencia de Peso de Compra
            $descricao = "Peso de Compra - {$peso_compra} Kg";

            $query_ocorrencia = "INSERT INTO ocorrencias (confinamento_id, quadra_id, animal_id, ocorrencia, descricao, data) VALUES (:confinamento_id, :quadra_id, :animal_id, :ocorrencia, :descricao, :data);";

            $stm = $db->prepare($query_ocorrencia);

            $stm->bindValue(':confinamento_id', $animal->confinamento_id);
            $stm->bindValue(':quadra_id', $animal->quadra_id);
            $stm->bindValue(':animal_id', $animal->id);
            $stm->bindValue(':ocorrencia', 'Compra');
            $stm->bindValue(':descricao', $descricao);
            $stm->bindValue(':data', $data_compra);

            $stm->execute();

        }

        $result = new StdClass();

        $error = $stm->errorInfo();

        // Se tiver Dado Erro ao Excluir os Animais
        if ($error[0] != 0){

            // desfaz operacoes realizadas durante a transacao
            $db->rollback();

            $codigo = $error[1];
            $erro   = $error[2];

            $msg = "Desculpe mas houve uma falha,<br> e <font color=\"red\"><b>Não</b></font> foi possivel <font color=\"red\"><b>Incluir</b></font> o(s) Registros(s). de <b>Peso de Compra</b><br> Se o problema persistir entre em contato com o administrador do sistema e informe a mensagem abaixo.<br>Código: $codigo  <br>Mensagem: $erro.";

            $result->failure = true;
            $result->message = $msg;

        }
        else {

            $db->commit();

            $result->success = true;
            $result->message = "";

        }
        return $result;
    }

    public function criarPesagemEntrada($data, $json = true){

        $animal = $this->find($data->id, 'animais');

        $objPesagem = new StdClass();
        $objPesagem->confinamento_id = $animal->confinamento_id;
        $objPesagem->quadra_id = $animal->quadra_id;
        $objPesagem->animal_id = $data->id;
        $objPesagem->data = $data->data_entrada;
        $objPesagem->peso = $data->peso_entrada;
        $objPesagem->tipo = 1; // Pesagem de Entrada

        $result = Pesagens::insert($objPesagem, false);

        if ($json) {
            echo json_encode($result);
        }
        else {
            return $result;
        }
    }

    public function criarPesagemSaida($data, $json = true){

        //$animal = $this->find($data->id, 'animais');

        $objPesagem = new StdClass();
        $objPesagem->confinamento_id = $data->confinamento_id;
        $objPesagem->quadra_id = $data->quadra_id;
        $objPesagem->animal_id = $data->id;
        $objPesagem->data = $data->data_saida;
        $objPesagem->peso = $data->peso;
        $objPesagem->tipo = 4; // Pesagem de Saida


        $result = Pesagens::insert($objPesagem, false);


        if ($json) {
            echo json_encode($result);
        }
        else {
            return $result;
        }
    }


    public function getPesosPorAnimal($data, $json = true){
//         $strFiltros = $this->parseFilter($data["filter"]);
//         $strSorters = $this->parseSorter($data["sort"]);


        if (is_array($data)){
            $animal_id = $data["animal_id"];
        }
        else {
            $animal_id = $data->animal_id;
        }

        $seq = 0;

        $records = array();

        // Saber os Confinamentos que este animal ja passou
        $aConfinamentos = $this->filter('DISTINCT(confinamento_id)', 'ocorrencias', "animal_id = $animal_id", false, false);

        // Para cada Confinamento que o animal passou
        foreach ($aConfinamentos as $confinamento){

            $confinamento_id = $confinamento->confinamento_id;

            // Para Cada Confinamento Recuperar o Nome do Confinamento
            $objConfinamento = $this->find($confinamento_id, 'confinamentos');
            $confinamentoNome  = $objConfinamento->confinamento;


            // Saber o Peso de Compra
            $objPesoCompra = $this->filter(null, 'pesagens', "tipo = 3 AND confinamento_id = $confinamento_id AND animal_id = $animal_id", false, false);

            if ($objPesoCompra) {
                $pesoCompra = $objPesoCompra[0];
                $pesoCompra->confinamento = $confinamentoNome;
                $pesoCompra->sequencia = $seq++;
                //var_dump($pesoCompra);

                $records[] = $pesoCompra;
            }

            // Saber o Peso de Entrada
            $objPesoEntrada = $this->filter(null, 'pesagens', "tipo = 1 AND confinamento_id = $confinamento_id AND animal_id = $animal_id", false, false);

            $pesoEntrada = $objPesoEntrada[0];
            //var_dump($pesoEntrada);
            $pesoEntrada->confinamento = $confinamentoNome;
            $pesoEntrada->sequencia = $seq++;
            $records[] = $pesoEntrada;

            // Recuperar as Pesagens Rotina
            $objPesosRotina = $this->filter(null, 'pesagens', "tipo = 2 AND confinamento_id = $confinamento_id AND animal_id = $animal_id", "data ASC", false);

            // Inicia com o Peso de Compra
            // Se tiver mudado de confinamento nao vai ter peso de compra usar o peso de entrada
            if (!$pesoCompra) {
                $peso_anterior = $pesoEntrada->peso;
                $data_anterior = $pesoEntrada->data;
            }
            else {
                $peso_anterior = $pesoCompra->peso;
                $data_anterior = $pesoCompra->data;
            }
            //$aPesosRotina = array();

            // Para Cada Pesagem calcular o intervalo e o peso ganho e a media
            foreach ($objPesosRotina  as $pesosRotina) {

                $record = $pesosRotina;

                $record->confinamento = $confinamentoNome;

                // calcular o peso ganho
                $peso_ganho = ($record->peso - $peso_anterior);
                $record->peso_ganho = number_format($peso_ganho, 2, '.','.');
                $record->peso_anterior = number_format($peso_anterior, 2, '.','.');

                $record->intervalo  = $this->diferencaEntreDatas($data_anterior, $record->data);

                $media_dia  = ($record->peso_ganho / $record->intervalo);
                $record->media_dia = number_format($media_dia, 2, '.','.');

                $record->sequencia = $seq++;

                $peso_anterior = $record->peso;
                $data_anterior = $record->data;

                //$aPesosRotina[] = $record;
                $records[] = $record;
            }


            // Saber o Peso de Saida
            $objPesoSaida = $this->filter(null, 'pesagens', "tipo = 4 AND confinamento_id = $confinamento_id AND animal_id = $animal_id", false, false);

            if ($objPesoSaida) {
                $pesoSaida = $objPesoSaida[0];

                $peso_ganho = ($pesoSaida->peso - $peso_anterior);
                $pesoSaida->peso_ganho = number_format($peso_ganho, 2, '.','.');

                $pesoSaida->intervalo  = $this->diferencaEntreDatas($data_anterior, $pesoSaida->data);

                $media_dia  = ($pesoSaida->peso_ganho / $pesoSaida->intervalo);
                $pesoSaida->media_dia = number_format($media_dia, 2, '.','.');

                $pesoSaida->confinamento = $confinamentoNome;

                $pesoSaida->sequencia = $seq++;
                $records[] = $pesoSaida;
            }
        }

        $aRegistros = $records;


        $result = new StdClass();
        $result->success = true;
        $result->data    = $aRegistros;
        $result->total   = count($aRegistros);

        if ($data["returnJson"] OR $json){

            echo json_encode($result);
        }
        else {
            return $result;
        }
    }

    public function inserir_Pesagens($data, $json = true){

        // Para Cada Registro de Pesagem, fazer um insert
        $results = new StdClass();
        if (is_array($data)){
            foreach ($data as $registro){
                if ($registro->id == 0){
                    $return = $this->insert($registro, false);
                }
                else {
                    $return = $this->update($registro, false);
                }

                if ($return->success || $return == true){
                    // Se tiver Sucesso na Pesagem faz as outras ocorrencias
                    // Vacinacao
                    if ($registro->vacina_id){
                        $vacina = Ocorrencias::OcorrenciaVacinacao($registro, false);

                        if ($vacina->failure){
                            $msgs[] = "Codigo: {$registro->codigo} - {$vacina->msg}";
                        }
                    }
                    // Saber se tem que fazer o manejo
                    $animal = $this->find($registro->animal_id, 'animais');

                    // Fazer o Manejo
                    if ($animal->quadra != $registro->quadra){
                        $manejo = Manejos::manejoQuadras($registro, $registro->animal_id, $registro->quadra, false);
                        if ($manejo->failure){
                            $msgs[] = $manejo->msg;
                        }
                    }
                }
                else {
                    if ($return->erros){
                        $results->erros[] = $return->erros;
                        $msgs[] = $return->erros->msg;
                    }

                }
            }
        }

        if ($results->erros){
            $results->failure = true;
            $results->msg = implode('<br>',$msgs);
        }
        else {
            $results->success = true;
            $results->msg = "Todos os registros foram salvos.";
        }

        echo json_encode($results);

    }



    public function RelatorioIndividual($data, $json = true){

        //var_dump($data);

        //Montando a Query
        $db = $this->getDb();

        $db->exec("SET NAMES utf8");

        // Saber os Ids e os pesos dos animais pesados que preenchem o filtro
        //$sql = "SELECT animal_id, data as data_pesagem, peso, tipo FROM pesagens WHERE ";

        $sql = "SELECT
                    a.id,
                    a.quadra_id,
                    a.status,
                    a.sexo,
                    a.compra_id,
                    a.idade as idade_entrada,
                    p.confinamento_id,
                    p.data as pesagem_data,
                    p.peso as pesagem_peso,
                    p.tipo as pesagem_tipo,
                    c.codigo,
                    c.animal_id,
                    d.data_pesagem as data_entrada
                FROM
                    animais a
                LEFT JOIN
                    pesagens p
                ON
                    a.id = p.animal_id
                LEFT JOIN
                    animais_codigos c
                ON
                    a.id = c.animal_id
                    AND p.confinamento_id = c.confinamento_id 
                LEFT JOIN
                    compras d
                ON a.compra_id = d.id AND p.confinamento_id = d.confinamento_id
                WHERE ";

        // 1 Filtro - Confinamento pelo confinamento da pesagem
        $filtros[] = "p.confinamento_id = {$data->confinamento_id}";

        // 2 Filtro - Periodo pela data da pesagem
        if ($data->data_inicial && $data->data_final){
            // Se tiver data inicial e data final pesquisar pelo periodo
            $filtros[] = "p.data BETWEEN '{$data->data_inicial}' AND '{$data->data_final}'";
        }
        else {
            // se nao tiver date final retorna so os da data igual a inicial
            $filtros[] = "p.data = '{$data->data_inicial}'";
        }

        // 3 Filtro - Por Quadra , filtrar pela quadra ondo animal esta
        if ($data->quadra_id){

            $filtros[] = "a.quadra_id = '{$data->quadra_id}'";
        }

        // 4 - Filtro - Sexo, filtrar pelo sexo do animal
        if ($data->sexo){

            $filtros[] = "a.sexo = '{$data->sexo}'";
        }


        $sql .= implode(' AND ', $filtros);


        // Setar a Ordem
        $sql .= " ORDER BY p.data ASC";


        //echo $sql;

        // Executar a Query
        $stm = $db->prepare($sql);
        $stm->execute();
        $pesagens = $stm->fetchAll(\PDO::FETCH_OBJ);


        //var_dump($pesagens);

        $aRegistros = array();

        // Para Cada Pesagem Saber as informacoes do Animal
        foreach ($pesagens as $pesagem){
            $registro = new StdClass();

            $animal_id = $pesagem->id;

            // dados da pesagem
            $registro->animal_id    = $animal_id;
            $registro->peso         = (int)$pesagem->pesagem_peso;
            $registro->data_pesagem = $pesagem->pesagem_data;
            $registro->tipo_pesagem = $pesagem->pesagem_tipo;

            // dados do animal resumido
//             $animal = Animais::getAnimalResumido($animal_id, false, false, false, false);
//             $animal = $animal->animal;

            $registro->confinamento_id = $pesagem->confinamento_id;
            $registro->sexo      = $pesagem->sexo;
            //$registro->idade     = $animal->idade;
            $registro->quadra_id = $pesagem->quadra_id;
            if ($registro->quadra_id != 0){
                $registro->quadra    = Quadras::getNomeQuadra($pesagem->quadra_id);
            }
            $registro->compra_id = $pesagem->compra_id;
            //$registro->dias_confinamento = $animal->dias_confinamento;
            $registro->status    = $pesagem->status;
            $registro->strStatus = Animais::getStatus($pesagem->status);
            $registro->codigo    = $pesagem->codigo;

            // Recuperando Peso de Entrada
            $peso_entrada = Pesagens::getPesagem($registro->animal_id, $registro->confinamento_id, 1, 'DESC');

            if ($peso_entrada){
                $registro->peso_entrada = (int)$peso_entrada->peso;
                $registro->data_entrada = $peso_entrada->data;
            }


            // Idade de Entrada
            $idade_entrada = $pesagem->idade_entrada;
            $registro->idade_entrada = $pesagem->idade_entrada;

            // Data de Entrada
            $data_entrada = $pesagem->data_entrada;
            $registro->data_entrada = $pesagem->data_entrada;

            // Dias Confinamento
            $dias_confinamento = Animais::calcularDiasConfinamento($data_entrada);
            $registro->dias_confinamento = $dias_confinamento;

            // Idade Atual
            $idade_atual = Animais::calcularIdade($idade_entrada, $dias_confinamento);
            $registro->idade_atual = $idade_atual;

            // Recuperando referencia da ultima pesagem
            //$pesagem_recente = Pesagens::getPesagem($registro->animal_id, $registro->confinamento_id, 2, 'DESC');

            //var_dump($peso_atual);
            //if ($pesagem_recente){
            //    $registro->pesagem_recente = (int)$pesagem_recente->peso;
            //    $registro->pesagem_recente_data = $pesagem_recente->data;
            //}

//             $pesos = (array)$pesos->data;

            // Peso de Entrada

            // Peso Atual
//             $peso_atual = array_pop($pesos);
//             $registro->intervalo = $peso_atual->intervalo;
//             $registro->peso_anterior = $peso_atual->peso_anterior;
//             $registro->peso_ganho = $peso_atual->peso_ganho;
//             $registro->media_dia = $peso_atual->media_dia;

            //var_dump($peso_atual);

            //var_dump($pesos);

            $aRegistros[] = $registro;
            $registro = null;
        }

        $return = new StdClass();

        if (count($aRegistros) > 0){

            $return->success = true;
            $return->data = $aRegistros;
        }
        else {
            $return->failure = true;
            $result->message = "Desculpe mas Nenhum resultado Foi Encontrado!";
        }


        return $return;
    }


    public function getPesagem($animal_id, $confinamento_id, $tipo, $data_order = 'DESC'){

        $db = $this->getDb();

        $sql = "SELECT * FROM pesagens WHERE animal_id = {$animal_id} AND confinamento_id = {$confinamento_id} AND tipo = $tipo ORDER BY data $data_order LIMIT 1;";

        $stm = $db->prepare($sql);
        $stm->execute();
        $pesagens = $stm->fetchAll(\PDO::FETCH_OBJ);

        return $pesagens[0];
    }

}
