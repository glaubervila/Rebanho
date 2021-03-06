<?php
ini_set('memory_limit', '64M');
/**
* Tipos de Relatorios de Pesagens
* 0 - Relatorio Individual
**/

header('Content-Type: text/javascript; charset=UTF-8');

class PesagensReport extends Base {

    private     $valor = null;
    private     $data  = null;
    protected   $table = "pesagens";


    public function getRelatorioPesagens ($data, $json = true){

        //var_dump($data);
        // Tratar as Datas do Filtro
        if ($data->data_inicial != null){
            $data->data_inicial = $this->DateToMysql($data->data_inicial);
        }
        if ($data->data_final != null){
            $data->data_final = $this->DateToMysql($data->data_final);
        }


        $result = new StdClass();

        switch ($data->tipo_relatorio){
            // Tipo 0 - Relatorio Individual
            case 0:
                $data_report = Pesagens::RelatorioIndividual($data, false);
                //var_dump($data_report);
                if ($data_report->success){
                    $report = PesagensReport::RelatorioIndividual($data, $data_report);
                }
            break;
            // Tipo 1 - Relatorio Pesagens Resumido
            // Confinamento - Obrigatorio
            // Data de Inicial - Obrigatorio
            case 1:
                // Aki eu adiciono os tipos de pesagem enquanto nao vem pelo filtro
                $data->tipo_pesagem = '1,2,4';
                $data_report = Pesagens::RelatorioIndividual($data, false);
                //var_dump($data_report);
                if ($data_report->success){
                    $report = PesagensReport::RelatorioPesagensResumido($data, $data_report);
                }
            break;

            // Tipo 2 - Relatorio Resumo Confinamento
            // Confinamento - Obrigatorio
            case 2:
                $data_report = AnimaisResumo::getResumoConfinamento($data);
                //var_dump($data_report);
                if ($data_report->success){
                    $report = PesagensReport::ResumoConfinamento($data, $data_report);
                }
            break;


        }

        if ($data_report->failure){
            echo json_encode($data_report);
        }
    }

    public function RelatorioIndividual($data_filter, $data_report){
        // Testar o Tipo do Relatorio

        $pdf = new PesagensPDF();

        $pdf->setDataReport($data_report->data);
        //var_dump($data_report->data);

        $pdf->individual();


        $return = $pdf->Save('pesagens.pdf', 'F');

        //$pdf->Output($arq,'F');
        echo json_encode($return);


    }

    public function RelatorioPesagensResumido($data_filter, $data_report){


        //var_dump($data_report);
        $pdf = new PesagensResumidoPDF();

        $pdf->setDataFilter($this->criar_filtros($data_filter));

        //$pdf->setRepeatHeader(true);
        $pdf->setDataReport($data_report->data);

        $pdf->resumido();

        $return = $pdf->Save('PesagensResumido.pdf', 'F');

        echo json_encode($return);

    }


    public function ResumoConfinamento($data_filter, $data_report){

        $pdf = new ResumoConfinamentoPDF();

        $pdf->setDataFilter($this->criar_filtros($data_filter));

        $pdf->setRepeatHeader(true);
        $pdf->setDataReport($data_report->data);

        $pdf->resumoConfinamento();

        $return = $pdf->Save('ResumoConfinamento.pdf', 'F');

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
