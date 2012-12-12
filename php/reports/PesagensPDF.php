<?php

class PesagensPDF extends appReports{


    // // Page header
    function Header()
    {
        // Logo
        //$this->Image('logo.png',10,6,30);
        // Arial bold 15
//         $this->SetFont('Arial','B',15);
//         // Move to the right
//         $this->Cell(80);
//         // Title
//         $this->Cell(30,10,'Title',1,0,'C');
//         // Line break
//         $this->Ln(10);
//         $this->Ln(10);
    }

    public function individual(){

        $this->AliasNbPages();
        $this->AddPage();
//        $this->Open();
        $this->SetMargins(5, 5, 5);
        $this->SetAutoPageBreak(true, 10);

        $this->SetLineWidth(0.1);
 
        $this->SetDrawColor(100,100,100);
        $this->SetFillColor(255,255,255);
        $this->SetTextColor(0,0,0);
 
        // Criando a Grid
        $this->DataGrid(0);

        // cria os estilos utilizados no documento
        $this->addStyle('gridTitle', 'Courier', '12', 'B', '#1F497D', '#E0EBFF');
        $this->addStyle('rowP', 'Courier', '12', '',  '#000000', '#FFFFFF', 'T');
        $this->addStyle('rowI', 'Courier', '12', '',  '#000000', '#E0EBFF', 'T');

        $this->gridAddColumn('codigo', 'Codigo', 'center', 20);
        $this->gridAddColumn('sexo', 'S', 'center', 5);
        $this->gridAddColumn('strStatus', 'Status', 'center', 16);
        $this->gridAddColumn('quadra', 'Quadra', 'center', 30);
// 
//         $this->gridAddColumn('idade', 'Idade', 'center', 15);
//         $this->gridAddColumn('dias_confinamento', 'Perm', 'center', 12);

        $this->gridAddColumn('data_entrada', 'Entrada', 'center', 22, 'dateBr');
        $this->gridAddColumn('peso_entrada', 'Peso', 'center', 12);
// 
        $this->gridAddColumn('data_pesagem', 'Pesagem', 'center', 22, 'dateBr');
        $this->gridAddColumn('peso', 'Peso', 'center', 12);
// 
//         $this->gridAddColumn('data_saida', 'Saida', 'center', 20, 'dateBr');
//         $this->gridAddColumn('pesagem_saida', 'Peso', 'center', 12);
// 
//         $this->gridAddColumn('peso_ganho', 'Ganho', 'center', 18);
//         $this->gridAddColumn('intervalo', 'Interv.', 'center', 18);
//         $this->gridAddColumn('media_dia', 'Kg/Dia', 'center', 18);


        $this->simpleGrid();

 
//         $x = $this->GetX();
//         $y = $this->GetY();
// 
        //$this->HdashedLine($x,$y,201,0.1,80);


//         $x = $this->GetX();
//         $y = $this->GetY();
// 
//         $this->TextBox($x,$y,40,24,'TESTE',null,'B','C',true,'');

       //var_dump($this->data_report);


/*        $header = array('Country', 'Capital', 'Area (sq km)', 'Pop. (thousands)');
        $this->FancyTable($header,(array)$this->data_report);*/
    }


}
