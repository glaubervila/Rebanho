<?php
header('Content-Type: text/javascript; charset=UTF-8');
/** @Class: Animais
 *  @date: 2012-07-01
 */

class AnimaisResumo extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "animais";

    public function load($data, $return_json = true){

        // Se for um Array e pq e uma requisicao vinda de uma grid e nao de um metodo
        if (is_array($data)){
            if ($data["filter"]){
                $strFiltros = $this->parseFilter($data["filter"]);

                $confinamento_id = $data['confinamento_id'];
            }
            if ($data["sort"]){
                $strSorters = $this->parseSorter($data["sort"]);
            }
        }
        else {
            $confinamento_id = $data->confinamento_id;

            $strFiltros = "confinamento_id = $confinamento_id";
            $strSorters = " confinamento_id ASC, id ASC";
        }


        // recuperar o Confinamento
        $confinamento = $this->findBy('id', $confinamento_id, 'confinamentos');


        // Saber o Total de Animais Ativos no Confinamento
        $total_ativo = $this->filter('COUNT(*) as total', 'animais', "confinamento_id = {$confinamento_id} AND status = 1" , null, false);

        // recuperar todas as quadras do confinamento
        $quadras = $this->filter(null, 'quadras', $strFiltros, $strSorters, false);


        $records = array();


        // Para Cada Quadra, Formato o Retorno
        foreach ($quadras as $quadra){
            $record = new StdClass();

            // Confinamento
            $record->confinamento_id = $confinamento->id;
            $record->confinamento    = $confinamento->confinamento;
            $record->total_ativo = $total_ativo[0]->total;

            // Quadra
            $record->quadra_id = $quadra->id;
            $record->quadra    = $quadra->quadra;


            // Recuperar quantidade de machos por quadra
            $record->quantidade_machos = Quadras::getQuantidadeQuadra($record->confinamento_id, $record->quadra_id, 1, 'M');

            // Recuperar quantidade de Femeas por quadra
            $record->quantidade_femeas = Quadras::getQuantidadeQuadra($record->confinamento_id, $record->quadra_id, 1, 'F');

            // Recuperar quantidade de animais na quadra
            $record->quantidade_total = ($record->quantidade_machos + $record->quantidade_femeas);

            $records[] = $record;

            $record = null;

        }

        if ($return_json){
            echo  json_encode($records);
        }
        else {
            return $records;
        }


    }


    public function getResumoConfinamento($data){

        // Verificar os Campos Obrigatorios
        if ((empty($data->confinamento_id)) || ($data->confinamento_id == null) ){
            $return->failure = true;
            $result->msg = "Campo Confinamento é Obrigatório!";
            return $result;
        }


        $result = AnimaisResumo::load($data,false);

        $return = new StdClass();

        if (count($result) > 0){

            $return->success = true;
            $return->data = $result;
        }
        else {
            $return->failure = true;
            $return->msg = "Desculpe mas Nenhum resultado Foi Encontrado!";
        }

        return $return;
    }
}