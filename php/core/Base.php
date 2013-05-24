<?php
header('Content-Type: text/javascript; charset=UTF-8');

abstract class Base {

    protected $id = null;
    protected $database = null;
    protected $table = null;

    public function __construct(array $options=null, \PDO $database = null) {

        if (count($options))
            $this->setOptions($options);

            $this->config['adapter']  = "mysql";
            $this->config['hostname'] = "localhost";
            $this->config['dbname']   = "mmagropec";
            $this->config['user']     = "root";
            $this->config['password'] = "gverde";

//             $this->config['adapter']  = "mysql";
//             $this->config['hostname'] = "mysql01.mmagropec.com.br";
//             $this->config['dbname']   = "mmagropec";
//             $this->config['user']     = "mmagropec";
//             $this->config['password'] = "q1w2e3r4";


            $connection = new Connection();

            $this->database = $connection->getConnection($this->config);

    }

    public function setOptions(array $options) {
        $methods = get_class_methods($this);
        foreach ($options as $key => $value) {
            $method = 'set' . ucfirst($key);
            if (in_array($method, $methods))
                $this->$method($value);
        }
        return $this;
    }

    public function getId() {
        return $this->id;
    }

    public function setId($id) {
        if (!is_null($this->id))
            throw new \Exception('ID nao pode ser alterado');
        $this->id = (int) $id;
    }

    public function getTable() {
        return $this->table;
    }

    public function getDb() {
        return $this->database;
    }

    public function save($data) {

        if (is_array($data)){
            foreach ($data as $registro){
                $registro = $this->decode_utf8($registro);
                if ($registro->id > 0){
                    $this->update($registro);
                }
                else {
                    $this->insert($registro);
                }
            }
        }
        else {
            $data = $this->decode_utf8($data);

            // Se for update ou insercao em um unico registro
            if ($data->id > 0){
                $this->update($data);
            }
            else {
                $this->insert($data);
            }
        }
    }

    public function find($id, $table, $col = false, $debug = false) {
        $db = $this->getDb();

        $sql = "SELECT ";

        if ($col) {
            $sql .= " $col ";
        }
        else {
            $sql .= " * ";
        }
        if ($table) {
            $sql .= " FROM " . $table ;
        }
        else {
            $sql .= " FROM " .$this->getTable();
        }

        $sql .= ' WHERE id=:id';

        if ($debug) {
            echo $sql;
        }
        $stm = $db->prepare($sql);
        $stm->bindValue(':id', $id);
        $stm->execute();

        return $stm->fetchObject();
    }

    /**Metodo: findBy
     * Retorna UNICO Registro usando como filtro os campos filtro e value
     * pode receber um array de filtros e valores ou um valor unico
     * @param:$field - array ou string dos campos
     * @param:$value - array ou string dos valores
     * @param:$tabela - nome da tabela onde fazer a query
     */
    public function findBy($field, $value, $table, $debug = false) {
        $db = $this->getDb();

        $sql = "SELECT * FROM ";

        // Se Tiver Parametro Tabela
        if ($table) {
            $sql .= " $table ";
        }
        else {
            $sql .= ' '.$this->getTable().' ';
        }
        // Se os Filtros forem array
        if ((is_array($field)) && (is_array($value))){

            // Monta o Where Usando Formato para BindValue
            $sql .= ' WHERE ' . $this->setWhere($field, $value);

            $stm = $db->prepare($sql);

            // Para Cada Campo Executa um BindValue
            $k = 0;
            foreach ($field as $campo){
                $stm->bindValue(":$campo", $value[$k]);
                $k++;
            }
        }
        else {
            $sql .= " WHERE $field = $value";
            $stm = $db->prepare($sql);
        }
        if ($debug){
            echo "Query [$sql] Value [".implode(',',$value)."] ";
        }

        $stm->execute();

        return $stm->fetchObject();
    }

