<?php
header('Content-Type: text/javascript; charset=UTF-8');
/** @Class: Transferencias
 *  @date: 2012-10-10
 */

/** Status da Transferencias
 * 0 - inicio
 * 1 - transito
 * 2 - concluida
 */

class Transferencias extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "transferencias";


    public function insert($data, $json = true) {

        //var_dump($data);

        $db = $this->getDb();

        $db->beginTransaction();

        $query = 'INSERT INTO transferencias (status, origem, destino, quantidade, machos, femeas, data_saida, data_entrada, animais, peso_minimo, peso_medio, peso_maximo) VALUES (:status, :origem, :destino, :quantidade, :machos, :femeas, :data_saida, :data_entrada, :animais, :peso_minimo, :peso_medio, :peso_maximo )';

        $stm = $db->prepare($query);

        // Convertendo Data
        $data_saida   = $this->DateToMysql($data->data_saida);
        $data_entrada = $this->DateToMysql($data->data_entrada);

        $stm->bindValue(':status', $data->status);
        $stm->bindValue(':origem', $data->origem);
        $stm->bindValue(':destino', $data->destino);
        $stm->bindValue(':quantidade', $data->quantidade);
        $stm->bindValue(':machos', $data->machos);
        $stm->bindValue(':femeas', $data->femeas);
        $stm->bindValue(':data_saida', $data_saida);
        $stm->bindValue(':data_entrada', $data_entrada);
        $stm->bindValue(':animais', $data->animais);
        $stm->bindValue(':peso_minimo', $data->peso_minimo);
        $stm->bindValue(':peso_medio', $data->peso_medio);
        $stm->bindValue(':peso_maximo', $data->peso_maximo);


        $stm->execute();

        $insert = $db->lastInsertId($query);

        $error = $stm->errorInfo();

        if ($error[0] != 0 ){
            // desfaz operacoes realizadas durante a transacao
            $db->rollback();

            $result->failure = true;
            $result->msg = "Falha ao Alterar o Registro de Transferencia!";
            $result->error = $stm->errorInfo();
        }
        else {

            $db->commit();
            $newData = $data;
            $newData->id = $insert;

            $result->success = true;
            $result->data = $newData;
            $result->msg = "Registro Criado com Sucesso!";

        }

        if ($json){
            echo json_encode($result);
        }
        else {
            return $result;
        }

    }

    public function update($data, $json = true){

        $db = $this->getDb();

        $db->beginTransaction();

        $query = 'UPDATE `transferencias` SET `status` = :status, `origem` = :origem, `destino` = :destino, `quantidade` = :quantidade, `machos` = :machos, `femeas` = :femeas, `data_saida` = :data_saida, `data_entrada` = :data_entrada, `animais` = :animais, `peso_minimo` = :peso_minimo, `peso_medio` = :peso_medio, `peso_maximo` = :peso_maximo WHERE id = :id;';

        $stm = $db->prepare($query);

        // Convertendo Data
        $data_saida   = $this->DateToMysql($data->data_saida);
        $data_entrada = $this->DateToMysql($data->data_entrada);

        $stm->bindValue(':id', $data->id);

        $stm->bindValue(':status', $data->status);
        $stm->bindValue(':origem', $data->origem);
        $stm->bindValue(':destino', $data->destino);
        $stm->bindValue(':quantidade', $data->quantidade);
        $stm->bindValue(':machos', $data->machos);
        $stm->bindValue(':femeas', $data->femeas);
        $stm->bindValue(':data_saida', $data_saida);
        $stm->bindValue(':data_entrada', $data_entrada);
        $stm->bindValue(':animais', $data->animais);
        $stm->bindValue(':peso_minimo', $data->peso_minimo);
        $stm->bindValue(':peso_medio', $data->peso_medio);
        $stm->bindValue(':peso_maximo', $data->peso_maximo);

        $update = $stm->execute();


        // Alterar o Confinamento dos Animais na Transferencia
        $aAnimais = explode(';', $data->animais);

        foreach ($aAnimais as $animal_id ){

            $query = "UPDATE animais SET confinamento_id = {$data->destino} WHERE id = {$animal_id};";

            $stm = $db->prepare($query);

            $stm->execute();
        }


        $result = new StdClass();

        $error = $stm->errorInfo();

        // Se tiver Dado Erro
        if ($error[0] != 0){

            $db->rollback();

            $result->failure = true;
            $result->msg = "Falha ao Alterar o Registro de Transferencia!";
            $result->error = $stm->errorInfo();

        }
        else {

            $db->commit();

            $result->success = true;
            $result->data = $data;
            $result->msg = "Registro Alterado com Sucesso!";
            $result->finalizar = true;

        }

        if ($json){
            echo json_encode($result);
        }
        else {
            return $result;
        }
    }

    /** getAnimal($data)
     * Metodo usado para retornar um obj animal no formato do model de transferencia
     * para a grid de pesagen de saida
     * executa o metodo de localizar animal pelo codigo na classe animal,
     * cria um novo obj no formato do model de transferenciaAnimal
     */ 
    public function getAnimal($data, $json = true){

        $animal = Animais::getAnimalResumido(false, $data['codigo'], $data['origem'], false);

        if ($json){
            echo json_encode($animal);
        }
        else {
            return $animal;
        }
    }


    public function insertAnimaisTransferencia($data, $json = true){

        $result = new StdClass();

        // Se na tiver nenhum animal
        if (!$data[0]){
            $result->failure = true;
            $result->msg = "Nenhum animal a ser Trasferido";
        }
        else {
            //converter a data de saida
            $data_saida = $this->DateToMysql($data[0]->data_saida);

            $origem  = $data[0]->origem;
            $destino = $data[0]->destino;
            $origem_nome  = Confinamentos::getNome($origem);
            $destino_nome = Confinamentos::getNome($destino);

            $erros = array();

            // Array dos animais na transferencia
            $animais_id = array();

            // Para Cada Registro de Animal a ser Transferido
            foreach ($data as $animal){

                // Atributos Facilitadores.
                $animal->animal_id    = $animal->id;
                $animal->data_saida   = $data_saida;
                $animal->data         = $data_saida;
                $animal->origem_nome  = $origem_nome;
                $animal->destino_nome = $destino_nome;

                // Controle de Erro
                $erro = new StdClass();

                // Criar a Pesagem de Saida
                $pesagem = Pesagens::criarPesagemSaida($animal, false);

                if ($pesagem->success){

                    $ocorrencia = Ocorrencias::criarOcorrenciaTransferencia($animal, false);

                    if (!$ocorrencia->success){
                        // Se der erro na Ocorrencia
                        $erro->animal_id = $animal_id;
                        $erro->msg = $ocorrencia->msg;
                    }

                    $animais_id[] = $animal->animal_id;
                }
                else {
                    // Se der erro na Pesagem
                    $erro->animal_id = $animal_id;
                    $erro->msg = $pesagem->msg;
                }

                // Se tiver erro adiciona no array de erro para tratamento
                if ($erro->animal_id) {
                    $erros[] = $erro;
                }
            }

            // Se tiver tido algum erro tratar aki
            if (count($erros) > 0){

            }
            else {
                $result->success = true;
                $result->msg = "Todos os animais foram salvos com Sucesso";
                $result->data = implode(';', $animais_id);
            }
        }

        if ($json){
            echo json_encode($result);
        }
        else {
            return $result;
        }
    }

    public function load(){

        $data = $this->fetchAll();

        foreach ($data->data as $row){
            $record = $row;

            // Para Cada Registro Recuperar o Nome do Confinamento de origem e destino
            $record->origem_nome  = Confinamentos::getNome($record->origem);
            $record->destino_nome  = Confinamentos::getNome($record->destino);

            $record->status_nome  = $this->getStatusNome($record->status);

            $records[] = $record;
        }

        $data->data = $records;

        echo json_encode($data);
    }

    public function getstatusNome($id){

        $status = array();

        $status[0] = "Iniciada";
        $status[1] = "Transito";
        $status[2] = "Concluida";

        return $status[$id];
    }
}
