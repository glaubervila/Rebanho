<?php


class TransferenciasPDF extends appReports{

    private $orientacao ='L'; //orientação P-Retrato ou L-Paisagem
    private $papel      ='A4';     //formato do papel
    private $unidade    = 'mm';

    private $destino = 'F';  //destivo do arquivo pdf I-borwser, S-retorna o arquivo, D-força download, F-salva em arquivo local
    private $pdfDir  = '';      //diretorio para salvar o pdf com a opção de destino = F
    private $pdfName = 'Transferencias.pdf';

   public function GeraPdf(){

        $this->FPDF($this->orientacao,$this->unidade,$this->papel);

        $this->AliasNbPages();
        $this->AddPage();

        //$this->SetMargins(5, 5, 5);
        $this->SetAutoPageBreak(true, 10);

        $this->SetLineWidth(0.1);

        $this->SetDrawColor(0,0,0);
        $this->SetFillColor(255,255,255);
        $this->SetTextColor(0,0,0);

    }

    // // Page header
    function Header()
    {

        if ($this->repeatHeader){
            $this->makeHeader();
        }
        else {
            if ($this->PageNo() == 1){
                $this->makeHeader();
            }
        }
    }


    public function makeHeader(){

        $total = $this->getTotalRegistros();

        //Cabecalho
        $this->SetFont('Arial','B',12);
        $this->SetTextColor(0,0,0);
        // Confinamento
        $this->Cell(0, 7, utf8_decode($this->data_filter->confinamento), 0, 0, 'L');
        $this->Ln();
        // Nome do Relatorio
        $tipo = $this->data_filter->tipo_transferencia;
        $this->SetFont('Arial','B',10);
        $this->Cell(0, 5, utf8_decode("Relatório Transferencias {$tipo}"), 0, 0, 'L');
        $this->Ln();
        // Data Inicial
        $this->SetFont('Arial','B',8);
        $this->Cell(20, 4, utf8_decode("Data Inicial: "), 0, 0, 'L');
        $this->SetFont('Arial','',8);
        $this->Cell(20, 4, utf8_decode($this->data_filter->data_inicial), 0, 0, 'L');
        // Data Final
        $this->SetFont('Arial','B',8);
        $this->Cell(20, 4, utf8_decode("Data Final: "), 0, 0, 'L');
        $this->SetFont('Arial','',8);
        $this->Cell(20, 4, utf8_decode($this->data_filter->data_final), 0, 0, 'L');
        $this->Ln();
        // Mostrando Resultados
        $this->SetFont('Arial','B',8);
        $this->Cell(25, 4, utf8_decode("Data Relatório: "), 0, 0, 'L');
        $this->SetFont('Arial','',8);
        $this->Cell(30, 4, utf8_decode($this->data_filter->data_relatorio), 0, 0, 'L');

        $this->SetFont('Arial','B',8);
        $this->Cell(80, 4, utf8_decode("{$total} Registros em {nb} Páginas"), 0, 0, 'R');
        $this->Cell(55, 4, utf8_decode("Página ".$this->PageNo()."/ {nb}"), 0, 0, 'R');
        $this->Ln();
        $this->Cell(0, 0.5, '', 1, 0, 'R');
        $this->Ln(4);

    }


