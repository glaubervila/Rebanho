<?php
header('Content-Type: text/javascript; charset=UTF-8');

class Vendas extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "vendas";

    public function insert($data) {

        $db = $this->getDb();
        $query = 
        
        $query = 'INSERT INTO `vendas` (`confinamentos_id`, `cliente_id`, `data`, `quantidade`, `qtd_machos`, `qtd_femeas`, `status`, `numero_nota`, `serie_nota`, `valor_nota`, `peso_saida`, `peso_medio`, `maior_peso`, `menor_peso`, `permanencia_media`, `ganho_medio`) VALUES (:confinamentos_id, :cliente_id, :data, :quantidade, :qtd_machos, :qtd_femeas, :status, :numero_nota, :serie_nota, :valor_nota, :peso_saida, :peso_medio, :maior_peso, :menor_peso, :permanencia_media, :ganho_medio);';

        $stm = $db->prepare($query);

        $stm->bindValue(':confinamento_id', $data->confinamento_id);
        $stm->bindValue(':cliente_id', $data->cliente_id);
        $stm->bindValue(':data', $data->data);
        $stm->bindValue(':quantidade', $data->quantidade);
        $stm->bindValue(':qtd_machos', $data->qtd_machos);
        $stm->bindValue(':qtd_femeas', $data->qtd_femeas);
        $stm->bindValue(':status', $data->status);
        $stm->bindValue(':numero_nota', $data->numero_nota);
        $stm->bindValue(':serie_nota', $data->serie_nota);
        $stm->bindValue(':valor_nota', $data->valor_nota);
        $stm->bindValue(':peso_saida', $data->saida);
        $stm->bindValue(':peso_medio', $data->peso_medio);
        $stm->bindValue(':maior_peso', $data->maior_peso);
        $stm->bindValue(':menor_peso', $data->menor_peso);
        $stm->bindValue(':permanencia_media', $data->permanencia_media);
        $stm->bindValue(':ganho_medio', $data->ganho_medio);

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

        $db = $this->getDb();

        $query = 'UPDATE `vendas` SET `confinamentos_id` = :confinamentos_id, `cliente_id` = :cliente_id, `data` = :data, `quantidade` = :quantidade, `qtd_machos` = :qtd_machos, `qtd_femeas` = :qtd_femeas, `status` = :status, `numero_nota` = :numero_nota, `serie_nota` = :serie_nota, `valor_nota` = :valor_nota, `peso_saida` = :peso_saida, `peso_medio` = :peso_medio, `maior_peso` = :maior_peso, `menor_peso` = :menor_peso, `permanencia_media` = :permanencia_media, `ganho_medio` = :ganho_medio WHERE `id` = :id;';

        $stm = $db->prepare($query);

        $stm->bindValue(':id', $data->id);
        $stm->bindValue(':confinamento_id', $data->confinamento_id);
        $stm->bindValue(':cliente_id', $data->cliente_id);
        $stm->bindValue(':data', $data->data);
        $stm->bindValue(':quantidade', $data->quantidade);
        $stm->bindValue(':qtd_machos', $data->qtd_machos);
        $stm->bindValue(':qtd_femeas', $data->qtd_femeas);
        $stm->bindValue(':status', $data->status);
        $stm->bindValue(':numero_nota', $data->numero_nota);
        $stm->bindValue(':serie_nota', $data->serie_nota);
        $stm->bindValue(':valor_nota', $data->valor_nota);
        $stm->bindValue(':peso_saida', $data->saida);
        $stm->bindValue(':peso_medio', $data->peso_medio);
        $stm->bindValue(':maior_peso', $data->maior_peso);
        $stm->bindValue(':menor_peso', $data->menor_peso);
        $stm->bindValue(':permanencia_media', $data->permanencia_media);
        $stm->bindValue(':ganho_medio', $data->ganho_medio);

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
        $query->sql = "SELECT v.*, c.confinamento, cl.nome as cliente_nome, cl.razao_social as cliente_razao_social FROM vendas v INNER JOIN confinamentos c ON v.confinamento_id = c.id INNER JOIN clientes cl ON v.cliente_id = cl.id ";
        $query->limit = true;
        $query->order = true;

        $data = $this->fetchAll($query);

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