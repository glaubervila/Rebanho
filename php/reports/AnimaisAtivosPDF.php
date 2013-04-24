<?php

class AnimaisAtivosPDF extends appReports{

    private $orientacao ='L'; //orientação P-Retrato ou L-Paisagem
    private $papel      ='A4';     //formato do papel
    private $unidade    = 'mm';

    private $destino = 'F';  //destivo do arquivo pdf I-borwser, S-retorna o arquivo, D-força download, F-salva em arquivo local
    private $pdfDir  = '';      //diretorio para salvar o pdf com a opção de destino = F
    private $pdfName = 'AnimaisAtivos.pdf';

   public function GeraPdf(){

        $this->FPDF($this->orientacao,$this->unidade,$this->papel);

        $this->AliasNbPages();
        $this->AddPage();

        $this->SetMargins(10, 10, 10);
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
        $this->SetFont('Arial','B',10);
        $this->Cell(0, 5, utf8_decode("Relatório de Animais Ativos"), 0, 0, 'L');
        $this->Ln();

        // Quadra
        $this->SetFont('Arial','B',8);
        $this->Cell(15, 4, utf8_decode("Quadra: "), 0, 0, 'L');
        $this->SetFont('Arial','',8);
        $this->Cell(20, 4, utf8_decode($this->data_filter->quadra), 0, 0, 'L');
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



    public function AnimaisAtivos(){

        $this->GeraPdf();


        // Criando a Grid
        $this->DataGrid(0);

        // cria os estilos utilizados no documento
        $this->addStyle('gridTitle', 'Times', '10', 'B', '#1F497D', '#E0EBFF');
        $this->addStyle('rowP', 'Times', '10', '',  '#000000', '#FFFFFF', 1);
        $this->addStyle('rowI', 'Times', '10', '',  '#000000', '#F0F0F0', 1);


        //$this->gridAddColumn('LINENUNBER'    , 'N', 'center', 8, FALSE,TRUE);
        $this->gridAddColumn('codigo', 'Codigo', 'center', 16, false,false,'left');
        $this->gridAddColumn('sexo', 'S', 'center', 5);
        $this->gridAddColumn('idade_atual', 'Idade', 'center', 12);
        //$this->gridAddColumn('strStatus', 'Status', 'center', 16);
        $this->gridAddColumn('data_entrada', 'Entrada', 'center', 20, 'dateBr', false,false,'left');
        $this->gridAddColumn('peso_entrada', 'Peso Entrada', 'center', 22);
        $this->gridAddColumn('dias_confinamento', 'Dias/Conf', 'center', 20);

        $this->gridAddColumn('data_ultima_pesagem', 'Data Pesagem', 'center', 25, 'dateBr', false,false,'left');
        $this->gridAddColumn('peso_atual', 'Peso', 'center', 20);
        $this->gridAddColumn('peso_ganho', 'Ganho', 'center', 20);
//        $this->gridAddColumn('ganho_diario', 'Ganho/Dia', 'center', 25, 'corClassificacao');

        $this->simpleGrid();



        // Criando a Grid de Legenda
        $legenda = Pesagens::getLegendaClassificacao();
        //var_dump($legenda);
        $this->setDataReport($legenda);
        $this->DataGrid(1);

        $this->addStyle('gridTitle', 'Times', '10', 'B', '#1F497D', '#E0EBFF');
        $this->addStyle('rowP', 'Times', '12', '',  '#000000', '#FFFFFF', 1);
        $this->addStyle('rowI', 'Times', '12', '',  '#000000', '#FFFFFF', 1);

        $this->gridAddColumn('descricao', 'Legenda Ganho kg/Dia', 'center', 50, null,null,'left');
        $this->gridAddColumn('cor', 'Cor', 'center', 20, 'corLegenda');


        $this->simpleGrid();

    }


    public function corClassificacao($ganho_medio, $obj){

        $cor = $obj->corClassificacao;

        $return = new StdClass();
        $return->tipo = 'BackgroundColor';
        $return->value = $ganho_medio;
        $return->backgroundColor = $cor;
        return $return;
    }

    public function corLegenda($cor, $obj){


        $return = new StdClass();
        $return->tipo = 'BackgroundColor';
        $return->value = '';
        $return->backgroundColor = $cor;

        return $return;
    }

}
