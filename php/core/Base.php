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
        $this->config['dbname']   = "rebanho";
        $this->config['user']     = "root";
        $this->config['password'] = "";

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

        $data = $this->decode_utf8($data);

        if ($data->id > 0){
            $this->update($data);
        }
        else {
            $this->insert($data);
        }
    }

    public function find($id, $table) {
        $db = $this->getDb();
        if ($table) {
            $sql = "select * from " . $table . ' where id=:id';
        }
        else {
            $sql = "select * from " . $this->getTable() . ' where id=:id';
        }
        $stm = $db->prepare($sql);
        $stm->bindValue(':id', $id);
        $stm->execute();
        return $stm->fetchObject();
    }

    public function findBy($field, $value, $table) {
        $db = $this->getDb();
        if ($table) {
            $sql = "select * from " . $table . " where $field = $value";
        }
        else {
            $sql = "select * from " .$this->getTable(). " where $field = $value";
        }

        $stm = $db->prepare($sql);
        $stm->execute();
        return $stm->fetchObject();

    }

    public function fetchAll($query) {

        $start = $_GET['start'];
        $limit = $_GET['limit'];

        $sorts = json_decode($_GET['sort']);

        if ($sorts){
            foreach ($sorts as $sort) {

                if ($sort->property AND $dir = $sort->direction){
                    $orders[] = $sort->property . ' ' . $sort->direction;
                }
            }

            if ($orders[0]){
                $order = implode(', ', $orders );
            }
            else {
                $order = null;
            }
        }

        $db = $this->getDb();

        $db->exec("SET NAMES utf8");

        if ($query) {

            $sql = $query->sql;

            if ($query->order OR $order){
                if ($order){
                    $sql .= " ORDER BY $order";
                }
            }

            if ($query->limit OR $limit){
                if($start !== null && $start !== '' && $limit !== null && $limit !== ''){
                    $sql .= " LIMIT " . $start . " , " . $limit;
                }
            }

            $stm = $db->prepare($sql);
            $stm->execute();

            // Query para saber o Total
            $exp_reg = "#SELECT(.*)FROM(.*?)";
            if ($query->order OR $order){
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

            $total = $db->query($sql_total)->fetch();

            // Se Tiver Erro REFAZER ESSA PARTE!
            $error = $stm->errorInfo();
            if ($error[0] != 0){
                var_dump($error);
            }

        }
        else {
            $sql = "SELECT * FROM " . $this->getTable();

            if ($order) {
                $sql .= " ORDER BY $order ";
            }

            if($start !== null && $start !== '' && $limit !== null && $limit !== ''){
                $sql .= " LIMIT " . $start . " , " . $limit;
            }

            $stm = $db->prepare($sql);
            $stm->execute();

            // Se Tiver Erro REFAZER ESSA PARTE!
            $error = $stm->errorInfo();
            if ($error[0] != 0){
                var_dump($error);
            }

            $sql = "SELECT COUNT(*) AS total FROM " . $this->getTable();
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

        echo json_encode($return);
    }

    public function ReturnJson($obj){
        echo json_encode($obj);
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
}