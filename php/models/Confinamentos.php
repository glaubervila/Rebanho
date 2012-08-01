<?php
header('Content-Type: text/javascript; charset=UTF-8');

class Confinamentos extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "confinamentos";

    public function insert($data) {

        $db = $this->getDb();

        $query = 'Insert into ' . $this->getTable() . ' (confinamento) Values(:confinamento)';

        $stm = $db->prepare($query);

        $stm->bindValue(':confinamento', $data->confinamento);

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

        $query = 'update ' . $this->getTable() . ' set confinamento=:confinamento where id=:id';

        $stm = $db->prepare($query);

        $stm->bindValue(':id', $data->id);
        $stm->bindValue(':confinamento', $data->confinamento);

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