    public function findAllBy($field, $value, $table, $debug){

        $db = $this->getDb();
        if ($table) {
            $sql = "SELECT * FROM " . $table . " WHERE $field = $value";
        }
        else {
            $sql = "select * from " .$this->getTable(). " where $field = $value";
        }

        $stm = $db->prepare($sql);

        if ($debug){
            echo $sql;
        }

        $stm->execute();
        return $stm->fetchAll(\PDO::FETCH_OBJ);

    }

    public function getAt($col, $condicao, $table) {
        $db = $this->getDb();

        $sql = "SELECT ";

        if ($col) {
            $sql .= " $col ";
        }
        else {
            $sql .= " * ";
        }

        if ($table) {
            $sql .= " FROM " . $table ;
        }
        else {
            $sql .= " FROM " .$this->getTable();
        }

        if ($condicao) {
            $sql .= " WHERE $condicao";
        }

        $stm = $db->prepare($sql);
        $stm->execute();
        return $stm->fetchAll(\PDO::FETCH_OBJ);

    }


    /** Metodo: filter
     * Faz uma query usando filtro e ou ordenacao
     * Ex: SELECT * FROM tabela WHERE campo = value ORDER BY campo ASC LIMIT start, limit
     * @PARAM:{string}$col   = nome da coluna para o select ou varias separadas por ',', se nao for passado usa '*'
     * @PARAM:{string}$table = nome da tabela, se nao for passada usa a tabela da classe que executou o metodo
     * @PARAM:{string}$filter = uma string no formato '<campo> <condicao> <valor>' ou quando mais de um separados por AND ou OR
     * @PARAM:{string}$sort = string de Ordenacao no Formato '<campo> <direcao>' quando mais de um separados por ','
     * @PARAM:{bool}$limit = true usa o Limit pegando da Get o star e o limit, falso traz todos os registros
     * @RETURN:Vai retornar um array de resultados ou False
     */
    public function filter($col, $table, $filter, $sort, $limit = false, $debug = false){

        $db = $this->getDb();

        $sql = "SELECT ";

         if ($col) {
            $sql .= " $col ";
        }
        else {
            $sql .= " * ";
        }

        if ($table) {
            $sql .= " FROM " . $table ;
        }
        else {
            $sql .= " FROM " .$this->getTable();
        }

        if ($filter) {
            $sql .= " WHERE $filter";
        }

        if ($sort){
            $sql .= " ORDER BY $sort";
        }

        if ($limit){
            $start = $_GET['start'];
            $limit = $_GET['limit'];
            $sql .= " LIMIT ". $start . " , " . $limit;
        }
        if ($debug){
            echo $sql;
        }
        $stm = $db->prepare($sql);
        $stm->execute();
        return $stm->fetchAll(\PDO::FETCH_OBJ);

    }

