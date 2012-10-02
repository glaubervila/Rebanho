<?php
header('Content-Type: text/javascript; charset=UTF-8');
/** @Class: Animais
 *  @date: 2012-07-01
 */

class Animais extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "animais";


    /** Metodo: CadastroAnimais
     * @PARAM:$animais - array de objetos animais
     * esse metodo recebe um array de animais,
     * insere um a um criando seus codigos,
     * fazendo lancamento de ocorrencia de entrada,
     * se houver falha eu um dos registros retorna falha e nao grava nenhum
     * Usado para dar entrada em um grupo de animais
     */
    public function CadastroAnimais($animais) {

        $db = $this->getDb();

        // Usar Transacao
        $db->beginTransaction();

        // Recuperar o Ultimo id
        $ultimo_id = $this->getAt('MAX(id) as id', null, 'animais');
        $next_id = ($ultimo_id[0]->id + 1);

        $ultimo_codigo = $this->getAt('MAX(id) as id', null, 'animais_codigos');
        $next_codigo = ($ultimo_codigo[0]->id + 1);

//         $ultima_ocorrencia = $this->getAt('MAX(id) as id', null, 'ocorrencias');
//         $next_ocorrencia = ($ultima_ocorrencia[0]->id + 1);

        // Para Cada Animal fazer o Insert
        foreach ($animais as $animal) {

            $query = 'INSERT INTO animais (id, confinamento_id, quadra_id, compra_id, fornecedor_id, caracteristica_id, sisbov, sexo, idade, classificacao, escore, status) VALUES (:id, :confinamento_id, :quadra_id, :compra_id, :fornecedor_id, :caracteristica_id, :sisbov, :sexo, :idade, :classificacao, :escore, :status)';

            $stm = $db->prepare($query);
            $stm->bindValue(':id', $next_id);
            $stm->bindValue(':confinamento_id', $animal->confinamento_id);
            $stm->bindValue(':quadra_id', $animal->quadra_id);
            $stm->bindValue(':compra_id', $animal->compra_id);
            $stm->bindValue(':fornecedor_id', $animal->fornecedor_id);
            $stm->bindValue(':caracteristica_id', $animal->caracteristica_id);
            $stm->bindValue(':sisbov', $animal->sisbov);
            $stm->bindValue(':sexo', $animal->sexo);
            $stm->bindValue(':idade', $animal->idade);
            $stm->bindValue(':classificacao', $animal->classificacao);
            $stm->bindValue(':escore', $animal->escore);
            $stm->bindValue(':status', 1);

            $stm->execute();

            $idAnimal = $db->lastInsertId($query);

            $error = $stm->errorInfo();

            // Se tiver Erro Para Tudo
            if ($error[0] != 0 ){
                break;
            }

            // Cadastro dos Codigos

            if ($animal->codigos){
                foreach ($animal->codigos as $codigo){

                    // Query de Insert dos Codigos
                    $query_codigos = "INSERT INTO animais_codigos (id, confinamento_id, animal_id, codigo, tipo, data) VALUES (:id, :confinamento_id, :animal_id, :codigo, :tipo, :data);";

                    $stm = $db->prepare($query_codigos);

                    // Setando Valores Codigos
                    $stm->bindValue(':id', $next_codigo);
                    $stm->bindValue(':confinamento_id', $codigo->confinamento_id);
                    $stm->bindValue(':animal_id', $idAnimal);
                    $stm->bindValue(':codigo', $codigo->codigo);
                    $stm->bindValue(':tipo', $codigo->tipo);
                    $stm->bindValue(':data', $codigo->data);

                    $stm->execute();

                    $error = $stm->errorInfo();

                    // Se tiver Erro Para Tudo
                    if ($error[0] != 0 ){
                        break;
                    }
                }
            }

            // Lancamento de Ocorrencia de Entrada

            if ($idAnimal){

                $confinamento = $this->findBy('id', $animal->confinamento_id, 'confinamentos');

                $descricao = "Entrada - {$confinamento->confinamento}";

                $query_ocorrencia = "INSERT INTO ocorrencias (confinamento_id, quadra_id, animal_id, ocorrencia, descricao, data, tipo) VALUES (:confinamento_id, :quadra_id, :animal_id, :ocorrencia, :descricao, :data, :tipo);";

                $stm = $db->prepare($query_ocorrencia);

                $stm->bindValue(':confinamento_id', $animal->confinamento_id);
                $stm->bindValue(':quadra_id', $animal->quadra_id);
                $stm->bindValue(':animal_id', $idAnimal);
                $stm->bindValue(':tipo', 1);
                $stm->bindValue(':ocorrencia', 'Entrada');
                $stm->bindValue(':descricao', $descricao);
                $stm->bindValue(':data', $codigo->data);

                $stm->execute();

                $error = $stm->errorInfo();

                // Se tiver Erro Para Tudo
                if ($error[0] != 0 ){
                    break;
                }
            }

            // incremento do Ultimo Id
            $next_id++;
            $next_codigo++;
        }

        $result = new StdClass();

        if ($error[0] != 0 ){

            $db->rollback();

            $result->success = false;
            $result->error = $error;
        }
        else {

            $db->commit();
            $result->success = true;
        }

        return $result;
    }


    /** Metodo:getCodigosById
     * @PARAM:$animal_id - Chave do Animal
     * @PARAM:$confinamento_id - Codigo do Confinamento
     * Recebe uma chave de animal e retorna todos os codigos,
     * se tiver confinamento_id so retorna o codigo para aquele confinamento
     */
    public function getCodigosById($animal_id, $confinamento_id){

        // Se Houver o Parametro confinamento_id retornar so o codigo para aquele confinamento
        if ($confinamento_id){

            $sql = "SELECT * FROM animais_codigos WHERE animal_id = {$animal_id} AND confinamento_id = {$confinamento_id}";

        }
        else {
        // Retornar Todos os Codigos para o animal
        }

        $db = $this->getDb();
        $stm = $db->prepare($sql);
        $stm->execute();
        return $stm->fetchAll(\PDO::FETCH_OBJ);
    }

    /** Metodo:getIdByCodigo
     * @PARAM:$codigo - Codigo do Animal
     * Recebe um codigo de animal e retorna o id do animal,
     * @return:$id = chave interna do animal
     */
    public function getIdByCodigo($data, $json = true){

        $codigo       = $data["codigo"];
        $confinamento = $data["confinamento"];

        if ($confinamento) {
            $sql = "SELECT animal_id FROM animais_codigos WHERE codigo = {$codigo} AND confinamento_id = {$confinamento};";
        }
        else {
            $sql = "SELECT animal_id FROM animais_codigos WHERE codigo = {$codigo};";
        }

        $db = $this->getDb();
        $stm = $db->prepare($sql);
        $stm->execute();

        $animal_codigo = $stm->fetchObject();

        $result = new StdClass();

        if ($animal_codigo) {
            $result->success = true;
            $result->animal_id = $animal_codigo->animal_id;
            $result->animal = $this->getAnimal($animal_codigo->animal_id);
        }
        else {
            $result->failure = true;
            $result->message = "Desculpe, mais <font color='red'>Nenhum</font> Animal foi encontrado.<br> Verifique se este código abaixo está correto<br> Código: <font color='red'>{$codigo}</font>";
        }

        if ($data["returnJson"] or $json){
            echo json_encode($result);
        }
        else {
            return $result;
        }

    }

    public function getAnimal($animal_id){

        $animal = $this->find($animal_id, 'animais');

        // Informacoes do Codigo
        $codigos = $this->getCodigosById($animal->id, $animal->confinamento_id);
        $animal->codigo = $codigos[0]->codigo;

        // Informacoes da Compra
        $compra = $this->findBy('id', $animal->compra_id, 'compras');
        $animal->fornecedor_id = $compra->fornecedor_id;
        $animal->idade_entrada = $compra->idade;
        $animal->valor_arroba = $compra->valor_arroba;
        $animal->numero_nota = $compra->numero_nota;
        $animal->serie_nota = $compra->serie_nota;


        // Informacoes do Fornecedor
        $fornecedor = $this->findBy('id', $animal->fornecedor_id, 'fornecedores');
        $animal->fornecedor = $fornecedor->nome;

        // Informacoes da Quadra
        $quadra = $this->find($animal->quadra_id, 'quadras', 'quadra');
        $animal->quadra = $quadra->quadra;

        // Estatisticas do Animal
        $estatistica = $this->getEstatiscaPorAnimal($animal->id);
        $animal->peso_entrada        = $estatistica->peso_entrada;
        $animal->data_entrada        = $estatistica->data_entrada;
        $animal->peso_atual          = $estatistica->peso_atual;
        $animal->data_ultima_pesagem = $estatistica->data_ultima_pesagem;
        $animal->dias_confinamento   = $estatistica->dias_confinamento;
        $animal->peso_ganho          = $estatistica->peso_ganho;
        $animal->ganho_diario        = $estatistica->ganho_diario;

        // Calcular Idade Atual
        $animal->idade = $this->calcularIdade($compra->idade, $animal->dias_confinamento);


        return $animal;
    }


    public function getAnimaisAtivos($data){

        $strFiltros = $this->parseFilter($data["filter"]);
//        $strSorters = $this->parseSorter($data["sort"]);

        $aResult = $this->filter(null, 'animais', $strFiltros, null, false);

        // Recuperar as Informacoes de cada animal
        foreach ($aResult as $row){

            $registro = $row;

            // Informacoes do Codigo
            $codigos = $this->getCodigosById($row->id, $row->confinamento_id);
            $registro->codigo = $codigos[0]->codigo;

            // Informacoes da Quadra
            $quadra = $this->find($row->quadra_id, 'quadras', 'quadra');
            $registro->quadra = $quadra->quadra;

            $estatistica = $this->getEstatiscaPorAnimal($row->id);
            $registro->peso_entrada        = $estatistica->peso_entrada;
            $registro->data_entrada        = $estatistica->data_entrada;
            $registro->peso_atual          = $estatistica->peso_atual;
            $registro->data_ultima_pesagem = $estatistica->data_ultima_pesagem;
            $registro->dias_confinamento   = $estatistica->dias_confinamento;
            $registro->peso_ganho          = $estatistica->peso_ganho;
            $registro->ganho_diario        = $estatistica->ganho_diario;

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


    /** Metodo: getEstatiscaPorAnimal()
     * Recebe um id de animal
     * Recupera o Confinamento Atual do Animal
     * Recupera o Peso e Data de Entrada no confinamento
     * Recupera o Peso Atual e a ultima pesagem
     * Calcula o Tempo que o Animal ta nesse Confinamento
     * Calcula o Ganho Diario desse Animal
     * @param:$animal = chave da tabela animais
     * @return:
     *     $obj->data_entrada
     *     $obj->peso_entrada
     *     $obj->data_ultima_pesagem
     *     $obj->peso_atual
     *     $obj->tempo_confinamento
     *     $obj->ganho_diario
     */
    public function getEstatiscaPorAnimal($animal){

        $obj = new StdClass();

        // Recuperando o Animal
        $animal = $this->find($animal, 'animais');

        // Informacoes de Peso de Entrada
        $peso_entrada = Pesagens::getPesagemEntrada($animal->id, $animal->confinamento_id);
        $obj->peso_entrada = $peso_entrada->peso;
        $obj->data_entrada = $peso_entrada->data;

        // Informacoes de Peso de Atual
        $peso_recente = Pesagens::getPesagemRecente($animal->id, $animal->confinamento_id);
        $obj->peso_atual          = $peso_recente->peso;
        $obj->data_ultima_pesagem = $peso_recente->data;

        // Calculando o Tempo no Confinamento
        $data_entrada = strtotime($obj->data_entrada);
        $data_atual   = strtotime(date('Y-m-d'));
        //transformação do timestamp em  dias
        $obj->dias_confinamento = ($data_atual-$data_entrada)/86400;

        // So Calcular se houver pesagem atual
        if ($obj->peso_atual > 0){
            // Peso Ganho neste Confinamento
            $peso_ganho = ($obj->peso_atual - $obj->peso_entrada);
            $obj->peso_ganho = number_format($peso_ganho, 3, '.',',');

            // Calculando a Media Diaria de Peso Ganho

            $ganho_diario = ($obj->peso_ganho / $obj->dias_confinamento);
            $obj->ganho_diario = number_format($ganho_diario, 3, '.',',');
        }
        else {
            $obj->peso_ganho = 0;
            $obj->peso_ganho = 0;
        }
        return $obj;
    }

    /** Metodo: updateCampoAnimal
     * Recebe um campo e um valor e altera faz update neste campo
     * para um determinado id
     * @param:$id = id do animal que vai receber a alteracao
     * @param:$campo = campo a ser alterado
     * @param:$value = valor a ser alterado
     */
    public function updateCampoAnimal($id, $campo, $value){
        //echo "ENTROU NO UPDATE";

        $db = $this->getDb();

        $sql = "UPDATE animais SET {$campo} = :{$campo} WHERE id = :id";

        $stm = $db->prepare($sql);

        $stm->bindValue(':id', $id);
        $stm->bindValue(":{$campo}", $value);

        $update = $stm->execute();

        $result = new StdClass();

        if ($update) {
            $result->success = true;
            $result->msg = "Operação Realizada com Sucesso!";
        }
        else {
            $result->success = false;
            $result->id  = $data->id;
            $result->msg = "Falha ao Alterar o Campo {$campo} Valor {$value}";
            $result->error = $stm->errorInfo();
        }

        return $result;
    }


    public function alterarCodigo($data, $json = true){

        $result = new StdClass();

        $db = $this->getDb();

        $unique = $this->findBy(array('codigo'), array($data->codigo), 'animais_codigos');

        if ($unique){
            // Se o Codigo ja existir
            $result->failure = true;
            $result->id  = $data->id;
            $result->msg = "Esse Código <b>{$unique->codigo}</b> já está em uso! ";
        }
        else {

            $animal = $this->find($data->id, 'animais');

            $sql = "UPDATE animais_codigos SET codigo = :codigo WHERE animal_id = :animal_id AND confinamento_id = :confinamento_id";

            $stm = $db->prepare($sql);

            $stm->bindValue(':animal_id', $data->id);
            $stm->bindValue(':codigo', $data->codigo);
            $stm->bindValue(':confinamento_id', $animal->confinamento_id);

            $update = $stm->execute();

            if ($update) {
                $result->success = true;
                $result->msg = "Operação Realizada com Sucesso!";
            }
            else {
                $result->failure = true;
                $result->id  = $data->id;
                $result->msg = "Falha ao Alterar o Codigo {$data->codigo} do Animal";
                $result->error = $stm->errorInfo();
            }
        }

        if ($json){
            echo json_encode($result);
        }
        else {
            return $result;
        }
    }

    /**Metodo: localizarAnimal
     * faz uma busca usando um filtro e retorna um objAnimal
     */
    public function localizarAnimal($data, $json = true){

        // Cria o Obj de Retorno
        $return = new StdClass();

        // Recupera o Id do Animal
        $animal_id = Animais::getIdByCodigo($data, false);


        // Se Encontrou
        if ($animal_id->success){
            $return->success = true;
            $return->data = $animal_id->animal;
        }
        else {
            // Se nao Encontrou retorna erro
            $return = $animal_id;
        }


        if ($json){
            echo json_encode($return);
        }
        else {
            return $return;
        }
    }


    public function calcularIdade($idade_entrada, $dias_confinamento) {

        // A idade de Entrada está em meses
        // transformar em dias
        $idade_entrada_dias = ($idade_entrada * 30);
        // total de dias que entrou + o total de dias confinado / 30 para virar mes de novo
        $idade_mes = round(($idade_entrada_dias + $dias_confinamento)/30);

        return $idade_mes;
    }

}