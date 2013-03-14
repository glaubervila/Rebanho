<?php


class TransferenciasResumidoPDF extends appReports{

    private $orientacao ='L'; //orientação P-Retrato ou L-Paisagem
    private $papel      ='A4';     //formato do papel
    private $unidade    = 'mm';

    private $destino = 'F';  //destivo do arquivo pdf I-borwser, S-retorna o arquivo, D-força download, F-salva em arquivo local
    private $pdfDir  = '';      //diretorio para salvar o pdf com a opção de destino = F
    private $pdfName = 'TransferenciasResumido.pdf';

   public function GeraPdf(){

        $this->FPDF($this->orientacao,$this->unidade,$this->papel);

        $this->AliasNbPages();
        $this->AddPage();

        //$this->SetMargins(5, 5, 5);
        $this->SetAutoPageBreak(true, 10);

        $this->SetLineWidth(0.1);

        $this->SetDrawColor(100,100,100);
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

        $total = count($this->data_report);

        //Cabecalho
        $this->SetFont('Arial','B',12);
        $this->SetTextColor(0,0,0);
        // Confinamento
        $this->Cell(0, 7, utf8_decode($this->data_filter->confinamento), 0, 0, 'L');
        $this->Ln();
        // Nome do Relatorio
        $tipo = $this->data_filter->tipo_transferencia;
        $this->SetFont('Arial','B',10);
        $this->Cell(0, 5, utf8_decode("Relatório Transferencias {$tipo} - Resumido"), 0, 0, 'L');
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

    public function entradaresumido(){

        $this->GeraPdf();


        // Criando a Grid
        $this->DataGrid(0);

        // cria os estilos utilizados no documento
        $this->addStyle('gridTitle', 'Times', '10', 'B', '#1F497D', '#E0EBFF');
        $this->addStyle('rowP', 'Times', '10', '',  '#000000', '#FFFFFF', 'T');
        $this->addStyle('rowI', 'Times', '10', '',  '#000000', '#FFFFFF', 'T');


        //$this->gridAddColumn('LINENUNBER'    , 'N', 'center', 8, FALSE,TRUE);
        $this->gridAddColumn('data_saida', 'Saida', 'center', 18, 'dateBr', false,false,'left');

        $this->gridAddColumn('origem_nome', 'Origem', 'center', 40, 'upper', false,false,'left');

        $this->gridAddColumn('destino_nome', 'Destino', 'center', 40, 'upper', false,false,'left');

        $this->gridAddColumn('data_entrada', 'Entrada', 'center', 18, 'dateBr', false,false,'left');

        $this->gridAddColumn('quantidade', 'Quantidade', 'center', 25);
        $this->gridAddColumn('machos', 'Machos', 'center', 15);
        $this->gridAddColumn('femeas', 'Femeas', 'center', 15);

        $this->gridAddColumn('saida_peso_total', 'Total/Kg', 'center', 30);
        $this->gridAddColumn('saida_peso_medio', 'Medio/Kg', 'center', 25);
        $this->gridAddColumn('saida_maior_peso', 'Maior/Kg', 'center', 25);
        $this->gridAddColumn('saida_menor_peso', 'Menor/Kg', 'center', 25);


        $this->simpleGrid();

    }

    public function saidaresumido(){

        $this->GeraPdf();


        // Criando a Grid
        $this->DataGrid(0);

        // cria os estilos utilizados no documento
        $this->addStyle('gridTitle', 'Times', '10', 'B', '#1F497D', '#E0EBFF');
        $this->addStyle('rowP', 'Times', '10', '',  '#000000', '#FFFFFF', 'T');
        $this->addStyle('rowI', 'Times', '10', '',  '#000000', '#FFFFFF', 'T');


        //$this->gridAddColumn('LINENUNBER'    , 'N', 'center', 8, FALSE,TRUE);
        $this->gridAddColumn('data_saida', 'Saida', 'center', 18, 'dateBr', false,false,'left');

        $this->gridAddColumn('origem_nome', 'Origem', 'center', 40, 'upper', false,false,'left');

        $this->gridAddColumn('destino_nome', 'Destino', 'center', 40, 'upper', false,false,'left');

        $this->gridAddColumn('data_entrada', 'Entrada', 'center', 18, 'dateBr', false,false,'left');

        $this->gridAddColumn('quantidade', 'Quantidade', 'center', 25);
        $this->gridAddColumn('machos', 'Machos', 'center', 15);
        $this->gridAddColumn('femeas', 'Femeas', 'center', 15);

        $this->gridAddColumn('entrada_peso_total', 'Total/Kg', 'center', 30);
        $this->gridAddColumn('entrada_peso_medio', 'Medio/Kg', 'center', 25);
        $this->gridAddColumn('entrada_maior_peso', 'Maior/Kg', 'center', 25);
        $this->gridAddColumn('entrada_menor_peso', 'Menor/Kg', 'center', 25);


        $this->simpleGrid();

    }
}
