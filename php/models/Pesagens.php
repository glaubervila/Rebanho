<?php

header('Content-Type: text/javascript; charset=UTF-8');

class Pesagens extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "pesagens";


    public function insert($data){

        // Verificar se o Registro e UNICO
        // Chave UNIQUE = confinamento_id + animal_id + tipo
        $unique = $this->findBy(array('confinamento_id','animal_id','tipo'), array($data->confinamento_id, $data->animal_id, $data->tipo), 'pesagens');

        if ($unique){
            $data->id = $unique->id;
            Pesagens::update($data);
        }
        else {
            $db = $this->getDb();

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

            if ($insert) {

                $newData = $data;
                $newData->id = $insert;

                $this->ReturnJsonSuccess($msg,$data);
            }
            else {
                $error = $stm->errorInfo();
                $this->ReturnJsonError($error);
            }
        }
    }

    public function update($data){

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

        if ($update) {
            $this->ReturnJsonSuccess($msg,$data);
        }
        else {
            $error = $stm->errorInfo();
            $this->ReturnJsonError($error);
        }
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
            $quadra = $this->find($row->quadra_id, 'quadras', 'quadra');
            $registro->quadra = $quadra->quadra;

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
     */
    public function criarPesagemCompra($compra_id){

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
}
