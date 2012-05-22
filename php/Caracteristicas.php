<?php

require_once 'Db/Base.php';

header('Content-Type: text/javascript; charset=UTF-8');

class Caracteristicas extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "caracteristicas";

    public function insert($data) {

        $db = $this->getDb();

        $query = 'Insert into ' . $this->getTable() . ' (codigo, descricao) Values(:codigo, :descricao)';

        $stm = $db->prepare($query);

        $stm->bindValue(':codigo', $data->codigo);
        //$stm->bindValue(':descricao', utf8_decode($data->descricao));
        $stm->bindValue(':descricao', $data->descricao);

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

        $query = 'update ' . $this->getTable() . ' set codigo=:codigo, descricao=:descricao where id=:id';

        $stm = $db->prepare($query);

        $stm->bindValue(':id', $data->id);
        $stm->bindValue(':codigo', $data->codigo);
        $stm->bindValue(':descricao', $data->descricao);

        $update = $stm->execute();

        if ($update) {
            $this->ReturnJsonSuccess($msg,$data);
        }
        else {
            $error = $stm->errorInfo();
            $this->ReturnJsonError($error);
        }

    }

    public function destroy($data){

        if ($data){

            $result = $this->delete($data);

            $this->ReturnJson($result);
        }

    }
}

new Caracteristicas();

