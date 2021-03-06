<?php
header('Content-Type: text/javascript; charset=UTF-8');

class Quadras extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "quadras";

    public function insert($data) {

        $db = $this->getDb();

        $query = 'Insert into ' . $this->getTable() . ' (confinamento_id, quadra) Values(:confinamento_id, :quadra)';

        $stm = $db->prepare($query);

        $stm->bindValue(':confinamento_id', $data->confinamento_id);
        $stm->bindValue(':quadra', $data->quadra);

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

        $query = 'update ' . $this->getTable() . ' set confinamento_id = :confinamento_id, quadra = :quadra where id=:id';

        $stm = $db->prepare($query);

        $stm->bindValue(':id', $data->id);
        $stm->bindValue(':confinamento_id', $data->confinamento_id);
        $stm->bindValue(':quadra', $data->quadra);

        $update = $stm->execute();

        if ($update) {
            $this->ReturnJsonSuccess($msg,$data);
        }
        else {
            $error = $stm->errorInfo();
            $this->ReturnJsonError($error);
        }
    }

    public function load($data){

        // Query para recuperar todas as quadras e o nome do confinamento
        $query = new StdClass();
        $query->sql = "SELECT quadras.*, confinamentos.confinamento FROM quadras INNER JOIN confinamentos ON quadras.confinamento_id = confinamentos.id ";

        $query->filter = $data["filter"];
        $query->limit = true;
        $query->order = true;


        $result = $this->fetchAll($query);

        echo json_encode($result);
    }


    public function destroy($data){

        if ($data){

            $result = $this->delete($data);

            $this->ReturnJson($result);
        }

    }


    public function getQuantidadeQuadra($confinamento_id, $quadra_id, $status = 1, $sexo){

        if ($confinamento_id) {
            $filter[] = "confinamento_id = {$confinamento_id}";
        }
        if ($quadra_id) {
            $filter[] = "quadra_id = {$quadra_id}";
        }
        if ($status) {
            $filter[] = "status = {$status}";
        }
        if ($status) {
            $filter[] = "sexo = '{$sexo}'";
        }


        $strFilter = implode(' AND ', $filter);

        $qtd_animais = $this->filter('COUNT(*) AS quantidade', 'animais', $strFilter, null, false);

        return $qtd_animais[0]->quantidade;
    }

    public function getNomeQuadra($quadra_id){
        $quadra = $this->find($quadra_id, 'quadras', 'quadra');
        return $quadra->quadra;
    }
}