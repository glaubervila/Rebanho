<?php

header('Content-Type: text/javascript; charset=UTF-8');

class Ocorrencias extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "ocorrencias";

/** Tipos de Ocorrencias
 *     1 - Entrada no Confinamento
 *     2 - Pesagem de Entrada
 *     3 - Pesagem de Compra
 *     4 - Pesagem
 *     5 - Manejo de Quadra
 *     6 - Pesagem de Saida
 *     7 - Transferencia
 */


    public function insert($data, $json = true){

        // Verificar se o Registro e UNICO
        // Chave UNIQUE = confinamento_id + animal_id + tipo + data
        $unique = $this->findBy(array('confinamento_id','animal_id','tipo', 'data'), array($data->confinamento_id, $data->animal_id, $data->tipo, $data->data), 'ocorrencias');

        if ($unique){

            $data->id = $unique->id;
            return  Ocorrencias::update($data, $json);

        }
        else {
            $db = $this->getDb();

            $query = 'INSERT INTO ocorrencias (confinamento_id, quadra_id, animal_id, data, tipo, ocorrencia, descricao) VALUES (:confinamento_id, :quadra_id, :animal_id, :data,  :tipo, :ocorrencia, :descricao);';

            $stm = $db->prepare($query);

            $stm->bindValue(':confinamento_id', $data->confinamento_id);
            $stm->bindValue(':quadra_id', $data->quadra_id);
            $stm->bindValue(':animal_id', $data->animal_id);
            $stm->bindValue(':data', $data->data);
            $stm->bindValue(':tipo', $data->tipo);
            $stm->bindValue(':ocorrencia', $data->ocorrencia);
            $stm->bindValue(':descricao', $data->descricao);

            $stm->execute();

            $insert = $db->lastInsertId($query);

            if ($insert) {

                $newData = $data;
                $newData->id = $insert;
                if ($json) {
                    $this->ReturnJsonSuccess($msg,$data);
                }
                else {
                    $return = new StdClass();
                    $return->success = true;
                    $return->data = $data;
                    $return->msg = "Registro Criado com Sucesso!";
                    return $return;
                }
            }
            else {
                $error = $stm->errorInfo();
                if ($json) {
                    $this->ReturnJsonError($error);
                }
                else {
                    $return = new StdClass();
                    $return->failure = true;
                    $return->msg = "Falha ao Criar o Registro de Ocorrencia!";
                    $return->error = $stm->errorInfo();
                    return $return;
                }
            }
        }
    }

    public function update($data, $json = true){

        $db = $this->getDb();

        $query = 'UPDATE ocorrencias SET confinamento_id = :confinamento_id, quadra_id = :quadra_id, animal_id = :animal_id, data = :data, tipo = :tipo, ocorrencia =:ocorrencia, descricao = :descricao WHERE id = :id';

        $stm = $db->prepare($query);

        $stm->bindValue(':id', $data->id);
        $stm->bindValue(':confinamento_id', $data->confinamento_id);
        $stm->bindValue(':quadra_id', $data->quadra_id);
        $stm->bindValue(':animal_id', $data->animal_id);
        $stm->bindValue(':data', $data->data);
        $stm->bindValue(':tipo', $data->tipo);
        $stm->bindValue(':ocorrencia', $data->ocorrencia);
        $stm->bindValue(':descricao', $data->descricao);

        $stm->execute();

        $update = $stm->execute();
        if ($update) {
            if ($json) {
                $this->ReturnJsonSuccess($msg,$data);
            }
            else {
                $return = new StdClass();
                $return->success = true;
                $return->data = $data;
                $return->msg = "Registro Alterado com Sucesso!";

                return $return;
            }
        }
        else {
            $error = $stm->errorInfo();
            if ($json) {
                $this->ReturnJsonError($error);
            }
            else {
                $return = new StdClass();
                $return->failure = true;
                $return->msg = "Falha ao Criar o Registro de Ocorrencia!";
                $return->error = $stm->errorInfo();

                return $return;
            }
        }
    }

    public function load($data){

        $data = $this->fetchAll();

        foreach ($data->data as $row){
            $record = $row;

            // Para Cada Registro Recuperar o Nome do Confinamento
            $confinamento = $this->find($record->confinamento_id, 'confinamentos');
            $record->confinamento  = $confinamento->confinamento;

            // Informacoes da Quadra
            $quadra = $this->find($row->quadra_id, 'quadras', 'quadra');
            $record->quadra = $quadra->quadra;

            $records[] = $record;
        }

        $data->data = $records;

        echo json_encode($data);

    }

    /** Metodo: criarOcorrenciaTransferencia
     * Cria um objeto de ocorrencia para a Transferencia entre Confinamentos
     * usa o metodo insert da Classe Ocorrencia
     * se for um update a classe vai identificar o registro e fazer a atualizacao.
     */
    public function criarOcorrenciaTransferencia($data, $json = true){

        $descricao = "Transferencia: {$data->origem_nome} >> {$data->destino_nome}";

        // Criando o Obj Ocorrencia
        $objOcorrencia = new StdClass();
        $objOcorrencia->confinamento_id = $data->confinamento_id;
        $objOcorrencia->quadra_id = $data->quadra_id;
        $objOcorrencia->animal_id = $data->animal_id;
        $objOcorrencia->ocorrencia = 'Transferencia';
        $objOcorrencia->descricao = $descricao;
        $objOcorrencia->data = $data->data;
        $objOcorrencia->tipo = 7;

        $result = Ocorrencias::insert($objOcorrencia, false);

        $return = new StdClass();
        if ($result->success){
            $return->success = true;
        }
        else {
            $return->failure = true;
            $return->msg = "Falha ao Criar a Ocorrencia de Transferencia";
        }

        return $return;
    }
}