    // Responsavel por criar o cabecalho de cada transferencia
    public function transferencia($row){

        // Data de Saida
        $this->SetFont('Times','B',10);
        $this->Cell(25, 6, utf8_decode("Data Saída: "), 'LTB', 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(25, 6, utf8_decode($row->data_saida), 'TBR', 0, '');
        // Origem
        $this->SetFont('Times','B',10);
        $this->Cell(20, 6, utf8_decode("Origem: "), 'LTB', 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(40, 6, utf8_decode($row->origem_nome), 'TBR', 0, '');

        $this->Ln();

        // Data de Entrada
        $this->SetFont('Times','B',10);
        $this->Cell(25, 6, utf8_decode("Data Entrada: "), 'LTB', 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(25, 6, utf8_decode($row->data_saida), 'TBR', 0, '');
        // Destino
        $this->SetFont('Times','B',10);
        $this->Cell(20, 6, utf8_decode("Destino: "), 'LTB', 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(40, 6, utf8_decode($row->destino_nome), 'TBR', 0, '');

        $this->Ln(10);


        // Status
        $this->SetFont('Times','B',10);
        $this->Cell(20, 6, utf8_decode("Status: "), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(30, 6, utf8_decode($row->status_nome), 'TBR', 0, '');

        // Peso Total
        $this->SetFont('Times','B',10);
        $this->Cell(25, 6, utf8_decode("Peso Total: "), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(25, 6, utf8_decode($row->saida_peso_total), 'TBR', 0, '');


        // Machos
        $this->Ln();
        $this->SetFont('Times','B',10);
        $this->Cell(20, 6, utf8_decode("Machos: "), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(30, 6, utf8_decode($row->machos), 'TBR', 0, '');

        // Peso Medio
        $this->SetFont('Times','B',10);
        $this->Cell(25, 6, utf8_decode("Peso Médio: "), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(25, 6, utf8_decode($row->saida_peso_medio), 'TBR', 0, '');


        // Femeas
        $this->Ln();
        $this->SetFont('Times','B',10);
        $this->Cell(20, 6, utf8_decode("Femeas:"), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(30, 6, utf8_decode($row->femeas), 'TBR', 0, '');

        // Maior Peso 
        $this->SetFont('Times','B',10);
        $this->Cell(25, 6, utf8_decode("Maior Peso: "), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(25, 6, utf8_decode($row->saida_maior_peso), 'TBR', 0, '');

        // Total
        $this->Ln();
        $this->SetFont('Times','B',10);
        $this->Cell(20, 6, utf8_decode("Total:"), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(30, 6, utf8_decode($row->quantidade), 'TBR', 0, '');

        // Menor Peso
        $this->SetFont('Times','B',10);
        $this->Cell(25, 6, utf8_decode("Menor Peso: "), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(25, 6, utf8_decode($row->saida_menor_peso), 'TBR', 0, '');

        $this->Ln(6);
    }

    public function gridEntradaAnimaisTransferidos(){

        // Criando a Grid
        $this->DataGrid(0);

        // cria os estilos utilizados no documento
        $this->addStyle('gridTitle', 'Times', '10', 'B', '#1F497D', '#E0EBFF');
        $this->addStyle('rowP', 'Times', '10', '',  '#000000', '#FFFFFF', 1);
        $this->addStyle('rowI', 'Times', '10', '',  '#000000', '#FFFFFF', 1);


        $this->gridAddColumn('LINENUNBER'    , 'N', 'center', 8, FALSE,TRUE);
//         $this->gridAddColumn('origem_codigo', 'Cod. Ant', 'center', 20);
//         $this->gridAddColumn('sexo', 'S', 'center', 5);
//         $this->gridAddColumn('origem_data_entrada', 'Entrada', 'center', 20, 'dateBr');
//         $this->gridAddColumn('origem_peso_entrada', 'Peso Entrada', 'center', 25);
//         $this->gridAddColumn('origem_peso_saida', 'Peso Saida', 'center', 20);
//         $this->gridAddColumn('origem_dias_confinado', 'Permanencia', 'center', 25);
//         $this->gridAddColumn('origem_ganho', 'Ganho', 'center', 20);
//         $this->gridAddColumn('origem_ganho_medio', 'Ganho/Dia', 'center', 20,'corClassificacao');

        $this->gridAddColumn('destino_codigo', 'Codigo', 'center', 20);
        $this->gridAddColumn('destino_data_entrada', 'Entrada', 'center', 20, 'dateBr');
        $this->gridAddColumn('destino_peso_entrada', 'Peso Entrada', 'center', 25);
        $this->gridAddColumn('destino_peso_saida', 'Peso Saida', 'center', 20);
        $this->gridAddColumn('destino_dias_confinado', 'Permanencia', 'center', 25);
        $this->gridAddColumn('destino_ganho', 'Ganho', 'center', 20);
        $this->gridAddColumn('destino_ganho_medio', 'Ganho/Dia', 'center', 20,'corClassificacao');


        $this->simpleGrid();

    }


    public function gridSaidaAnimaisTransferidos(){

        // Criando a Grid
        $this->DataGrid(0);

        // cria os estilos utilizados no documento
        $this->addStyle('gridTitle', 'Times', '10', 'B', '#1F497D', '#E0EBFF');
        $this->addStyle('rowP', 'Times', '10', '',  '#000000', '#FFFFFF', 1);
        $this->addStyle('rowI', 'Times', '10', '',  '#000000', '#FFFFFF', 1);


        $this->gridAddColumn('LINENUNBER'    , 'N', 'center', 8, FALSE,TRUE);
        $this->gridAddColumn('origem_codigo', 'Codigo', 'center', 20);
        $this->gridAddColumn('sexo', 'S', 'center', 5);
        $this->gridAddColumn('origem_data_entrada', 'Entrada', 'center', 20, 'dateBr');
        $this->gridAddColumn('origem_peso_entrada', 'Peso Entrada', 'center', 25);
        $this->gridAddColumn('origem_data_saida', 'Entrada', 'center', 20, 'dateBr');
        $this->gridAddColumn('origem_peso_saida', 'Peso Saida', 'center', 20);
        $this->gridAddColumn('origem_dias_confinado', 'Permanencia', 'center', 25);
        $this->gridAddColumn('origem_ganho', 'Ganho', 'center', 20);
        $this->gridAddColumn('origem_ganho_medio', 'Ganho/Dia', 'center', 20,'corClassificacao');

        $this->simpleGrid();

    }


    public function corClassificacao($ganho_medio, $obj){

        $cor = $obj->origem_corClassificacao;

        if ($ganho_medio){
            $return = new StdClass();
            $return->tipo = 'BackgroundColor';
            $return->value = $ganho_medio;
            $return->backgroundColor = $cor;
            return $return;
        }
        else {
            return $ganho_medio;
        }

    }

}
