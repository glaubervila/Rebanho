<?php
header('Content-Type: text/javascript; charset=UTF-8');

class CompraAnimais extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "compras";

    public function insert($data) {

        $db = $this->getDb();

        $db->beginTransaction();

        $query = 'INSERT INTO rebanho.compras (fornecedor_id, caracteristica_id, confinamento_id, data_compra, numero_nota, serie_nota, quantidade, valor_nota, data_pesagem, peso_entrada, peso_saida, classificacao, escore, idade, qtd_machos, qtd_femeas, corretor, valor_comissao, frete, valor_frete, imposto, valor_imposto, valor_arroba, premio, quadra_id) VALUES (:fornecedor_id, :caracteristica_id, :confinamento_id, :data_compra, :numero_nota, :serie_nota, :quantidade, :valor_nota, :data_pesagem, :peso_entrada, :peso_saida, :classificacao, :escore, :idade, :qtd_machos, :qtd_femeas, :corretor, :valor_comissao, :frete, :valor_frete, :imposto, :valor_imposto, :valor_arroba, :premio, :quadra_id)';


        $stm = $db->prepare($query);

        // Convertendo Data
        $data_compra  = $this->DateToMysql($data->data_compra);
        $data_pesagem = $this->DateToMysql($data->data_pesagem);


        $stm->bindValue(':fornecedor_id', $data->fornecedor_id);
        $stm->bindValue(':caracteristica_id', $data->caracteristica_id);
        $stm->bindValue(':confinamento_id', $data->confinamento_id);
        $stm->bindValue(':data_compra', $data_compra);
        $stm->bindValue(':numero_nota', $data->numero_nota);
        $stm->bindValue(':serie_nota', $data->serie_nota);
        $stm->bindValue(':quantidade', $data->quantidade);
        $stm->bindValue(':valor_nota', $data->valor_nota);
        $stm->bindValue(':data_pesagem', $data_pesagem);
        $stm->bindValue(':peso_entrada', $data->peso_entrada);
        $stm->bindValue(':peso_saida', $data->peso_saida);
        $stm->bindValue(':classificacao', $data->classificacao);
        $stm->bindValue(':escore', $data->escore);
        $stm->bindValue(':idade', $data->idade);
        $stm->bindValue(':qtd_machos', $data->qtd_machos);
        $stm->bindValue(':qtd_femeas', $data->qtd_femeas);
        $stm->bindValue(':corretor', $data->corretor);
        $stm->bindValue(':valor_comissao', $data->valor_comissao);
        $stm->bindValue(':frete', $data->frete);
        $stm->bindValue(':valor_frete', $data->valor_frete);
        $stm->bindValue(':imposto', $data->imposto);
        $stm->bindValue(':valor_imposto', $data->valor_imposto);
        $stm->bindValue(':valor_arroba', $data->valor_arroba);
        $stm->bindValue(':premio', $data->premio);
        $stm->bindValue(':quadra_id', $data->quadra_id);

        $stm->execute();

        $insert = $db->lastInsertId($query);

        $error = $stm->errorInfo();

        //var_dump($error);
        //var_dump($insert);

        if ($error[0] != 0 ){
            // desfaz operacoes realizadas durante a transacao
            $db->rollback();

            $this->ReturnJsonError($error);
        }
        else {

            $db->commit();
            $newData = $data;
            $newData->id = $insert;

            $this->ReturnJsonSuccess($msg,$data);
        }
    }

    public function update($data) {


        $db = $this->getDb();

        // Convertendo Data
        $data_compra  = $this->DateToMysql($data->data_compra);
        $data_pesagem = $this->DateToMysql($data->data_pesagem);

        $query = 'UPDATE rebanho.compras set fornecedor_id = :fornecedor_id, caracteristica_id = :caracteristica_id, confinamento_id = :confinamento_id, data_compra = :data_compra, numero_nota = :numero_nota, serie_nota = :serie_nota, quantidade = :quantidade, valor_nota = :valor_nota, data_pesagem = :data_pesagem, peso_entrada = :peso_entrada, peso_saida = :peso_saida, classificacao = :classificacao, escore = :escore, idade = :idade, qtd_machos = :qtd_machos, qtd_femeas =:qtd_femeas, corretor =:corretor, valor_comissao = :valor_comissao, frete =:frete, valor_frete =:valor_frete, imposto = :imposto, valor_imposto = :valor_imposto, valor_arroba = :valor_arroba, premio = :premio, quadra_id = :quadra_id WHERE id = :id';


        $stm = $db->prepare($query);

        $stm->bindValue(':id', $data->id);
        $stm->bindValue(':fornecedor_id', $data->fornecedor_id);
        $stm->bindValue(':caracteristica_id', $data->caracteristica_id);
        $stm->bindValue(':confinamento_id', $data->confinamento_id);
        $stm->bindValue(':data_compra', $data_compra);
        $stm->bindValue(':numero_nota', $data->numero_nota);
        $stm->bindValue(':serie_nota', $data->serie_nota);
        $stm->bindValue(':quantidade', $data->quantidade);
        $stm->bindValue(':valor_nota', $data->valor_nota);
        $stm->bindValue(':data_pesagem', $data_pesagem);
        $stm->bindValue(':peso_entrada', $data->peso_entrada);
        $stm->bindValue(':peso_saida', $data->peso_saida);
        $stm->bindValue(':classificacao', $data->classificacao);
        $stm->bindValue(':escore', $data->escore);
        $stm->bindValue(':idade', $data->idade);
        $stm->bindValue(':qtd_machos', $data->qtd_machos);
        $stm->bindValue(':qtd_femeas', $data->qtd_femeas);
        $stm->bindValue(':corretor', $data->corretor);
        $stm->bindValue(':valor_comissao', $data->valor_comissao);
        $stm->bindValue(':frete', $data->frete);
        $stm->bindValue(':valor_frete', $data->valor_frete);
        $stm->bindValue(':imposto', $data->imposto);
        $stm->bindValue(':valor_imposto', $data->valor_imposto);
        $stm->bindValue(':valor_arroba', $data->valor_arroba);
        $stm->bindValue(':premio', $data->premio);
        $stm->bindValue(':quadra_id', $data->quadra_id);

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

            // Para Cada Registro Recuperar o Nome do Fornecedor e a Fazenda
            $fornecedor = $this->find($record->fornecedor_id, 'fornecedores');
            $record->fornecedor_nome    = $fornecedor->nome;
            $record->fornecedor_fazenda = $fornecedor->fazenda;

            // Para Cada Registro Recuperar o Nome do Confinamento
            $confinamento = $this->find($record->confinamento_id, 'confinamentos');
            $record->confinamento_nome  = $confinamento->confinamento;

            $records[] = $record;
        }
        $result = $records;

//         $result = $data;

        echo json_encode($result);
    }
}

