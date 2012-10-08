<?php
header('Content-Type: text/javascript; charset=UTF-8');
/** @Class: Animais
 *  @date: 2012-07-01
 */

class AnimaisResumo extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "animais";


    public function load($data){
        //var_dump($data);

        $strFiltros = $this->parseFilter($data["filter"]);
        $strSorters = $this->parseSorter($data["sort"]);

        $defaultFilter = "confinamento_id = {$data['confinamento_id']} AND status = 1";

        // recuperar o Confinamento
        $confinamento = $this->findBy('id', $data['confinamento_id'], 'confinamentos');


        // Saber o Total de Animais Ativos no Confinamento
        $total_ativo = $this->filter('COUNT(*) as total', 'animais', $defaultFilter , null, false);

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

        echo  json_encode($records);
    }
}