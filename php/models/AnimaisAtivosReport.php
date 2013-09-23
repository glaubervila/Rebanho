<?php
ini_set('memory_limit', '64M');

header('Content-Type: text/javascript; charset=UTF-8');

class AnimaisAtivosReport extends Base {

    private     $valor = null;
    private     $data  = null;
    protected   $table = "vw_animais";


    public function getRelatorioAnimaisAtivos ($data, $json = true){

        if ($data->confinamento_id > 0){

            $result = new StdClass();
            $data_report = Animais::getAnimaisAtivosReport($data, false);
            //var_dump($data_report);
            if ($data_report->success){
              $report = AnimaisAtivosReport::RelatorioAnimaisAtivos($data, $data_report);
            }
            else {
                echo json_encode($data_report);
            }
        }
        else {
            $data_report->failure = true;
            $data_report->msg = "Por Favor Preencha o Campo Confinamento!";
            echo json_encode($data_report);
        }
    }

    public function RelatorioAnimaisAtivos($data_filter, $data_report){
        // Testar o Tipo do Relatorio

        $pdf = new AnimaisAtivosPDF();
        $pdf->setDataReport($data_report->data);

        $pdf->setDataFilter($this->criar_filtros($data_filter));

        $pdf->setRepeatHeader(true);
 
        $pdf->AnimaisAtivos();
 
 
        $return = $pdf->Save('animaisativos.pdf', 'F');
 
        echo json_encode($return);

    }

    public function criar_filtros($data_filter){

        // Recuperando o Nome do Confinamento
        $data_filter->confinamento = Confinamentos::getNome($data_filter->confinamento_id);
        $data_filter->quadra = "";
        if ($data_filter->quadra_id !=0){
            $quadra = Base::find($data_filter->quadra_id, 'quadras', 'quadra');
            $data_filter->quadra = $quadra->quadra;
        }
        $data_filter->data_relatorio = date('d/m/Y H:m:i');

        return $data_filter;
    }

}
