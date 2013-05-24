<?php

header('Content-Type: text/javascript; charset=UTF-8');

class Cepeas extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "cepea";

    public function insert($data) {

        $db = $this->getDb();

        $query = 'Insert into ' . $this->getTable() . ' (data, valor) Values(:data, :valor)';

        $stm = $db->prepare($query);

        $stm->bindValue(':data', $data->data);
        $stm->bindValue(':valor', $data->valor);

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

    public function update($data) {

        $db = $this->getDb();

        $query = 'update ' . $this->getTable() . ' set data = :data, valor = :valor where id=:id';

        $stm = $db->prepare($query);

        $stm->bindValue(':id', $data->id);
        $stm->bindValue(':data', $data->data);
        $stm->bindValue(':valor', $data->valor);

        $update = $stm->execute();

        if ($update) {
            $this->ReturnJsonSuccess($msg,$data);
        }
        else {
            $error = $stm->errorInfo();
            $this->ReturnJsonError($error);
        }
    }

    public function load(){

        $data = $this->fetchAll();

        foreach ($data->data as $row){
            $record = $row;
            $data = $record->data;
            $data_nova = implode(preg_match("~\/~", $data) == 0 ? "/" : "-", array_reverse(explode(preg_match("~\/~", $data) == 0 ? "-" : "/", $data)));
            $record->data_valor  =  $data_nova . " - R$ " . $record->valor;
            $records[] = $record;
        }
        $result = $records;

        echo json_encode($result);
    }

}
