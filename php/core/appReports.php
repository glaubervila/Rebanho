<?php
/** Class appReports
*
**/

//class appReports extends FPDF{
class appReports extends PDF_Code128 {

    public  $data_report;

    private $columns;
    private $colcounter;

    private $lastLineH;

    public function setDataReport($data_report){
        $this->data_report = $data_report;
    }

    public function getDataReport(){
        return $this->data_report;
    }

    function Footer(){
        // Position at 1.5 cm from bottom
        $this->SetY(-10);
        $this->SetTextColor(100,100,100);
        // Arial italic 8
        $this->SetFont('Arial','I',8);

        $this->Cell(200,10,utf8_decode('Sistema de Controle Rebanho'),0,0,'L');
        // Page number
        $this->Cell(0,10,utf8_decode('Pág '.$this->PageNo().'/{nb}'),0,0,'R');
    }

    // Criacao da Grid
    public function DataGrid($border = 1){

        // armazena as larguras
        $this->columns = array();
        // inicializa atributos
        $this->styles = array();

        $this->colcounter = 0;

        $this->gridStartX = $this->GetX();
        $this->gridStartY = $this->GetY();

        $this->gridBorder = $border;
    }

     /** Adiciona um novo estilo
     * @param @stylename nome do estilo
     * @param @fontface  nome da fonte
     * @param @fontsize  tamanho da fonte
     * @param @fontstyle estilo da fonte (B=bold, I=italic)
     * @param @fontcolor cor da fonte
     * @param @fillcolor cor de preenchimento
     */
    public function addStyle($stylename, $fontface, $fontsize, $fontstyle, $fontcolor, $fillcolor)
    {
        $this->styles[$stylename] = array($fontface, $fontsize, $fontstyle, $fontcolor, $fillcolor);
    }

    /**
     * Aplica um estilo
     * @param $stylename nome do estilo
     */
    public function applyStyle($stylename)
    {
        // verifica se o estilo existe
        if (isset($this->styles[$stylename]))
        {
            $style = $this->styles[$stylename];
            // obtém os atributos do estilo
            $fontface    = $style[0];
            $fontsize    = $style[1];
            $fontstyle   = $style[2];
            $fontcolor   = $style[3];
            $fillcolor   = $style[4];

            // aplica os atributos do estilo
            $this->SetFont($fontface, $fontstyle); // fonte
            $this->SetFontSize($fontsize); // estilo
            $colorarray = self::rgb2int255($fontcolor);
            // cor do texto
            $this->SetTextColor($colorarray[0], $colorarray[1], $colorarray[2]);
            $colorarray = self::rgb2int255($fillcolor);
            // cor de preenchimento
            $this->SetFillColor($colorarray[0], $colorarray[1], $colorarray[2]);
        }
    }

    /**
     * Converte uma cor em RGB para um vetor de decimais
     * @param $rgb uma string contendo uma cor em RGB
     */
    private function rgb2int255($rgb)
    {
        $red   = hexdec(substr($rgb,1,2));
        $green = hexdec(substr($rgb,3,2));
        $blue  = hexdec(substr($rgb,5,2));

        return array($red, $green, $blue);
    }




    /**
     * Adiciona uma nova linha na tabela
     */
    public function gridAddRow()
    {
        $this->Ln(); // quebra de linha
        $this->colcounter = 0;
    }

    /**
     * Adiciona uma coluna ao relatório
     * @param $alias nome da coluna na consulta SQL
     * @param $label rótulo do campo (título da coluna)
     * @param $align alinhamento da coluna
     * @param $width tamanho da coluna
     * @param $format nome de uma funcao de formatacao a ser executada nas linhas
     */
    public function gridAddColumn($alias, $label, $align, $width, $format)
    {
        $this->columns[] = array('alias'=>$alias, 'label'=>utf8_decode($label), 'align'=>$align, 'width'=>$width, 'format'=>$format);

        $this->colWidths[] = $width;
    }