    public function fetchAll($query, $debug = false) {

        $start = $_GET['start'];
        $limit = $_GET['limit'];

        $db = $this->getDb();

        $db->exec("SET NAMES utf8");

        if ($query) {

            $sql = $query->sql;

            if ($query->filter){
                $filter = $this->parseFilter($query->filter);
                if ($filter){
                    $sql .= " WHERE $filter ";
                }
            }

            if ($query->order){
                $sort = $this->parseSorter($query->order);
                if ($sort){
                    $sql .= " ORDER BY $sort";
                }
            }

            if ($query->limit){
                if($start !== null && $start !== '' && $limit !== null && $limit !== ''){
                    $sql .= " LIMIT " . $start . " , " . $limit;
                }
            }

            $stm = $db->prepare($sql);

            if ($debug){
                echo $sql;
            }

            $stm->execute();

            // Query para saber o Total
            $exp_reg = "#SELECT(.*)FROM(.*?)";
            if ($query->order OR $sort){
                if ($order){
                    $exp_reg .= "ORDER(.*)";
                }
            }
            if ($query->limit OR $limit){
                $exp_reg .= "LIMIT(.*)#is";
            }
            $sql_part = preg_replace($exp_reg, '$2', $sql);

            // Se nao Houver Ordenacao ou Paginacao Usar a query toda
            if (!$sql_part){
                $aPart = preg_split('/FROM/', $sql, 2);
                $sql_part = $aPart[1];
            }

            $sql_total = "SELECT COUNT(*) as total FROM " . $sql_part;

            if ($debug){
                echo $sql_total;
            }

            $total = $db->query($sql_total)->fetch();

            // Se Tiver Erro REFAZER ESSA PARTE!
            $error = $stm->errorInfo();
            if ($error[0] != 0){
                var_dump($error);
            }

        }
        else {
            // Montando String Filter (Where)
            $filter = $this->parseFilter($_GET['filter']);
            // Montando String Sort (Order)
            $sort = $this->parseSorter($_GET['sort']);


            $sql = "SELECT * FROM " . $this->getTable();

            if ($filter) {
                $sql .= " WHERE $filter";
            }

            if ($sort){
                $sql .= " ORDER BY $sort";
            }

            if ($limit){
                $start = $_GET['start'];
                $limit = $_GET['limit'];
                $sql .= " LIMIT ". $start . " , " . $limit;
            }
            if ($debug){
                echo $sql;
            }

            $stm = $db->prepare($sql);
            $stm->execute();

            // Se Tiver Erro REFAZER ESSA PARTE!
            $error = $stm->errorInfo();
            if ($error[0] != 0){
                var_dump($error);
            }

            $sql = "SELECT COUNT(*) AS total FROM " . $this->getTable();
            if ($filter) {
                $sql .= " WHERE $filter";
            }
            if ($debug){
                echo $sql;
            }
            $total = $db->query($sql)->fetch();

            // Se Tiver Erro REFAZER ESSA PARTE!
            $error = $stm->errorInfo();
            if ($error[0] != 0){
                var_dump($error);
            }

        }


        $result = new StdClass();
        $result->success = true;
        $result->data    = $stm->fetchAll(\PDO::FETCH_OBJ);
        $result->total   = $total['total'];

        return $result;
    }

    public function load($data){
        $result = $this->fetchAll();

        echo json_encode($result);
    }

    public function delete($data) {

        $arrRegistros = $data;

        $result = new StdClass();

        $db = $this->getDb();

        // Iniciando uma Transacao
        $db->beginTransaction();

        try {
            if (is_array($arrRegistros)) {
                $cnt = 0;

                foreach ($arrRegistros as $registro) {

                    $id = $registro->id;

                    $query = "delete from " . $this->table . " where id=:id";

                    $stm = $db->prepare($query);

                    $stm->bindValue(":id", $id);

                    $stm->execute();

                    $cnt++;
                }

                $msg = "<font color=\"blue\"><b>$cnt</b></font> Registros Excluídos Com <font color=\"green\"><b>Sucesso</b></font>!";

            }else {

                $id = $arrRegistros->id;

                $query = "delete from " . $this->table . " where id=:id";

                $stm = $db->prepare($query);

                $stm->bindValue(":id", $id);

                $stm->execute();

                $msg = "Registro excluído com <font color=\"green\"><b>Sucesso</b></font>";
            }

            $error = $stm->errorInfo();

            if ($error[0] != 0){

                // desfaz operacoes realizadas durante a transacao
                $db->rollback();

                $codigo = $error[1];
                $erro   = $error[2];

                $msg = "Desculpe mas houve uma falha,<br> e <font color=\"red\"><b>Não</b></font> foi possivel <font color=\"red\"><b>Excluir</b></font> o(s) Registros(s). <br> Se o problema persistir entre em contato com o administrador do sistema e informe a mensagem abaixo.<br>Código: $codigo  <br>Mensagem: $erro.";

                $result->failure = true;
                $result->message = $msg;

            }
            else {

                $db->commit();

                $result->success = true;
                $result->message = $msg;

            }

            return $result;
        }
        catch (PDOException $e) {
            // recebe a mensagem de erro
            $codigo = $e->getCode();
            $erro = $e->getMessage();

            // desfaz operacoes realizadas durante a transacao
            $db->rollback();

            $msg = "Desculpe mas houve uma falha,<br> e não foi possivel <font color=\"red\"><b>Excluir</b></font> o(s) Registros(s). <br> Se o problema persistir entre em contato com o administrador do sistema e informe a mensagem abaixo.<br>Código: $codigo  <br>Mensagem: $erro.";

            $result->failure = true;
            $result->message = $msg;

            return $result;
        }
    }

