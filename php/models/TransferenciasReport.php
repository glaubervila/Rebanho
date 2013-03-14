<?php
ini_set('memory_limit', '64M');
/**
* Tipos de Relatorios de Transferencia
* 0 - Entrada (Completo com os animais)
* 1 - Entrada Resumido
* 2 - Saida
* 3 - Saida / Resumido
**/

header('Content-Type: text/javascript; charset=UTF-8');

class TransferenciasReport extends Base {

    private     $valor = null;
    private     $data  = null;
    protected   $table = "pesagens";


    public function getRelatorioTransferencias ($data, $json = true){

        //var_dump($data);

        $data_report = new StdClass();

        // Confinamento Obrigatorio
        if (((empty($data->confinamento_id)) || ($data->confinamento_id == null))){
            $data_report->failure = true;
            $data_report->msg = "Por Favor Preencha o Campo Confinamento!";
            echo json_encode($data_report);
        }

        // Tratar as Datas do Filtro
        if ($data->data_inicial != null){
            $data->data_inicial = $this->DateToMysql($data->data_inicial);
        }
        if ($data->data_final != null){
            $data->data_final = $this->DateToMysql($data->data_final);
        }




        switch ($data->tipo_relatorio){
            // Tipo 0 - Relatorio Entrada
            case 0:
                $data_report = Transferencias::getTransferenciasReport($data);
                //var_dump($data_report);
                if ($data_report->success){
                    $report = TransferenciasReport::Entrada($data, $data_report);
                }
            break;
            // Tipo 1 - Relatorio Entrada Resumido
            case 1:
                $data_report = Transferencias::getTransferenciasResumidoReport($data);
                if ($data_report->success){
                    $report = TransferenciasReport::EntradaResumido($data, $data_report);
                }
            break;
 
            // Tipo 2 - Relatorio Saida
            case 2:
                $data_report = Transferencias::getTransferenciasReport($data);
                //var_dump($data_report);
                if ($data_report->success){
                    $report = TransferenciasReport::Saida($data, $data_report);
                }
            break;

            // Tipo 3 - Relatorio Saida Resumido
            case 3:
                $data_report = Transferencias::getTransferenciasResumidoReport($data);
                //var_dump($data_report);
                if ($data_report->success){
                    $report = TransferenciasReport::SaidaResumido($data, $data_report);
                }
            break;

        }

        if ($data_report->failure){
            echo json_encode($data_report);
        }
    }

    public function SaidaResumido($data_filter, $data_report){
 
        $pdf = new TransferenciasResumidoPDF();


        // Setando o Tipo de Transferencias
        $data_filter->tipo_transferencia = "Saída";
        $pdf->setDataFilter($this->criar_filtros($data_filter));

        $pdf->setDataReport($data_report->data);



        $pdf->saidaresumido();


        $return = $pdf->Save('TransferenciasSaidaResumido.pdf', 'F');

        echo json_encode($return);

    }

    public function EntradaResumido($data_filter, $data_report){

        $pdf = new TransferenciasResumidoPDF();


        // Setando o Tipo de Transferencias
        $data_filter->tipo_transferencia = "Entrada";
        $pdf->setDataFilter($this->criar_filtros($data_filter));

        $pdf->setDataReport($data_report->data);



        $pdf->entradaresumido();


        $return = $pdf->Save('TransferenciasSaidaResumido.pdf', 'F');

        echo json_encode($return);


    }


    public function Saida($data_filter, $data_report){

        $pdf = new TransferenciasPDF();

        $total = count($data_report->data);
        $pdf->setTotalRegistros($total);

        // Setando o Tipo de Transferencias
        $data_filter->tipo_transferencia = "Saída";

        $pdf->setDataFilter($this->criar_filtros($data_filter));

        // Para Cada Transferencia criar o cabecalho

        $rows = $data_report->data;

        $pdf->GeraPdf();

        foreach($rows as $row){

            // Linha para separar os registros
            $pdf->Ln(10);
            $pdf->SetFillColor(0,0,255);
            $pdf->Cell(0, 2, '', 1, 0, 'R', true);
            $pdf->Ln(4);
            $pdf->SetFillColor(255,255,255);

            $pdf->transferencia($row);

                //var_dump($row->a_animais);
            $pdf->setDataReport($row->a_animais);

            $pdf->gridSaidaAnimaisTransferidos();

            $pdf->addPage();
        }


        $return = $pdf->Save('TransferenciasSaida.pdf', 'F');

        echo json_encode($return);

    }

    public function Entrada($data_filter, $data_report){

        $pdf = new TransferenciasPDF();

        $total = count($data_report->data);
        $pdf->setTotalRegistros($total);

        // Setando o Tipo de Transferencias
        $data_filter->tipo_transferencia = "Entrada";

        $pdf->setDataFilter($this->criar_filtros($data_filter));

        // Para Cada Transferencia criar o cabecalho

        $rows = $data_report->data;

        $pdf->GeraPdf();

        foreach($rows as $row){

            // Linha para separar os registros
            $pdf->Ln(10);
            $pdf->SetFillColor(0,0,255);
            $pdf->Cell(0, 2, '', 1, 0, 'R', true);
            $pdf->Ln(4);
            $pdf->SetFillColor(255,255,255);

            $pdf->transferencia($row);

                //var_dump($row->a_animais);
            $pdf->setDataReport($row->a_animais);

            $pdf->gridEntradaAnimaisTransferidos();

            $pdf->addPage();
        }


        $return = $pdf->Save('TransferenciasEntrada.pdf', 'F');

        echo json_encode($return);

    }

 
//     public function RelatorioPesagensResumido($data_filter, $data_report){
// 
// 
//         //var_dump($data_report);
//         $pdf = new PesagensResumidoPDF();
// 
//         $pdf->setDataFilter($this->criar_filtros($data_filter));
// 
//         //$pdf->setRepeatHeader(true);
//         $pdf->setDataReport($data_report->data);
// 
//         $pdf->resumido();
// 
//         $return = $pdf->Save('PesagensResumido.pdf', 'F');
// 
//         echo json_encode($return);
// 
//     }
// 
// 
//     public function ResumoConfinamento($data_filter, $data_report){
// 
//        // echo "Entrou aki";
// //         //var_dump($data_report);
//         $pdf = new ResumoConfinamentoPDF();
// // 
//         $pdf->setDataFilter($this->criar_filtros($data_filter));
// // 
//         $pdf->setRepeatHeader(true);
//         $pdf->setDataReport($data_report->data);
// // 
//         $pdf->resumoConfinamento();
// // 
//         $return = $pdf->Save('ResumoConfinamento.pdf', 'F');
// // 
//         echo json_encode($return);
// 
//     }


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
