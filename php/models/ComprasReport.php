<?php
ini_set('memory_limit', '64M');
/**
* Tipos de Relatorios de Transferencia
* 0 - Ativos
* 1 - Encerrados
* 2 - Todos
**/

header('Content-Type: text/javascript; charset=UTF-8');

class ComprasReport extends Base {

    private     $valor = null;
    private     $data  = null;


    public function getRelatorioCompras ($data, $json = true){

        //var_dump($data);

        $data_report = new StdClass();

        // Tratar as Datas do Filtro
        if ($data->data_inicial != null){
            $data->data_inicial = $this->DateToMysql($data->data_inicial);
        }
        if ($data->data_final != null){
            $data->data_final = $this->DateToMysql($data->data_final);
        }


        switch ($data->tipo_relatorio){
            // Tipo 0 - Ativos
            case 0:
                $data_report = CompraAnimais::getComprasAtivasReport($data);
                //var_dump($data_report);
                if ($data_report->success){
                    $report = ComprasReport::ComprasAtivas($data, $data_report);
                }
            break;

        }

        if ($data_report->failure){
            echo json_encode($data_report);
        }
    }

    public function ComprasAtivas($data_filter, $data_report){

        $pdf = new ComprasPDF();

        $total = count($data_report->data);
        $pdf->setTotalRegistros($total);

        // Setando o Tipo de Transferencias
        //$data_filter->tipo_transferencia = "Saída";

        $pdf->setDataFilter($this->criar_filtros($data_filter));

        // Para Cada Compra criar o cabecalho
        $rows = $data_report->data;

        $pdf->GeraPdf();

        foreach($rows as $row){


            $pdf->compra($row);

            //var_dump($row->a_animais);
            $pdf->setDataReport($row->a_animais);
 
            $pdf->gridCompraAnimaisAtivos();

            $pdf->addPage();
        }


        $return = $pdf->Save('TransferenciasSaida.pdf', 'F');

        echo json_encode($return);

    }


 


    public function criar_filtros($data_filter){

        // Recuperando o Nome do Confinamento
        $data_filter->confinamento = Confinamentos::getNome($data_filter->confinamento_id);
        if ((empty($data->data_inicial)) || ($data->data_inicial == null) ){
            $data_filter->data_inicial = $this->dateBr($data_filter->data_inicial);
        }
        if ((empty($data->data_final)) || ($data->data_final == null) ){
            $data_filter->data_final = $this->dateBr($data_filter->data_final);
        }
        $data_filter->data_relatorio = date('d/m/Y H:m:i');
        return $data_filter;
    }

}