    public function destroy($data){

        if ($data){

            $result = $this->delete($data);

            $this->ReturnJson($result);
        }

    }


    public function ReturnJsonError($error,$msg){

        if ($error) {
            $codigo = $error[1];
            $erro   = $error[2];
            $msg = "Desculpe mas houve uma falha e não foi possivel realizar a operação...<br> Se o problema persistir entre em contato com o administrador do sistema e informe a mensagem abaixo.<br>Código: $codigo  <br>Mensagem: $erro.";
        }
        else {
            if (!$msg) {
                $msg = "Desculpe mas houve uma falha e não foi possivel realizar a operação...";
            }
        }
        echo json_encode(array(
            "failure" => "true",
            "message" => $msg
        ));
    }

    public function ReturnJsonSuccess($msg,$data){

        $return = new StdClass();

        $return->success = true;

        if (!$msg) {
            $return->message = "Operação Realizada com <font color=\"green\"><b>Sucesso</b></font>!";
        }
        else {
            $return->message = $msg;
        }

        if ($data){
            $return->data = $data;
        }

        die( json_encode($return) );
    }

    public function ReturnJson($obj){
        die( json_encode($obj) );
    }

    public function decode_utf8($data){
        $obj = new StdClass();

        foreach ($data as $key => $value){
            if (is_string($value)){
                $obj->$key = utf8_decode($value);
            }
            else {
                $obj->$key = $value;
            }
        }

        return $obj;
    }

    /** Metodo: converteData()
     * Recebe uma data no formato Y/m/d ou d/m/Y
     * e retorna no outro Formato
     */
    public function converteData($data){

        $tmp = preg_match("~T~", $data) == 0 ? $data : explode('T',$data);

        if (is_array($tmp)){
            $data = $tmp[0];
        }

        $data_nova = implode(preg_match("~\/~", $data) == 0 ? "/" : "-", array_reverse(explode(preg_match("~\/~", $data) == 0 ? "-" : "/", $data)));

        return $data_nova;
    }

    /** Metodo: DateToMysql()
     * Recebe uma data e Converte no Formato Y-m-d
     */
    public function DateToMysql($data){

        $tmp = preg_match("~T~", $data) == 0 ? $data : explode('T',$data);

        if (is_array($tmp)){
            $data = $tmp[0];
        }

        $arrData = explode(preg_match("~\/~", $data) == 0 ? "-" : "/", $data);

        $data_nova = implode('-',$arrData);

        return $data_nova;
    }

    /** Metodo: setWhere
     * Retorna uma String no Formato Field = $value
     * @param:array $fields - array de campos 
     * @param:array $values - array de valores
     * @param:string $comparacao - metodo de comparacao defaul ( = )
     * @param:bool $statement - Se tiver True Retorna String no Formato "field = :field"
     * se tiver false retorna no formato "field = value"
     */
    public function setWhere($fields, $values, $comparacao = '=', $statement = true){

        $qtd_fields = sizeof($fields);

        $k = 0;
        // montando where
        foreach ($fields as $field) {

            if ($comparacao == 'LIKE'){

                if ($statement){
                    $string .= " $field LIKE \"%:$field%\" ";
                }
                else {
                    $string .= " $field LIKE \"%$values[$k]%\" ";
                }
            }
            else {
                if ($statement){
                    $string .= " $field $comparacao :$field ";
                }
                else {
                    $string .= " $field $comparacao $values[$k] ";
                }
            }

            if ($qtd_fields > 1 and $k < ($qtd_fields -1 )) {$string .= " AND ";}

            $k++;
        }

        return $string;
    }


