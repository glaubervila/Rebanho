<?php
header('Content-Type: text/javascript; charset=UTF-8');
/** @Class: NotasEntrada
 * Classe Reposavel por disponibilizar os  metodos
 * refente a uma nota fiscal de entrada,
 * Usa as Classes de CompraAnimais e Entrada de Animais
 */

class NotasEntrada extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "";


    /** Metodo: getNotasAbertas
     * Retorna uma lista das Notas de Compras
     * que estao com o status = 1 ou 4
     */
    public function getNotasAbertas($data){
        $result = new StdClass();

        // Recerando o Confinamento
        $confinamento_id = $data['confinamento'];

        // Se o Confinamento for 0 Traz todas
        if ($confinamento_id == 0) {
            $rows = $this->getAt(null, 'status IN(1,4)', 'compras');
        }
        else {
            // Se houver Confinamento traz so as notas do confinamento
            $rows = $this->getAt(null, "status IN(1,4) AND confinamento_id = {$confinamento_id}", 'compras');
        }


        if ($rows){

            foreach ($rows as $row){
                $record = $row;
                // Para Cada Registro Recuperar o Nome do Fornecedor e a Fazenda
                $fornecedor = $this->find($record->fornecedor_id, 'fornecedores');
                $record->fornecedor_nome    = $fornecedor->nome;
                $record->fornecedor_fazenda = $fornecedor->fazenda;

                $records[] = $record;
            }

            $result->success = true;
            $result->data = $records;
        }
        else {
            $result->success = false;
            $result->msg = "Não Há Compras Aguardando Pesagem.";
        }
        echo json_encode($result);
    }


    /** Metodo: inicioEntradaAnimais
     */
    public function inicioEntradaAnimais ($data) {

        // Recuperando os Paramentros
        $notaAberta    = $data['nota_aberta'];
        $identificacao = $data['identificacao'];
        $data_pesagem  = $data['data_pesagem'];

        // Recuperar a Nota
        $objNota = $this->findBy('id', $notaAberta, 'compras');

        $result = new StdClass();

        // Verificar o Status
        if ($objNota->status == 1) {
            // Se o Status For 1 - Aberta Cria os Novos Animais e altera o status para Aguardando Pesagem

            // Parametros
            $inicio = $identificacao;
            $final  = $identificacao + $objNota->quantidade;
            $qtd_machos = $objNota->qtd_machos;
            $qtd_femeas = $objNota->qtd_femeas;

            // Para Cada Animal na Nota, Criar uma Identificacao Usando a primeira,
            // Separar o Sexo dos animais pelo quantidade de machos e femeas
            $sexo = 0;

            for ($k = $identificacao; $k < $final; $k++){

                // Criando Uma Identificacao
                $identificacao = new StdClass();
                $identificacao->confinamento_id = $objNota->confinamento_id;
                $identificacao->codigo          = $k;
                $identificacao->data            = $data_pesagem;

                // Criando Um Animal
                $animal = new StdClass();
                $animal->confinamento_id    = $objNota->confinamento_id;
                $animal->quadra_id          = $objNota->quadra_id;
                $animal->compra_id          = $objNota->id;
                $animal->fornecedor_id      = $objNota->fornecedor_id;
                $animal->caracteristica_id  = $objNota->caracteristica_id;
                $animal->classificacao      = $objNota->classificacao;
                $animal->escore             = $objNota->escore;
                $animal->idade              = $objNota->idade;
                $animal->codigos            = array($identificacao);

                // Separando Sexos
                if ($sexo < $qtd_machos){
                    $animal->sexo = 'M';
                }
                else {
                    $animal->sexo = 'F';
                }

                $sexo++;

                $animais[] = $animal;

            }

            // Executa o Metodo CadastroAnimais da Classe Animais
            $result = Animais::CadastroAnimais($animais);

            if ($result->success){
                // Se incluiu todos os animais alterar a Compra o status para Aguardando Pesagem
                // e a Data de Entrada

                $db = $this->getDb();

                $query = 'UPDATE compras set status = :status, data_pesagem = :data_pesagem where id=:id';

                $stm = $db->prepare($query);

                $stm->bindValue(':id', $objNota->id);
                $stm->bindValue(':status', 4);
                $stm->bindValue(':data_pesagem', $data_pesagem);


                $update = $stm->execute();

                if ($update) {
                    // Todos os Animais Criados e
                    // Compra Alterada com Sucesso
                    $result->success = true;
                }
                else {
                    // Falha ao Alterar o Status da Compra
                    $error = $stm->errorInfo();
                    $this->ReturnJsonError($error);
                }
            }
            else {
                $this->ReturnJsonError($result->error);
            }
        }
        elseif (($objNota->status == 2) OR ($objNota->status == 3)) {
            // Se Estiver Cancelada ou Fechada
            // Nao Permitir Edicao
            echo "Nota Fechada ou Cancelada";
        }
        elseif ($objNota->status == 4){
            // Se estiver Aguardando Pesagem Só Permitir Pesar
            $result->success = true;
        }

        echo json_encode($result);
    }

    /** Methodo:getAnimaisNota($data)
     * Recupera os dados da nota, e faz uma busca por todos os animais desta nota
     * Se for uma Chamada via Request o
     * @param:$data (array) vindo do main php com os dados de filtros
     * Se for uma Chamada interna
     * @param:$data (int) Chave da Nota que se quer buscar os animais
     * @param:$json (bool) Liga ou desligo Json, tem mais prioridade que o returnJson do Request
     */
    public function getAnimaisNota($data, $json = true, $compra_id = null){

        // Tratamento do Retorno
        if ($json == false){
            $data["returnJson"] = false;
        }

        // Recuperando os Paramentros
        // Se for uma Request usa o Filter
        $filtros = json_decode($data['filter']);
        $nota_aberta = $filtros[0]->value;

        // Se for uma chamada interna passa o id por aki
        if ($compra_id){
            $nota_aberta = $compra_id;
        }

        // Recuperando o ObjNota
        $objNota = $this->find($nota_aberta, 'compras');

        $animais = $this->findAllBy('compra_id', $nota_aberta, 'animais');

        // Para Cada Animal Recuperar os codigos
        foreach ($animais as $animal){

            $registro = $animal;

            // Recuperando o Codigo para o Confinamento
            $codigo = Animais::getCodigosById($animal->id, $animal->confinamento_id);
            $registro->codigo = $codigo[0]->codigo;

            // Recuperando o Peso de Entrada
            $peso_entrada = Pesagens::getPesagemEntrada($animal->id, $objNota->confinamento_id);
            $registro->peso_entrada = $peso_entrada->peso;

            // Recuperando o Peso de Compra
            $peso_entrada = Pesagens::getPesagemCompra($animal->id, $objNota->confinamento_id);
            $registro->peso_compra = $peso_entrada->peso;

            // Informacoes da Quadra
            $quadra = $this->find($animal->quadra_id, 'quadras', 'quadra');
            $registro->quadra = $quadra->quadra;

            $registros[] = $registro;

        }

        $result = new StdClass();

        if ($registros) {
            $result->success = true;
            $result->data = $registros;
        }
        else {
            $result->success = false;
        }

        if ($data["returnJson"]) {
            echo json_encode($result);
        }
        else {
            return $result;
        }

    }

    public function getContadores($data,$json = true){

        $nota_aberta = $data['nota_aberta'];

        // Recuperando os Contadores
        $result = Pesagens::getCntPesados($data);

        if ($result){
            $quantidade = $this->getAt('quantidade',"id = $nota_aberta", 'compras');
            $quantidade = $quantidade[0]->quantidade;
            $pesados = $result->pesados;
            $peso_total = $result->peso_total;

            // Calculando Peso Medio - Usando a quantidade de animais pesados
            $media = ($peso_total/$pesados);

            $result->quantidade = $quantidade;
            $result->falta = ($quantidade - $pesados);
            $result->peso_medio = number_format($media, 3, '.','.');
            $result->success =  true;
        }
        else {
            $result = new StdClass();
            $result->failure = false;
            $result->msg = "Falha ao Recuperar os Contadores";
        }

        if ($json) {
            echo json_encode($result);
        }
        else {
            return $result;
        }

    }


    /** Methodo: finalizarNota
     * Executados quando todos os animais da nota
     * ja foram pesados, altera o status da nota para
     * 2 - Finalizado, nesse status a nota nao pode mais ser alterada
     */
    public function finalizarNota ($data){

        // Recuperar o Peso Total
        $cnt = NotasEntrada::getContadores($data, false);

        $result = CompraAnimais::finalizaCompra($data, $cnt->peso_total);

        // Se tiver incluido a compra sem erros
        if ($result->success == true){
            // Executar o Metodo Pessagem::criarPesagemCompra
            $result = Pesagens::criarPesagemCompra($data["nota_aberta"],$data["data_pesagem"]);
            if ($result->success == true){
                // Executar Metodo para trocar o Status da Compra para Fechado
                $result = CompraAnimais::updateStatus($data["nota_aberta"], 2);
            }
        }

        echo json_encode($result);
    }


    /** Metodo: updateSexo
     * Executado quando na grid de Entrada de animais
     * quando se usa o CellEditing no evento 'edit'
     * Recebe um array com todos os dados do registro
     * Altera o Sexo do Animal executa o metodo resposavel pelo update
     * @param:$data - array com os parametros do request
     */
    public function updateSexo($data, $json = true){

        $animal = $this->find($data->id, 'animais');

        $animal_id = $data->id;

        $compra_id = $animal->compra_id;

        $sexo = $data->sexo;

        $result = Animais::updateCampoAnimal($animal_id, 'sexo', $sexo);

        // recalcular a Quantidade de Machos e Femeas da Compra
        if ($result->success){

            $animais = $this->findAllBy('compra_id', $compra_id, 'animais');
            foreach ($animais as $animal){
                if ($animal->sexo == 'F'){
                    $femeas++;
                }
                else {
                    $machos++;
                }
            }

            // Fazer Updates na Compra com as quantidades de animais
            $this->updateCampo($compra_id,'qtd_machos',$machos,'compras');
            $this->updateCampo($compra_id,'qtd_femeas',$femeas,'compras');

        }

        if ($json) {
            echo json_encode($result);
        }
        else {
            return $result;
        }

    }

    public function updateQuadra($data, $json = true){

        $animal_id = $data->id;
        $quadra_id = $data->quadra_id;

        $result = Manejos::manejoQuadras($data, $animal_id, $quadra_id, false);

        if ($json) {
            echo json_encode($result);
        }
        else {
            return $result;
        }
    }

    public function pesagemEntrada($data, $json = true){

        $result = Pesagens::criarPesagemEntrada($data, false);

        if ($json) {
            echo json_encode($result);
        }
        else {
            return $result;
        }
    }


    public function updateCodigo($data, $json = true){

        $codigo = Animais::alterarCodigo($data,false);

        return $codigo;
    }

    public function load($data){

        $this->getAnimaisNota($data, true);
    }

    public function update($data) {

        //Formantando a Data
        $data->data_entrada = $this->DateToMysql($data->data_entrada);

        // Alterar o Codigo do animal
        if ($data->codigo){
            $result_codigo = $this->updateCodigo($data, false);
            if (!$result_codigo->success) {
                $result = $result_codigo;
            }
        }

        // Se for Alteracao de Peso
        if ($data->peso_entrada){
            // Criar a Pesagem de Entrada
            $result_pesagem = $this->pesagemEntrada($data, false);
            if (!$result_pesagem->success) {
                $result = $result_pesagem;
            }
        }

        // Alterar o Sexo do animal
        if ($data->sexo){
            $result_sexo = $this->updateSexo($data, false);
            if (!$result_sexo->success) {
                $result = $result_sexo;
            }
        }

        // Criar o Manejo
        if ($data->quadra_id) {
            $result_manejo = $this->updateQuadra($data, false);
            if (!$result_manejo->success) {
                $result = $result_manejo;
            }
        }

        if ($result){
            return $result;
        }
    }


    public function save($data) {

        $results = new StdClass();
        if (is_array($data)){
            foreach ($data as $registro){
                $registro = $this->decode_utf8($registro);
                if ($registro->id > 0){
                    $erros = $this->update($registro);
                    if ($erros){
                        $results->erros[] = $erros;
                        $msgs[] = $erros->msg;
                    }
                }
            }
        }

        if ($results->erros){
            $results->failure = true;
            $results->msg = implode('<br>',$msgs);
        }
        else {
            $results->success = true;
            $results->msg = "Todos os registros foram salvos.";
        }

        echo json_encode($results);
    }


}


