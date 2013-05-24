<?php


class ComprasPDF extends appReports{

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
        $this->Cell(0, 5, utf8_decode("Relatório Lotes de Compra"), 0, 0, 'L');
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
    public function compra($row){

        // Linha para separar os registros
        $this->SetFillColor(192,255,192);
        // Nome da Fazenda
        $this->SetFont('Times','B',12);
        $this->Cell(0, 6, $row->fazenda, 'LTR', 0, 'C', true);
        $this->Ln();
        // Nome Fornecedor
        $this->SetFont('Times','',12);
        $this->Cell(0, 6, $row->fornecedor_nome, 'LBR', 0, 'C', true);
        $this->Ln(10);
        $this->SetFillColor(255,255,255);


        // Data da Compra
        $this->SetFont('Times','B',10);
        $this->Cell(25, 6, utf8_decode("Data Compra: "), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(25, 6, utf8_decode($row->data_compra), 1, 0, '');

        // Confinamento
        $this->SetFont('Times','B',10);
        $this->Cell(30, 6, utf8_decode("Confinamento: "), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(50, 6, utf8_decode($row->confinamento_nome), 1, 0, '');

        //Vazio
        $this->Cell(65, 6, utf8_decode(''), 0, 0, '');

        // Data de Entrada
        $this->SetFont('Times','B',10);
        $this->Cell(15, 6, utf8_decode("Nota: "), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(25, 6, utf8_decode($row->numero_nota), 1, 0, '');
        // Destino
        $this->SetFont('Times','B',10);
        $this->Cell(15, 6, utf8_decode("Serie: "), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(25, 6, utf8_decode($row->serie_nota), 1, 0, '');

        $this->Ln(10);


        // Vazio
        $this->SetFont('Times','B',10);
        $this->Cell(20, 6, utf8_decode(''), 0, 0, '');
        // Headers
        $this->Cell(15, 6, utf8_decode("Compra"), 1, 0, '');
        $this->Cell(15, 6, utf8_decode("Ativos"), 1, 0, '');
        $this->Cell(15, 6, utf8_decode("Vendido"), 1, 0, '');
        $this->Cell(15, 6, utf8_decode("Morto"), 1, 0, '');

        // Vazio
        $this->Cell(15, 6, '', 0, 0, '');
        // Peso Saida
        $this->SetFont('Times','B',10);
        $this->Cell(30, 6, utf8_decode("Peso Saida:"), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(35, 6, utf8_decode($row->peso_saida), 1, 0, '');

        // Vazio
        $this->Cell(15, 6, '', 0, 0, '');
        // Valor da Nota
        $this->SetFont('Times','B',10);
        $this->Cell(20, 6, utf8_decode("Valor Nota:"), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(40, 6, utf8_decode(''), 1, 0, '');
        $this->Cell(40, 6, utf8_decode("R$ {$row->valor_nota}"), 1, 0, '');

        // Machos
        $this->Ln();
        $this->SetFont('Times','B',10);
        $this->Cell(20, 6, utf8_decode("Machos: "), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(15, 6, utf8_decode($row->qtd_machos), 1, 0, '');
        $this->Cell(15, 6, utf8_decode($row->qtd_machos_ativos), 1, 0, '');
        $this->Cell(15, 6, utf8_decode($row->qtd_machos_vendidos), 1, 0, '');
        $this->Cell(15, 6, utf8_decode($row->qtd_machos_morto), 1, 0, '');

        // Vazio
        $this->Cell(15, 6, '', 0, 0, '');
        // Peso Entrada
        $this->SetFont('Times','B',10);
        $this->Cell(30, 6, utf8_decode("Peso Entrada:"), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(35, 6, utf8_decode($row->peso_entrada), 1, 0, '');

        // Vazio
        $this->Cell(15, 6, '', 0, 0, '');
        // Corretor
        $this->SetFont('Times','B',10);
        $this->Cell(20, 6, utf8_decode("Corretor:"), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(40, 6, utf8_decode($row->corretor), 1, 0, '');
        $this->Cell(40, 6, utf8_decode("R$ {$row->valor_comissao}"), 1, 0, '');

        // Femeas
        $this->Ln();
        $this->SetFont('Times','B',10);
        $this->Cell(20, 6, utf8_decode("Femeas:"), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(15, 6, utf8_decode($row->qtd_femeas), 1, 0, '');
        $this->Cell(15, 6, utf8_decode($row->qtd_femeas_ativos), 1, 0, '');
        $this->Cell(15, 6, utf8_decode($row->qtd_femeas_vendidos), 1, 0, '');
        $this->Cell(15, 6, utf8_decode($row->qtd_femeas_morto), 1, 0, '');

        // Vazio
        $this->Cell(15, 6, '', 0, 0, '');
        // Peso Entrada
        $this->SetFont('Times','B',10);
        $this->Cell(30, 6, utf8_decode("Diferença:"), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(35, 6, utf8_decode($row->diferenca_total), 1, 0, '');

        // Vazio
        $this->Cell(15, 6, '', 0, 0, '');
        // Frete
        $this->SetFont('Times','B',10);
        $this->Cell(20, 6, utf8_decode("Frete:"), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(40, 6, utf8_decode($row->frete), 1, 0, '');
        $this->Cell(40, 6, utf8_decode("R$ {$row->valor_frete}"), 1, 0, '');


        // Total
        $this->Ln();
        $this->SetFont('Times','B',10);
        $this->Cell(20, 6, utf8_decode("Total:"), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(15, 6, utf8_decode($row->quantidade), 1, 0, '');
        $this->Cell(15, 6, utf8_decode($row->quatidade_ativos), 1, 0, '');
        $this->Cell(15, 6, utf8_decode($row->quatidade_vendidos), 1, 0, '');
        $this->Cell(15, 6, utf8_decode($row->quatidade_morto), 1, 0, '');

        // Vazio
        $this->Cell(15, 6, '', 0, 0, '');
        // Peso Entrada
        $this->SetFont('Times','B',10);
        $this->Cell(30, 6, utf8_decode("Diferença Media:"), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(35, 6, utf8_decode($row->diferenca_media), 1, 0, '');


        // Vazio
        $this->Cell(15, 6, '', 0, 0, '');
        // Imposto
        $this->SetFont('Times','B',10);
        $this->Cell(20, 6, utf8_decode("Imposto:"), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(40, 6, utf8_decode($row->imposto), 1, 0, '');
        $this->Cell(40, 6, utf8_decode("R$ {$row->valor_imposto}"), 1, 0, '');


        $this->Ln(8);
        // Peso Medio
        $this->SetFont('Times','B',10);
        $this->Cell(25, 6, utf8_decode("Peso Médio: "), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(25, 6, utf8_decode($row->saida_peso_medio), 'TBR', 0, '');

        // Maior Peso
        $this->SetFont('Times','B',10);
        $this->Cell(25, 6, utf8_decode("Maior Peso: "), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(25, 6, utf8_decode($row->saida_maior_peso), 'TBR', 0, '');


        // Menor Peso
        $this->SetFont('Times','B',10);
        $this->Cell(25, 6, utf8_decode("Menor Peso: "), 1, 0, '');
        $this->SetFont('Times','',10);
        $this->Cell(25, 6, utf8_decode($row->saida_menor_peso), 'TBR', 0, '');

        $this->Ln(6);
    }

    public function gridCompraAnimaisAtivos(){

        // Criando a Grid
        $this->DataGrid(0);

        // cria os estilos utilizados no documento
        $this->addStyle('gridTitle', 'Times', '10', 'B', '#1F497D', '#E0EBFF');
        $this->addStyle('rowP', 'Times', '10', '',  '#000000', '#FFFFFF', 'T');
        $this->addStyle('rowI', 'Times', '10', '',  '#000000', '#FFFFFF', 'T');



        $this->gridAddColumn('LINENUNBER'    , 'N', 'center', 8, FALSE,TRUE);
        $this->gridAddColumn('origem_codigo', 'Codigo', 'center', 20);
        $this->gridAddColumn('sexo', 'S', 'center', 5);
        //$this->gridAddColumn('origem_data_entrada', 'Entrada', 'center', 20, 'dateBr');
        $this->gridAddColumn('peso_compra', 'Peso Compra', 'center', 25);
        $this->gridAddColumn('origem_peso_entrada', 'Peso Entrada', 'center', 25);
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