    /**
     * Adiciona uma nova célula na linha atual da tabela
     * @param $content   conteúdo da célula
     * @param $align     alinhamento da célula
     * @param $stylename nome do estilo a ser utilizado
     * @param $colspan   quantidade de células a serem mescladas
     * @param $border    borda da celula
     */
    public function gridAddCell($content, $align, $stylename = NULL, $colspan = 1, $border = 1, $round = false)
    {
        $this->applyStyle($stylename); // aplica o estilo
        $fontsize = $this->styles[$stylename][1]; // obtém a fonte

        // Alinhamento Horizontal
        $alignH = strtoupper(substr($align,0,1));

        // Largura
        $width = 0;
        // Altura
        $heigh = $fontsize * 0.5;

        // calcula a largura da célula (incluindo as mescladas)
        for ($n = $this->colcounter; $n < $this->colcounter + $colspan; $n++)
        {
            $width += $this->colWidths[$n];
        }


        // Borda Arredondada
        if ($round){

            $x = $this->GetX();
            $y = $this->GetY();
            $this->Cell( $width, $heigh, $content, 0, 0, $alignH, true);
            $this->RoundedRect($x,$y,$width,$heigh,0.8,'D');

        }
        else {
            $this->Cell( $width, $heigh, $content, $border, 0, $alignH, true);
        }

        $this->colcounter ++;
    }


    public function simpleGrid()
    {

        // verifica se foram definidas as colunas do relatório
        if (count($this->columns) == 0){
            throw new Exception('Colunas do relatório não definidas');
        }

        // adiciona uma linha para o cabeçalho (títulos das colunas)
        $this->gridAddRow();
        foreach ($this->columns as $column)
        {
            // adiciona as colunas de cabeçalho
            $this->gridAddCell($column['label'], $column['align'], 'gridTitle');
        }

        // Verificar se tem Dados para Grid
        if ($this->data_report){
            $rows = $this->data_report;
        }

        $colore = FALSE;
        // percorre os resultados
        foreach ($rows as $row){
 
            // define o estilo a ser utilizado
            $style = $colore ? 'rowI' : 'rowP';

            // adiciona uma linha para os dados
            $this->gridAddRow();

            // adiciona as colunas com os dados
            foreach ($this->columns as $column)
            {
                $alias   = $column['alias'];
                //var_dump($alias);
                if ($column['format']){
                    $function = $column['format'];
                    $value   = $row->$alias;
                    $content = self::$function($value);
                }
                else {
                    $content = $row->$alias;
                }

                $this->gridAddCell(utf8_decode($content), $column['align'], $style, 1);
            }

            // alterna variável de controle para cor de fundo
            $colore = !$colore;
        }
    }


    public function GridEnd(){

        $x = $this->gridStartX;
        $y = $this->gridStartY;

        $endX = $this->GetX();
        $endY = $this->GetY();

        if ($this->gridBorder){
            if ($this->gridRounded) {
                $this->RoundedRect($x,$y,$endX,$endY,0.8,'D');
            }
        }
    }

    /**
     *HdashedLine
     * Desenha uma linha horizontal tracejada com o FPDF
     *
     * @package NFePHP
     * @name HdashedLine
     * @version 1.0
     * @author Roberto L. Machado <roberto.machado@superig.com.br>
     * @param number $x Posição horizontal inicial, em mm
     * @param number $y Posição vertical inicial, em mm
     * @param number $w Comprimento da linha, em mm
     * @param number $h Espessura da linha, em mm
     * @param number $n Numero de traços na seção da linha com o comprimento $w
     * @return none
     */
    public function HdashedLine($x,$y,$w,$h,$n) {
        $this->SetLineWidth($h);
        $wDash=($w/$n)/2; // comprimento dos traços
        for( $i=$x; $i<=$x+$w; $i += $wDash+$wDash ) {
            for( $j=$i; $j<= ($i+$wDash); $j++ ) {
                if( $j <= ($x+$w-1) ) {
                    $this->Line($j,$y,$j+1,$y);
                }
            }
        }
    }



