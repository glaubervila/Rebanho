<?php

require_once 'Db/Base.php';

header('Content-Type: text/javascript; charset=UTF-8');

class Fornecedores extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "fornecedores";

    public function insert($data) {

        $db = $this->getDb();

        $query = 'INSERT INTO ' . $this->getTable() . ' (nome, fazenda, cnpj_cpf, ie_rg, logradouro, numero, complemento, municipio, uf, cep, corretor, telefone, telefone2, email, observacao, confinamento_id) VALUES (:nome, :fazenda, :cnpj_cpf, :ie_rg, :logradouro, :numero, :complemento, :municipio, :uf, :cep, :corretor, :telefone, :telefone2, :email, :observacao, :confinamento_id)';


        $stm = $db->prepare($query);

        $stm->bindValue(':nome', $data->nome);
        $stm->bindValue(':fazenda', $data->fazenda);
        $stm->bindValue(':cnpj_cpf', $data->cnpj_cpf);
        $stm->bindValue(':ie_rg', $data->ie_rg);
        $stm->bindValue(':logradouro', $data->logradouro);
        $stm->bindValue(':numero', $data->numero);
        $stm->bindValue(':complemento', $data->complemento);
        $stm->bindValue(':municipio', $data->municipio);
        $stm->bindValue(':uf', $data->uf);
        $stm->bindValue(':cep', $data->cep);
        $stm->bindValue(':corretor', $data->corretor);
        $stm->bindValue(':telefone', $data->telefone);
        $stm->bindValue(':telefone2', $data->telefone2);
        $stm->bindValue(':email', $data->email);
        $stm->bindValue(':observacao', $data->observacao);
        $stm->bindValue(':confinamento_id', $data->confinamento_id);

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

        $query = 'update ' . $this->getTable() . ' set nome = :nome, fazenda = :fazenda, cnpj_cpf = :cnpj_cpf, ie_rg = :ie_rg, logradouro = :logradouro, numero = :numero, complemento = :complemento, municipio = :municipio, uf = :uf, cep = :cep, corretor = :corretor, telefone = :telefone, telefone2 = :telefone2, email = :email, observacao = :observacao, confinamento_id = :confinamento_id where id=:id';

        $stm = $db->prepare($query);

        $stm->bindValue(':id', $data->id);
        $stm->bindValue(':nome', $data->nome);
        $stm->bindValue(':fazenda', $data->fazenda);
        $stm->bindValue(':cnpj_cpf', $data->cnpj_cpf);
        $stm->bindValue(':ie_rg', $data->ie_rg);
        $stm->bindValue(':logradouro', $data->logradouro);
        $stm->bindValue(':numero', $data->numero);
        $stm->bindValue(':complemento', $data->complemento);
        $stm->bindValue(':municipio', $data->municipio);
        $stm->bindValue(':uf', $data->uf);
        $stm->bindValue(':cep', $data->cep);
        $stm->bindValue(':corretor', $data->corretor);
        $stm->bindValue(':telefone', $data->telefone);
        $stm->bindValue(':telefone2', $data->telefone2);
        $stm->bindValue(':email', $data->email);
        $stm->bindValue(':observacao', $data->observacao);
        $stm->bindValue(':confinamento_id', $data->confinamento_id);

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
        $query->sql = "SELECT fornecedores.*, confinamentos.confinamento as confinamento FROM fornecedores INNER JOIN confinamentos ON fornecedores.confinamento_id = confinamentos.id ";
        $query->limit = true;
        $query->order = true;

        $data = $this->fetchAll($query);

        $result = $data;

        echo json_encode($result);
    }
}

new Fornecedores();

