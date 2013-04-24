<?php

class PesagensPDF extends appReports{

    private $orientacao ='L'; //orientação P-Retrato ou L-Paisagem
    private $papel      ='A4';     //formato do papel
    private $unidade    = 'mm';

    private $destino = 'F';  //destivo do arquivo pdf I-borwser, S-retorna o arquivo, D-força download, F-salva em arquivo local
    private $pdfDir  = '';      //diretorio para salvar o pdf com a opção de destino = F
    private $pdfName = 'Pesagens.pdf';

   public function GeraPdf(){

        $this->FPDF($this->orientacao,$this->unidade,$this->papel);

        $this->AliasNbPages();
        $this->AddPage();

        $this->SetMargins(5, 5, 5);
        $this->SetAutoPageBreak(true, 10);

        $this->SetLineWidth(0.1);

        $this->SetDrawColor(100,100,100);
        $this->SetFillColor(255,255,255);
        $this->SetTextColor(0,0,0);

    }

    // // Page header
    function Header()
    {

    }


    public function individual(){

        //$this->setDataReport($rows);

        $this->GeraPdf();


        // Criando a Grid
        $this->DataGrid(0);

        // cria os estilos utilizados no documento
        $this->addStyle('gridTitle', 'Courier', '10', 'B', '#1F497D', '#E0EBFF');
        $this->addStyle('rowP', 'Courier', '10', '',  '#000000', '#FFFFFF', 1);
        $this->addStyle('rowI', 'Courier', '10', '',  '#000000', '#FFFFFF', 1);


        $this->gridAddColumn('codigo', 'Codigo', 'center', 20);
        $this->gridAddColumn('sexo', 'S', 'center', 5);
        $this->gridAddColumn('strStatus', 'Status', 'center', 16);
        $this->gridAddColumn('quadra', 'Quadra', 'center', 30);

        $this->gridAddColumn('data_entrada', 'Entrada', 'center', 22, 'dateBr');
        $this->gridAddColumn('peso_entrada', 'Peso', 'center', 12);

        $this->gridAddColumn('data_pesagem', 'Pesagem', 'center', 22, 'dateBr');
        $this->gridAddColumn('peso', 'Peso', 'center', 12);

        $this->simpleGrid();


    }

}