    /** Metodo: parseFilter
     * Recebe um array vindo do Post ou do Get ou uma string em Json que sera convertida em array,
     * para cada registro no array vai montar uma string no formato '<property> <condiction> <value>'.
     * para ser usado na clausula WHERE da query
     * @PARAM:{array}$aFilters= array com com os parametros de filtro, ou string em json
     * @RETURN:{string}$filter
     * OBS: falta implementar a condicao atualmente so faz com sinal de igualdade
     */
    public function parseFilter($aFilters){

        if (!is_array($aFilters)){
            $filtros = json_decode($aFilters);
        }
        else {
            $filtros = $aFilters;
        }

        foreach ($filtros as $filtro){
            // Só Adiciona o Filtro se esse tiver Valor
            if ($filtro->value){
                $aStrings[] = "{$filtro->property} = \"{$filtro->value}\"";
            }
        }

        $string = implode($aStrings, ' AND ');

        return $string;

    }

    /** Metodo: parseSorter
     * Recebe um array vindo do Post ou do Get ou uma string em Json que sera convertida em array,
     * para cada registro no array vai montar uma string no formato '<property> <direction>'.
     * para ser usado na Ordenacao da query
     * @PARAM:{array}$aSorters= array com com os parametros de ordenacao, ou string em json
     * @RETURN:{string}$sort
     */
    public function parseSorter($aSorters){

        if (!is_array($aSorters)){
            $sorters = json_decode($aSorters);
        }
        else {
            $sorters = $aSorters;
        }

        foreach ($sorters as $sort){

            $aStrings[] = "{$sort->property}" .' '. "{$sort->direction}";
        }

        $string = implode($aStrings, ', ');

        return $string;

    }

    /** Metodo: updateCampo
     * Recebe um campo e um valor e altera faz update neste campo
     * para um determinado id
     * @param:$id = id do animal que vai receber a alteracao
     * @param:$campo = campo a ser alterado
     * @param:$value = valor a ser alterado
     * @param:$table = nome da tabela a ser alterada
     */
    public function updateCampo($id, $campo, $value, $table){

        $db = $this->getDb();

        $sql = "UPDATE {$table} SET {$campo} = :{$campo} WHERE id = :id";

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
            $result->msg = "Falha ao Alterar o Campo {$campo} Valor {$value}";
            $result->error = $stm->errorInfo();
        }

        return $result;
    }

    /** diferencaEntreDatas($data_inicial, $data_final)
     * Recebe 2 datas no formato 'Y-m-d' '2012-10-25'
     * transforma em time stamp, faz a subtracao e transforma a diferenca em dias
     * @Return: retorna a quantidade de dias de diferenca
     * @param: $data_inicial
     * @param: $data_final
     */
    public function diferencaEntreDatas($data_inicial, $data_final){

        // Usa a função strtotime() e pega o timestamp das duas datas:
        $time_inicial = strtotime($data_inicial);
        $time_final = strtotime($data_final);

        // Calcula a diferença de segundos entre as duas datas:
        $diferenca = $time_final - $time_inicial; // 19522800 segundos

        // Calcula a diferença de dias
        $dias = (int)floor( $diferenca / (60 * 60 * 24)); // 225 dias

        return $dias;
    }


    public function dateBr($data){
        if ($data){
            $aData = explode('-',$data);
            $yy = $aData[0];
            $mm = $aData[1];
            $dd = $aData[2];

            $y =  substr($yy, -2);
            $data_nova = "$dd/$mm/$y";
            return $data_nova;
        }
    }

}
