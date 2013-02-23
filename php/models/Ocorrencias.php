<?php

header('Content-Type: text/javascript; charset=UTF-8');

class Ocorrencias extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "ocorrencias";

/** Tipos de Ocorrencias
 *     0 - Nascimento
 *     1 - Entrada no Confinamento
 *     2 - Pesagem de Entrada
 *     3 - Pesagem de Compra
 *     4 - Pesagem
 *     5 - Manejo de Quadra
 *     6 - Pesagem de Saida
 *     7 - Transferencia
 *     8 - Desmama
 *     9 - Castracao
 *     V - Vacinacao
 *     N - Nascimento
 *     M - Morte
 *     O - Outras
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

            if (!$data->ocorrencia) {
                $data->ocorrencia = Ocorrencias::getNomeOcorrencia($data->tipo);
            }

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

        if (!$data->ocorrencia) {
            $data->ocorrencia = Ocorrencias::getNomeOcorrencia($data->tipo);
        }

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


    /** Metodo: OcorrenciaMorte
     * Cria um objeto de ocorrencia para Morte de Animal
     * usa o metodo insert da Classe Ocorrencia
     * se for um update a classe vai identificar o registro e fazer a atualizacao.
     */
    public function OcorrenciaMorte($data, $json = true){

        // Fazer update no registro do animal
        $morte = Animais::MorteAnimal($data, false);

        if ($morte->success == true){

            $descricao = "Causa Morte: {$data->descricao}";

            // Criando o Obj Ocorrencia
            $objOcorrencia = new StdClass();
            $objOcorrencia->confinamento_id = $data->confinamento_id;
            $objOcorrencia->quadra_id = $data->quadra_id;
            $objOcorrencia->animal_id = $data->animal_id;
            $objOcorrencia->ocorrencia = 'Morte';
            $objOcorrencia->descricao = $descricao;
            $objOcorrencia->data = $data->data;
            $objOcorrencia->tipo = 'M';

            $result = Ocorrencias::insert($objOcorrencia, false);

            $return = new StdClass();
            if ($result->success){
                $return->success = true;
            }
            else {
                $return->failure = true;
                $return->msg = "Falha ao Criar a Ocorrencia de Morte";
            }
        }
        else {
            $return  = $morte;
        }
        return $return;
    }

    /** Metodo: OcorrenciaVacinacao
     * Cria um objeto de ocorrencia para Vacinacao de Animal
     * usa o metodo insert da Classe Ocorrencia
     * se for um update a classe vai identificar o registro e fazer a atualizacao.
     */
    public function OcorrenciaVacinacao($data, $json = true){


        // Recuperar a Descricao da Vacina
        $vacina = $this->find($data->vacina_id, 'vacinas');
        $descricao = $vacina->vacina;

        // Criando o Obj Ocorrencia
        $objOcorrencia = new StdClass();
        $objOcorrencia->confinamento_id = $data->confinamento_id;
        $objOcorrencia->quadra_id = $data->quadra_id;
        $objOcorrencia->animal_id = $data->animal_id;
        $objOcorrencia->ocorrencia = 'Vacinacao';
        $objOcorrencia->descricao = $descricao;
        $objOcorrencia->data = $data->data;
        $objOcorrencia->tipo = 'V';

        $result = Ocorrencias::insert($objOcorrencia, false);

        $return = new StdClass();
        if ($result->success){
            $return->success = true;
        }
        else {
            $return->failure = true;
            $return->msg = "Falha ao Criar a Ocorrencia de Vacinação";
        }

        return $return;
    }

    /** Esse Metodo e usado, para criar uma ocorrencia atravez da store ou do model
     * @param: $data dados vindo do form de ocorrencia
     * faz uma busca na tabela de animais, e recupera as informacoes do animal
     * monta um objeto tipo ocorrencia e chama o metodo respectivo para criar cada uma pelo tipo
     */
    public function create($data, $json = true){

        $return = new StdClass();

        // recuperando a informacoes do animal
        $animal_id = $data->animal_id;
        $tipo = $data->tipo;
        // Guardando a Quadra Destino no Manejo
        $quadra_manejo = $data->quadra_id;


        $animal = $this->find($animal_id, 'animais');

        if ($animal->status == 1){

            $data->confinamento_id = $animal->confinamento_id;
            $data->quadra_id = $animal->quadra_id;
            $data->data = $this->DateToMysql($data->data);

            switch ($tipo){
                // Pesagem
                case 4:
                    // Criar a Pesagem
                    // Trocar o tipo para 2 - Pesagem de Rotina
                    $data->tipo = 2;
                    $result = Pesagens::insert($data, false);
                break;
                case 5:
                    // Criar Manejo de Quadra
                    $result = Manejos::manejoQuadras($data, $animal_id, $quadra_manejo, false);
                break;
                case 'M':
                    // Criar Ocorrencia de Morte
                    $data->data_morte = $data->data;
                    $result = Ocorrencias::OcorrenciaMorte($data, false);
                break;
                case 'V':
                    // Criar Ocorrencia de Vacinacao
                    $result = Ocorrencias::OcorrenciaVacinacao($data, false);
                break;

                default:
                    $result = Ocorrencias::insert($data, false);
                break;
            }

            if ($result->success){
                $return->success = true;
                $return->msg = "Lançamento de Ocorrência realizado com sucesso!";
            }
            else {
                $return = $result;
            }
        }
        else {
            $return->failure = true;
            $return->msg = "Nenhuma Alteração foi feita, este animal, não está Ativo.";
        }

        if ($json){
            echo json_encode($return);
        }
        else {
            return $return;
        }
    }

    public function getNomeOcorrencia($tipo){

        $atipos = array() ;
        $atipos['0'] = 'Nascimento';
        $atipos['1'] = 'Entrada no Confinamento';
        $atipos['2'] = 'Pesagem Entrada';
        $atipos['3'] = 'Pesagem de Compra';
        $atipos['4'] = 'Pesagem';
        $atipos['5'] = 'Manejo de Quadra';
        $atipos['6'] = 'Pesagem de Saida';
        $atipos['7'] = 'Transferencia';
        $atipos['8'] = 'Desmama';
        $atipos['9'] = 'Castracao';
        $atipos['V'] = 'Vacinacao';
        $atipos['N'] = 'Nascimento';
        $atipos['M'] = 'Morte';
        $atipos['O'] = 'Outras';

        return $atipos[$tipo];
    }
}
