<?php
header('Content-Type: text/javascript; charset=UTF-8');

class Vacinas extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "vacinas";

    public function insert($data) {


        // Criar uma String de Descricao
        // Aftosa: Lab: Vallée - Lote:00/12
        $vacina = "{$data->nome} - Lab: {$data->laboratorio} - Lote: {$data->lote} - Fab: {$data->fabricacao} - Val: {$data->validade}";
        $data->vacina = $vacina;


        $db = $this->getDb();

        $query = 'INSERT INTO vacinas (confinamento_id, status, nome, laboratorio, lote, fabricacao, validade, vacina) VALUES (:confinamento_id, :status, :nome, :laboratorio, :lote, :fabricacao, :validade, :vacina)';


        $stm = $db->prepare($query);

        $stm->bindValue(':confinamento_id', $data->confinamento_id);
        $stm->bindValue(':status', $data->status);
        $stm->bindValue(':nome', $data->nome);
        $stm->bindValue(':laboratorio', $data->laboratorio);
        $stm->bindValue(':lote', $data->lote);
        $stm->bindValue(':fabricacao', $data->fabricacao);
        $stm->bindValue(':validade', $data->validade);
        $stm->bindValue(':vacina', $data->vacina);



        $stm->execute();

        $insert = $db->lastInsertId($query);

//         $values = implode(', ', (array)$data);
//         echo $values;

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

        // Criar uma String de Descricao
        // Aftosa: Lab: Vallée - Lote:00/12
        $vacina = "{$data->nome} - Lab: {$data->laboratorio} - Lote: {$data->lote} - Fab: {$data->fabricacao} - Val: {$data->validade}";
        $data->vacina = $vacina;

        $db = $this->getDb();

        $query = 'update ' . $this->getTable() . ' set confinamento_id = :confinamento_id, status = :status, nome= :nome, laboratorio = :laboratorio, lote = :lote, fabricacao = :fabricacao, validade = :validade, vacina = :vacina where id=:id';

        $stm = $db->prepare($query);

        $stm->bindValue(':id', $data->id);
        $stm->bindValue(':confinamento_id', $data->confinamento_id);
        $stm->bindValue(':status', $data->status);
        $stm->bindValue(':nome', $data->nome);
        $stm->bindValue(':laboratorio', $data->laboratorio);
        $stm->bindValue(':lote', $data->lote);
        $stm->bindValue(':fabricacao', $data->fabricacao);
        $stm->bindValue(':validade', $data->validade);
        $stm->bindValue(':vacina', $data->vacina);

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

        // Query para recuperar todos os fornecedores e o nome do confinamento
        $query = new StdClass();
        $query->sql = "SELECT vacinas.*, confinamentos.confinamento as confinamento FROM vacinas INNER JOIN confinamentos ON vacinas.confinamento_id = confinamentos.id ";
        $query->limit = true;
        $query->order = true;

        $data = $this->fetchAll($query);

        foreach ($data->data as $row){
            $record = $row;


            $records[] = $record;
        }


        $result = $data;

        echo json_encode($result);
    }

    public function getAt($data){
        $result = new StdClass();

        $data = $this->findAllBy($data['field'], $data['value'], $this->getTable());

        if ($data){
            $result->success = true;
            $result->data = $data;
        }
        else {
            $result->success = false;
        }
        echo json_encode($result);
    }
}