    /**
     *TextBox
     * Cria uma caixa de texto com ou sem bordas. Esta função perimite o alinhamento horizontal
     * ou vertical do texto dentro da caixa.
     * Atenção : Esta função é dependente de outras classes de FPDF
     *
     * Ex. $this->__textBox(2,20,34,8,'Texto',array('fonte'=>$this->fontePadrao,'size'=>10,'style='B'),'C','L',FALSE,'http://www.nfephp.org')
     *
     * @package NFePHP
     * @name TextBox
     * @version 1.0
     * @param number $x Posição horizontal da caixa, canto esquerdo superior
     * @param number $y Posição vertical da caixa, canto esquerdo superior
     * @param number $w Largura da caixa
     * @param number $h Altura da caixa
     * @param string $text Conteúdo da caixa
     * @param array $aFont Matriz com as informações para formatação do texto com fonte, tamanho e estilo
     * @param string $vAlign Alinhamento vertical do texto, T-topo C-centro B-base
     * @param string $hAlign Alinhamento horizontal do texto, L-esquerda, C-centro, R-direita
     * @param boolean $border TRUE ou 1 desenha a borda, FALSE ou 0 Sem borda
     * @param string $link Insere um hiperlink
     * @return none
     */
    public function TextBox($x,$y,$w,$h,$text='',$aFont=array('font'=>'Times','size'=>8,'style'=>''),$vAlign='T',$hAlign='L',$border=1,$link='',$force=TRUE,$hmax=0,$hini=0,$style='D'){
        $oldY = $y;
        $temObs = FALSE;
        $resetou = FALSE;
        //desenhar a borda
        if ( $border ) {
            $this->RoundedRect($x,$y,$w,$h,0.8,$style);
        }
        //estabelecer o fonte
        $this->SetFont($aFont['font'],$aFont['style'],$aFont['size']);
        //calcular o incremento
        $incY = $this->FontSize; //$aFont['size']/3;//$this->pdf->FontSize;
        if ( !$force ) {
            //verificar se o texto cabe no espaço
            $n = $this->WordWrap($text,$w);
        } else {
            $n = 1;
        }
        //calcular a altura do conjunto de texto
        $altText = $incY * $n;
        //separar o texto em linhas
        $lines = explode("\n", $text);
        //verificar o alinhamento vertical
        If ( $vAlign == 'T' ) {
            //alinhado ao topo
            $y1 = $y+$incY;
        }
        If ( $vAlign == 'C' ) {
            //alinhado ao centro
            $y1 = $y + $incY + (($h-$altText)/2);
        }
        If ( $vAlign == 'B' ) {
            //alinhado a base
            $y1 = ($y + $h)-0.5; //- ($altText/2);
        }
        //para cada linha
        foreach( $lines as $line ) {
            //verificar o comprimento da frase
            $texto = trim($line);
            $comp = $this->GetStringWidth($texto);
            if ( $force ) {
                $newSize = $aFont['size'];
                while ( $comp > $w ) {
                    //estabelecer novo fonte
                    $this->SetFont($aFont['font'],$aFont['style'],--$newSize);
                    $comp = $this->GetStringWidth($texto);
                }
            }
            //ajustar ao alinhamento horizontal
            if ( $hAlign == 'L' ) {
                $x1 = $x+1;
            }
            if ( $hAlign == 'C' ) {
                $x1 = $x + (($w - $comp)/2);
            }
            if ( $hAlign == 'R' ) {
                $x1 = $x + $w - ($comp+0.5);
            }

            //escrever o texto
            if ($hini >0){
               if ($y1 > ($oldY+$hini)){
                  if (!$resetou){
                     $y1 = $oldY;
                     $resetou = TRUE;
                  }
                  $this->Text($x1, $y1, $texto);
               }
            } else {
               $this->Text($x1, $y1, $texto);
            }
            //incrementar para escrever o proximo
            $y1 += $incY;

            if (($hmax > 0) && ($y1 > ($y+($hmax-1)))){
               $temObs = TRUE;
               break;
            }

        }
        return ($y1-$y)-$incY;
    } // fim função TextBox


    public function dateBr($data){
        if ($data){
            $aData = explode('-',$data);
            $yy = $aData[0];
            $mm = $aData[1];
            $dd = $aData[2];

            $y =  substr($yy, -2);
            $data_nova = "$dd/$mm/$y";
            return $data_nova;
        }
    }

}