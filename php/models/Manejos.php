<?php

header('Content-Type: text/javascript; charset=UTF-8');

class Manejos extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "";


    /** Metodo: manejoQuadras
     * Recebe os dados do animal
     * faz um update na quadra
     * cria um ocorrencia de manejo
     * @param:$data: dados do Request
     * @param:$animal_id: Id do Animal
     * @param:$quadra_id: Quadra de destino
     * @param:$json: (bool) controla o retorno se vai ser json ou obj
     */
    public function manejoQuadras($data, $animal_id = null, $quadra_id = null, $json = true){

        // Recupera o Registro do Animal
        $animal = $this->find($animal_id, 'animais');

        // Guardando a Quadra Antiga
        $quadra = $this->find($animal->quadra_id, 'quadras', 'quadra');
        $quadra_antiga = $quadra->quadra;

        // Guardando a Quadra Nova
        $quadra = $this->find($quadra_id, 'quadras', 'quadra');
        $quadra_nova = $quadra->quadra;

        $return = $this->updateCampo($animal_id, 'quadra_id' , $quadra_id, 'animais');


        if ($return->success){

            $descricao = "Manejo da Quadra {$quadra_antiga} Para {$quadra_nova}";

            // Criar a Ocorrencia
            $ocorrencia = new StdClass();
            $ocorrencia->confinamento_id = $animal->confinamento_id;
            $ocorrencia->quadra_id = $quadra_id;
            $ocorrencia->animal_id = $animal->id;
            $ocorrencia->data = date('Y-m-d');
            // Tipo 5 manejo de quadra
            $ocorrencia->tipo = 5;
            $ocorrencia->ocorrencia = "Manejo";
            $ocorrencia->descricao = $descricao;

            //var_dump($ocorrencia);
            $return = Ocorrencias::insert($ocorrencia, false);

            if ($return->success){
                $return->success = true;
            }
            else {
                $return->failure = true;
                $result->id  = $data->id;
                $return->msg = "Falha ao Criar o Ocorrencia de Manejo";
            }
        }
        else {
            $return->failure = true;
            $result->id  = $data->id;
            $return->msg = "Falha ao Criar o Registro de Manejo";
        }

        if ($json){
            echo json_encode($return);
        }
        else {
            return $return;
        }
    }



}
