<?php

require_once 'Connection.php';

header('Content-Type: text/javascript; charset=UTF-8');

abstract class Base {

    protected $id = null;
    protected $database = null;
    protected $table = null;

    public function __construct(array $options=null, \PDO $database = null) {
        if (count($options))
            $this->setOptions($options);

        $this->config['adapter'] = "mysql";
        $this->config['hostname'] = "localhost";
        $this->config['dbname'] = "rebanho";
        $this->config['user'] = "root";
        $this->config['password'] = "";

        $connection = new Connection();

        $this->database = $connection->getConnection($this->config);

        switch ($_SERVER['REQUEST_METHOD']) {

            case 'GET':
                call_user_func(array($this, 'load'));

                break;

            case 'POST':
                $info = $_POST['data'];

                $data = json_decode($info);

                call_user_func(array($this, 'save'),$data);

                break;

            case 'PUT':
                parse_str(file_get_contents("php://input"), $post_vars);
 
                $info = $post_vars['data'];

                //$data = json_decode(stripslashes($info));
                $data = json_decode($info);
                call_user_func(array($this, 'save'),$data);

                break;

            case 'DELETE':
                parse_str(file_get_contents("php://input"), $post_vars);

                $info = $post_vars['data'];

                $data = json_decode($info);

                call_user_func(array($this, 'destroy'), $data);

                break;
        }
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

    public function find($id) {
        $db = $this->getDb();
        $stm = $db->prepare("select * from " . $this->getTable() . ' where id=:id');
        $stm->bindValue(':id', $id);
        $stm->execute();
        return $stm->fetch(\PDO::FETCH_ASSOC);
    }

    public function fetchAll($query) {

        $start = $_GET['start'];
        $limit = $_GET['limit'];

        //$sort = $_GET['sort'] ? $_GET['sort'] : 'nome';
        $sorts = json_decode($_GET['sort']);
        //$dir = $_GET['dir'] ? $_GET['dir'] : 'ASC';
        //$order = $sort['property'] . ' ' . $dir;
        if ($sorts){
            foreach ($sorts as $sort) {
//                 $col = $sort->property  ? $sort->property  : 'id';
//                 $dir = $sort->direction ? $sort->direction : 'ASC';
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

            if ($order){
                $sql .= " ORDER BY :order";
            }

            if ($query->limit){
                if($start !== null && $start !== '' && $limit !== null && $limit !== ''){
                    $sql .= " LIMIT " . $start . " , " . $limit;
                }
            }

            if ($order){
                $stm = $db->prepare($sql);
                $stm->bindValue(":order", $order);
            }

            $stm->execute();

            $error = $stm->errorInfo();

            if ($error[0] != 0){
                var_dump($error);
            }

            // Query para saber o Total
            $sql_part = preg_replace("#SELECT(.*)FROM(.*?)ORDER(.*)LIMIT(.*)#is", '$2', $sql);

            $sql_total = "SELECT COUNT(*) as total FROM " . $sql_part;
            //var_dump($sql_total);
            $total = $db->query($sql_total)->fetch();
        }
        else {
            $sql = "select * from " . $this->getTable() . " order by :order";

            if($start !== null && $start !== '' && $limit !== null && $limit !== ''){
                $sql .= " LIMIT " . $start . " , " . $limit;
            }

            $stm = $db->prepare($sql);
            $stm->bindValue(":order", $order);

            $stm->execute();

            $sql = "SELECT COUNT(*) AS total FROM " . $this->getTable();
            $total = $db->query($sql)->fetch();

        }


        $result = new StdClass();
        $result->success = true;
        $result->data    = $stm->fetchAll(\PDO::FETCH_ASSOC);
        $result->total   = $total['total'];

        return $result;
    }

    public function load(){

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
}