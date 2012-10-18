<?php
header('Content-Type: text/javascript; charset=UTF-8');
/** @Class: Transferencias
 *  @date: 2012-10-10
 */

/** Status da Transferencias
 * 0 - Saida
 * 1 - Transito
 * 2 - Entrada
 * 3 - Concluida
 */

class Transferencias extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "transferencias";


    public function insert($data, $json = true) {

        //var_dump($data);

        $db = $this->getDb();

        $db->beginTransaction();

        $query = 'INSERT INTO transferencias (status, origem, destino, quantidade, machos, femeas, data_saida, data_entrada, animais) VALUES (:status, :origem, :destino, :quantidade, :machos, :femeas, :data_saida, :data_entrada, :animais)';

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

        $query = 'UPDATE `transferencias` SET `status` = :status, `origem` = :origem, `destino` = :destino, `quantidade` = :quantidade, `machos` = :machos, `femeas` = :femeas, `data_saida` = :data_saida, `data_entrada` = :data_entrada, `animais` = :animais, `quadra_id` = :quadra_id WHERE id = :id;';

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
        $stm->bindValue(':quadra_id', $data->quadra_id);

        $update = $stm->execute();


        // Alterar o Confinamento dos Animais na Transferencia
        $aAnimais = explode(';', $data->animais);

        foreach ($aAnimais as $animal_id ){

            $query = "UPDATE animais SET confinamento_id = {$data->destino}, quadra_id = {$data->quadra_id} WHERE id = {$animal_id};";

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

        $status[0] = "Saida";
        $status[1] = "Transito";
        $status[2] = "Entrada";
        $status[3] = "Concluida";

        return $status[$id];
    }

    public function getAnimaisTransferencia($data, $json = true){

        $result = new StdClass();


        $transferencia_id = $data['transferencia_id'];

        // Recuperar a transferencia
        $transferencia = $this->filter(null, 'transferencias', "id = {$transferencia_id}", null, false);

        $transferencia = $transferencia[0];

        if ($transferencia) {

            // Transformar o campo animais em um array
            $animais_id = explode(';', $transferencia->animais);

            // Para Cada Animal retornar o animalResumido
            $animais = array();
            foreach ($animais_id as $id) {
                $animal = Animais::getAnimalResumido($id, false, false, false);
                $animal = $animal->animal;

                // Recuperando o Codigo do animal na Origem
                $codigos = Animais::getCodigosById($animal->id, $transferencia->origem);
                $animal->codigo_antigo = $codigos[0]->codigo;

                // Se a transferencia for estiver com status de entrada recuperar o peso
                if ($transferencia->status > 1) {
                    $peso_entrada = Pesagens::getPesagemEntrada($animal->id, $animal->confinamento_id);
                    $animal->peso = $peso_entrada->peso;
                }

                //var_dump($animal);
                $animais[] = $animal;
            }

            if($animais[0]){
                // Se tiver Animais Retorno de Sucesso
                $result->success = true;
                $result->transferencia_id = $transferencia_id;
                $result->data = $animais;
            }

        }
        else {
            // Retornar erro pq na encontrou a transferencia
        }


        if ($json){
            echo json_encode($result);
        }
        else {
            return $result;
        }
    }


    public function entradaAnimais($data,$json = true){

        //var_dump($data);

        $result = new StdClass();

        //converter a data de entrada
        $data_entrada = $this->DateToMysql($data[0]->data_entrada);

        $origem  = $data[0]->origem;
        $destino = $data[0]->destino;
        $transferencia_id = $data[0]->transferencia_id;
        $origem_nome  = Confinamentos::getNome($origem);
        $destino_nome = Confinamentos::getNome($destino);


        foreach ($data as $animal){

            // Controle de Erro
            $erro = new StdClass();

            $animal->data_entrada = $data_entrada;
            $animal->peso_entrada = $animal->peso;

            // Criar a Pesagem de Entrada

            $pesagem = Pesagens::criarPesagemEntrada($animal, false);

            if ($pesagem->success){

                // Criar Ocorrencia de Entrada no Confinamento
                $descricao = "Entrada - {$destino_nome}";

                $objOcorrencia->confinamento_id = $animal->confinamento_id;
                $objOcorrencia->animal_id = $animal->id;
                $objOcorrencia->tipo = 1;
                $objOcorrencia->ocorrencia = 'Entrada';
                $objOcorrencia->quadra_id = $animal->quadra_id;
                $objOcorrencia->descricao = $descricao;
                $objOcorrencia->data = $data_entrada;

                $ocorrencia = Ocorrencias::insert($objOcorrencia, false);

                if (!$ocorrencia->success){
                    // Se der erro na Ocorrencia
                    $erro->animal_id = $animal->id;
                    $erro->msg = $ocorrencia->msg;
                }
                else {
                    // Cadastrar o Codigo

                    $codigo = Animais::criarCodigoSisbov($animal, $animal->codigo, false);

                    if (!$codigo->success){
                        // Se der erro na Ocorrencia
                        $erro->animal_id = $animal->id;
                        $erro->msg = $codigo->msg;
                    }
                }
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
            foreach ($erros as $erro) {
                $msgs[] = $erro->msg;
            }
            $result->failure = true;
            $result->msg = implode('<br>',$msgs);
            $result->data = $data;
            $result->transferencia_id = $transferencia_id;

        }
        else {
            $result->success = true;
            $result->msg = "Todos os animais foram salvos com Sucesso";
            $result->evento = 'entrada';
            $result->data = $data;
        }

        if ($json){
            echo json_encode($result);
        }
        else {
            return $result;
        }

    }


    public function destroy($data){

        if ($data){

            // Se tiver animais na Transferencia Desfazer as Ocorrencias, Pesagens e a troca de confinamento
            if ($data->animais) {
                echo "{failure:'true'}";
            }
            else{
                // Se nao tiver animas somente excluir o registro
                $result = $this->delete($data);
            }

            $this->ReturnJson($result);
        }

    }
}
