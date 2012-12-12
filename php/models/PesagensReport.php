<?php

/**
* Tipos de Relatorios de Pesagens
* 0 - Relatorio Individual
**/

header('Content-Type: text/javascript; charset=UTF-8');

class PesagensReport extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "pesagens";


    public function getRelatorioPesagens ($data, $json = true){

        //var_dump($data);
        // Tratar as Datas do Filtro
        if ($data->data_inicial){
            $data->data_inicial = $this->DateToMysql($data->data_inicial);
        }
        if ($data->data_final){
            $data->data_final = $this->DateToMysql($data->data_final);
        }


        switch ($data->tipo){
            // Tipo 0 - Relatorio Individual
            case 0:
                $data_report = Pesagens::RelatorioIndividual($data, false);
                if ($data_report->success){
                    $report = PesagensReport::RelatorioIndividual($data_report);
                }
            break;
        }

        //var_dump($report);
    }

    public function RelatorioIndividual($data_report){
        // Testar o Tipo do Relatorio

//        $file = 'teste.pdf';
//        $path = '../tmp';
//        $filename = 'testeteste.pdf';
//        $arq = "$path/$file";

        $pdf = new PesagensPDF('L','mm','A4');

        $pdf->setDataReport($data_report->data);
        var_dump($data_report->data);

        $pdf->individual();

        $return = $pdf->Save('pesagens.pdf', 'F');

        //$pdf->Output($arq,'F');
        echo json_encode($return);


    }

}
