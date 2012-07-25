<?php

header('Content-Type: text/javascript; charset=UTF-8');

class Pesagens extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "pesagens";


    public function insert($data){

        // Verificar se o Registro e UNICO
        // Chave UNIQUE = confinamento_id + animal_id + tipo
        $unique = $this->findBy(array('confinamento_id','animal_id','tipo'), array($data->confinamento_id, $data->animal_id, $data->tipo), 'pesagens');

        if ($unique){
            $data->id = $unique->id;
            Pesagens::update($data);
        }
        else {
            $db = $this->getDb();

            $query = 'INSERT INTO pesagens (confinamento_id, quadra_id, animal_id, data, peso, tipo) VALUES (:confinamento_id, :quadra_id, :animal_id, :data, :peso, :tipo);';


            $stm = $db->prepare($query);

            $stm->bindValue(':confinamento_id', $data->confinamento_id);
            $stm->bindValue(':quadra_id', $data->quadra_id);
            $stm->bindValue(':animal_id', $data->animal_id);
            $stm->bindValue(':data', $data->data);
            $stm->bindValue(':peso', $data->peso);
            $stm->bindValue(':tipo', $data->tipo);

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
    }

    public function update($data){

        $db = $this->getDb();

        $query = 'UPDATE pesagens SET confinamento_id = :confinamento_id, quadra_id = :quadra_id, animal_id = :animal_id, data = :data, peso = :peso, tipo =:tipo WHERE id = :id';


        $stm = $db->prepare($query);

        $stm->bindValue(':id', $data->id);
        $stm->bindValue(':confinamento_id', $data->confinamento_id);
        $stm->bindValue(':quadra_id', $data->quadra_id);
        $stm->bindValue(':animal_id', $data->animal_id);
        $stm->bindValue(':data', $data->data);
        $stm->bindValue(':peso', $data->peso);
        $stm->bindValue(':tipo', $data->tipo);

        $stm->execute();

        $update = $stm->execute();

        if ($update) {
            $this->ReturnJsonSuccess($msg,$data);
        }
        else {
            $error = $stm->errorInfo();
            $this->ReturnJsonError($error);
        }
    }

    /** Metodo: getPesagemEntrada
     * Retorna a pesagem que tiver o tipo = 1 para o confinamento que ta no objeto nota
     * da entrada do animal
     * @param:$animal - id do animal
     * @param:$nota   - objeto nota 
     */
    public function getPesagemEntrada($animal, $nota){

        // Recuperando o Peso de Entrada Usando o Confinamento o animal e o tipo
        $pesagem = $this->findBy(array('confinamento_id','animal_id','tipo'), array($nota->confinamento_id, $animal, 1), 'pesagens');

        return $pesagem;
    }


    public function getCntPesados($data){

        // Recuperando os Paramentros
        $nota_aberta = $data['nota_aberta'];

        // Recuperando o ObjNota
        $objNota = $this->find($nota_aberta, 'compras');

        // Recuperar Todos os Animais
        $animais = $this->findAllBy('compra_id', $objNota->id, 'animais');

        foreach ($animais as $animal){

            $aIds[] = $animal->id;

        }

        $ids = implode(', ', $aIds);

        $db = $this->getDb();

        $sql = "SELECT * FROM pesagens WHERE confinamento_id = {$objNota->confinamento_id} AND animal_id IN ($ids) AND tipo = 1";

        $stm = $db->prepare($sql);
        $stm->execute();
        $pesagens = $stm->fetchAll(\PDO::FETCH_OBJ);

        $peso_total = 0;
        $pesados = 0;
        foreach($pesagens as $objPeso){
            if ($objPeso->peso > 0) {
                $peso_total = ($objPeso->peso + $peso_total);
                $pesados++;
            }
        }

        $result = new StdClass();
        $result->peso_total  = $peso_total;
        $result->pesados     = $pesados;
        $result->quantidade  = $objNota->quantidade;


        return $result;
    }

    public function getPesagens($data){

        $strFiltros = $this->parseFilter($data["filter"]);
        $strSorters = $this->parseSorter($data["sort"]);

        $aResult = $this->filter(null, 'pesagens', $strFiltros, $strSorters, false);

        // Recuperar as Informacoes de cada animal
        foreach ($aResult as $row){

            $registro = $row;

            // Informacoes do Animal
            $animal = $this->find($row->animal_id, 'animais');

            $registro->sexo = $animal->sexo;

            // Informacoes da Quadra
            $quadra = $this->find($row->quadra_id, 'quadras', 'quadra');

            $registro->quadra = $quadra->quadra;

            $aRegistros[] = $registro;
        }



        $result = new StdClass();
        $result->success = true;
        $result->data    = $aRegistros;
        $result->total   = count($aRegistros);

        if ($data["returnJson"]){

            echo json_encode($result);
        }
        else {
            return $result;
        }
    }

}
