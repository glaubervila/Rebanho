<?php
header('Content-Type: text/javascript; charset=UTF-8');
/** @Class: Transferencias
 *  @date: 2012-10-10
 */

/** Status da Transferencias
 * 0 - inicio
 * 1 - transito
 * 3 - concluida
 */

class Transferencias extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "transferencias";


    public function insert($data) {

        //var_dump($data);

        $db = $this->getDb();

        $db->beginTransaction();

        $query = 'INSERT INTO transferencias (origem, destino, quantidade, machos, femeas, data_saida, data_entrada, animais, status) VALUES (:origem, :destino, :quantidade, :machos, :femeas, :data_saida, :data_entrada, :animais, :status)';

        $stm = $db->prepare($query);

        // Convertendo Data
        $data_saida   = $this->DateToMysql($data->data_saida);
        $data_entrada = $this->DateToMysql($data->data_entrada);

        $stm->bindValue(':origem', $data->origem);
        $stm->bindValue(':destino', $data->destino);
        $stm->bindValue(':quantidade', $data->quantidade);
        $stm->bindValue(':machos', $data->machos);
        $stm->bindValue(':femeas', $data->femeas);
        $stm->bindValue(':data_saida', $data_saida);
        $stm->bindValue(':data_entrada', $data_entrada);
        $stm->bindValue(':animais', $data->animais);
        $stm->bindValue(':status', $data->status);

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

    public function update($data){

        var_dump($data);
    }

    /** getAnimal($data)
     * Metodo usado para retornar um obj animal no formato do model de transferencia
     * para a grid de pesagen de saida
     * executa o metodo de localizar animal pelo codigo na classe animal,
     * cria um novo obj no formato do model de transferenciaAnimal
     */ 
    public function getAnimal($data, $json = true){

        $animal = Animais::getAnimalResumido(false, $data['codigo'], false);

        if ($json){
            echo json_encode($animal);
        }
        else {
            return $animal;
        }
    }

}