Ext.define('Rebanho.controller.EntradaAnimais', {
    extend: 'Ext.app.Controller',

    require:[
//         'Ext.util.Format',
    ],

    stores: [
        'EntradaAnimais',
        'Pesagens',
    ],

    models: [
        'Rebanho.model.CompraAnimal',
        'Rebanho.model.Pesagem',
    ],

    views: [
        'compras.animais.EntradaAnimaisPanel',
        'compras.animais.EntradaAnimaisGrid',
        'compras.animais.EntradaAnimaisWindow',
        'compras.animais.EntradaAnimaisForm',
    ],

    refs: [
        {
            ref: 'entradaAnimaisPanel',
            selector: 'entradaanimaispanel'
        },
        {
            ref: 'entradaAnimaisGrid',
            selector: 'entradaanimaisgrid'
        },
        {
            ref: 'entradaAnimaisWindow',
            selector: 'entradaanimaiswindow'
        },

    ],


    // Chave Primaria da Nota Aberta em Edicao
    idNotaAberta: 0,
    // Codigo da Primeira Identificacao
    identificacao: '',
    // Quantidade Total de Animais na Nota
    quantidade_total: 0,
    // Quantidade de Animais Pesados
    quantidade_pesada: 0,
    // Quantidade de Animais a Serem Pesados
    quantidade_falta: 'false',

    init: function() {

        this.control({

            // ----------< Actions do Grid >----------

            'entradaanimaispanel': {
                // Ao Renderizar o Panel
                render: this.onRenderPanel
            },

            // Ao Clicar no Pesar
            'entradaanimaisgrid button[action=action_pesar]': {
                click: this.digitarCodigo
            },

            // Ao Clicar em Finalizar
            'entradaanimaisgrid button[action=action_finalizar]': {
                click: this.finalizarPesagem
            },

        });
    },


    //
    /** Funcao: onRenderPanel
     * Funcao executada quando o painel for renderizado
     * vai criar uma janela para Selecao da Nota de Etrada
     */
    onRenderPanel: function (){

        // Criar a Janela de Selecao de Nota
        this.windowSelecaoNota();

        // Mostra a Janela de Selecao de Nota
        this.winSelecaoNota.show();

    },


    // ----------< Funcoes da Window de Selecao >----------
    /** Funcao: windowSelecaoNota
     * Cria a Janela de Selecao,
     * adiciona os listeners
     * close, selectNota
     */
    windowSelecaoNota: function() {

        // Verifica se Existe uma Janela
        if (this.winSelecaoNota){
            //Se existir destroy
            this.winSelecaoNota = null;
        }

        // Cria a Janela
        this.winSelecaoNota = Ext.create('Rebanho.view.compras.animais.EntradaAnimaisWindow',{
            listeners:{
                scope  : this
                , close: this.onWindowSelecaoNotaClose
                , selecionou_nota_entrada: function (window, values){
                    // Setando o Chave Primaria da Nota
                    this.idNotaAberta = values.notaaberta;
                    // Setando o Status da Nota
                    this.statusNota = values.status;

                    // Fechando a Janela
                    window.close();
                }
            }
        });
    },

    /** Funcao: onWindowSelecaoNotaClose
     * Executada ao se Fechar a Janela de Selecao
     * fecha a Tab toda.
     */
    onWindowSelecaoNotaClose: function(window, controller){

        // Verifica se tem uma Nota Selecionada
        // obs: se a nota estiver com status "Aguardando Pesagem" Nao mostra a janela
        if (this.idNotaAberta != 0){

            if  (this.statusNota == 4) {
                controller.scope.inicioEntradaAnimais(controller.scope.idNotaAberta);
            }
            else {
                // Se tiver Pedir o Numero Inicial dos Codigos

                Ext.Msg.prompt('Identificação', 'Digite o numero da 1º Identificação:', function(btn, text){
                    if (btn == 'ok'){

                        // Verifica se tem Identificacao
                        if (text != ''){
                            // Seta o Atributo Identificacao
                            controller.scope.identificacao = text;
                            // Executa a Funcao Responsavel por criar os registros
                            controller.scope.inicioEntradaAnimais(controller.scope.idNotaAberta, controller.scope.identificacao);
                        }
                        else {
                            // Se nao tiver abre novamente a janela
                            controller.scope.onWindowSelecaoNotaClose(window, controller);
                        }
                    }
                    else {
                        // abre novamente a janela
                        controller.scope.onWindowSelecaoNotaClose(window, controller);
                    }
                });
            }
        }
        else {
            // Se Nao Tiver Fecha o Painel Todo
            Ext.getCmp('mainTabpanel').fecharAbaAtiva();
        }
    },

    /** Funcao: inicioEntradaAnimais
     * Executada apos a selecao da nota e entrada do primeiro codigo
     * Vai executar o metodo da classe EntradaAnimais responsavel
     * por criar os registros de animais e alterar o status da nota pra 'Aguardando Pesagem',
     * depois de criados carrega a grid.
     */
    inicioEntradaAnimais: function(idNotaAberta, identificacao){

        Ext.Ajax.request({
            url : 'php/main.php',
            method : 'POST',
            params: {
                classe: 'NotasEntrada',
                action: 'inicioEntradaAnimais',
                nota_aberta: idNotaAberta,
                identificacao: identificacao,
            },
            scope:this,
            success: function ( result, request ) {
                var retorno = Ext.decode(result.responseText);
                if (retorno.success){

                    // Inicio de Pesagem
                    this.inicioPesagem();
                }
                else {
                    // Mostrando Mensagem de Erro
                    Ext.MessageBox.show({ title:'Desculpe!', msg: retorno.message, buttons: Ext. MessageBox.OK, icon:  Ext.MessageBox.ERROR })
                }
            },
            failure: function ( result, request) {
                Ext.MessageBox.show({ title:'Desculpe!', msg: 'Falha ao Criar os Registros', buttons: Ext. MessageBox.OK, icon:  Ext.MessageBox.ERROR })
            }
        });
    },


    /** Funcao: inicioPesagem
     * Executada apos a funcao inicioEntradaAnimais 
     * depois dos animais criados, ocorrencias e etc,
     * vai carregar os animais criados no grid
     * Faz um request na classe NotasEntrada
     * e recupera os contadores de quantidade e peso
     * atualiza os atributos de quantidade
     * Verifica se falta pesar algum animal
     * se faltar executa a funcao digitarCodigo
     * se todos estiverem pesados mostra mensagem e habilita botao finalizarNota
     * depois executa a funcao setContadores
     */
    inicioPesagem: function(){

        // Recuperando a Store
        store = this.getStore('EntradaAnimais');

        // Limpando a Store
        store.removeAll();
        store.load();

        // Limpando o Filtro
        store.clearFilter(true);
        // Adicionando novo Filtro pra Pegar todos os animais dessa nota
        store.filter("compra_id", this.idNotaAberta);


        Ext.Ajax.request({
            url : 'php/main.php',
            method : 'POST',
            params: {
                classe: 'NotasEntrada',
                action: 'getContadores',
                nota_aberta: this.idNotaAberta,
            },
            scope:this,
            success: function ( result, request ) {
                var retorno = Ext.decode(result.responseText);
                if (retorno.success){

                    // Alterando os Atributos de quantidade
                    this.quantidade_total  = retorno.quantidade;
                    this.quantidade_pesada = retorno.pesados;
                    this.quantidade_falta  = retorno.falta;

                    // Executando a funcao setContadores
                    this.setContadores(retorno);

                    // Verifica se Todos Foram Pesados
                    if ((this.quantidade_total == this.quantidade_pesada) && (this.quantidade_falta ==0)){

                        // Se a Pesagem estiver Completa
                        Ext.Msg.show({
                            title:'Pesagem Completa',
                            msg: 'Pesagem Completa Confira os Dados e Click no Botão Finalizar Pesagem!',
                            buttons: Ext.Msg.OK,
                        });

                        // Habilitar o Botao Finalizar Pesagem
                        this.getEntradaAnimaisGrid().down('#btnFinalizar').enable();
                    }
                    else {
                        // Se ainda houver animais a serem Pesados
                        this.digitarCodigo();
                    }
                }
                else {
                    // Mostrando Mensagem de Erro
                    Ext.MessageBox.show({ title:'Desculpe!', msg: retorno.message, buttons: Ext. MessageBox.OK, icon:  Ext.MessageBox.ERROR })
                }
            },
        })

    },


    /** Funcao: digitarCodigo
     * Executada quando se digita um codigo na Janela Prompt de Codigo
     * vai buscar pelo codigo na store
     * se achar vai marcar a linha da grid,
     * e chamar a Funcao digitarPeso para o campo de peso
     */
     digitarCodigo: function(codigo){

        // Mostrar o Prompt para informar o Codigo
        Ext.Msg.show({
            title:'Código do Animal',
            msg: 'Entre com o Código do Animal',
            buttons: Ext.Msg.OKCANCEL,
            icon: 'icon-barcode-32',
            minWidth: 250,
            width: 300,
            scope: this,
            prompt: true,
            callback: function(btn, codigo){
                if (btn == 'ok'){
                    // Verifica se tem Identificacao
                    if (codigo != ''){
                        // Procurar na Store
                        var store = this.getEntradaAnimaisGrid().getStore();

                        animal = store.findRecord('codigo',codigo);

                        if (animal){
                            // Se encontrar um Animal Passa para o Prompt de Peso
                            this.digitarPeso(animal, codigo);
                        }
                        else {
                            // Se nao Encontrar um Animal Mostra Alerta e Volta a Exibir o Prompt
                            Ext.BoxMsg.msg('Atenção!', 'Nenhum Animal Encontrado!');
                            this.digitarCodigo();
                        }
                    }
                }
            }
        });
    },


    /** Funcao: digitarPeso
     * Executada apos digitar um codigo na Janela Prompt de Codigo
     * Mostra um Prompt para a Entrada do Peso do animal
     * @param:{object} animal = recebe um record animal
     * @param:{string} codigo = codigo do animal
     */
     digitarPeso: function(animal, codigo){

        // Mostrar o Prompt para informar o Codigo
        Ext.Msg.show({
            title:'Peso do Animal',
            msg: 'Entre com o Peso do Animal',
            buttons: Ext.Msg.OKCANCEL,
            icon: 'icon-scale-32',
            minWidth: 250,
            width: 300,
            scope: this,
            prompt: true,
            callback: function(btn, peso){
                if (btn == 'ok'){
                    // Verifica se tem Identificacao
                    if (peso != ''){
                        this.gravarPesagem(animal,codigo,peso);
                    }
                }
            }
        });
    },

    /** Funcao: gravarPesagem
     * Grava o Peso de um animal, cria um record com o model pesagem, depois adiciona pela
     * store depois volta para a funcao inicioPesagem
     * @param:{object} animal = record animal recuperado da store
     * @param:{string} codigo = codigo digitado no prompt codigo
     * @param:{float}  peso   = peso digitado no prompt peso
     */
    gravarPesagem: function(animal, codigo, peso){

        // Criando o Registro
        var pesagem = Ext.create('Rebanho.model.Pesagem', {
            confinamento_id : animal.data.confinamento_id,
            quadra_id  : animal.data.quadra_id,
            animal_id  : animal.data.id,
            data : Ext.Date.dateFormat(new Date(),'Y-m-d'),
            peso: peso,
            tipo: 1,
        });

        // Recuperar a Store e adicionar o Registro
        var store_pesagem = this.getStore('Pesagens');

        errors = pesagem.validate();

        if (errors.isValid()){
            store_pesagem.add(pesagem);
        }
        else {
            console.log(errors.items);
        }

        this.inicioPesagem();

    },

    /** Funcao: setContadores
     * Recebe um objeto com os valores de quantidade e peso
     * e atualiza os toolbarText com os valores
     * @param:{object} contadores - objeto com os contadores
     */
    setContadores: function(contadores){

        var grid = this.getEntradaAnimaisGrid();
        grid.down('#tbquantidade').setText('<b>Quantidade: <font color="blue"> '+contadores.quantidade+' </font></b>');
        
        grid.down('#tbpesados').setText('<b>Pesados: <font color="green">'+contadores.pesados+'</font></b>');
        
        grid.down('#tbfalta').setText('<b>Faltam: <font color="red">'+contadores.falta+'</font></b>');
        
        grid.down('#tbpesototal').setText('<b>Peso Total: <font color="blue">'+contadores.peso_total+' Kg</font></b>');
        
        grid.down('#tbpesomedio').setText('<b>Peso Médio: <font color="blue">'+contadores.peso_medio+' Kg</font></b>');

    },


    /** Funcao: finalizarPesagem
     * Confirma se vai realmente fechar
     * em caso afirmativo executa a funcao finalizarNota
     */
    finalizarPesagem: function (){

        // Confirmar Finalizar
        Ext.MessageBox.confirm('Confirmação', 'Deseja Mesmo <font color="blue"><b>Finalizar a Pesagem</b></font>?<br>Atenção: Ao Finalizar a pesagem não podera ser feita mais alterações.', function(btn){

            if (btn == 'yes'){
                this.finalizarNota();
            }
        },this);

    },

    finalizarNota: function(){

        Ext.Ajax.request({
            url : 'php/main.php',
            method : 'POST',
            params: {
                classe: 'NotasEntrada',
                action: 'FinalizarNota',
                nota_aberta: this.idNotaAberta,
            },
            scope:this,
            success: function ( result, request ) {
                var retorno = Ext.decode(result.responseText);
                if (retorno.success){

                    Ext.BoxMsg.msg('Sucesso!', 'Compra de Animais Finalizada Com sucesso!');

                    // Fechando o Aba
                    Ext.getCmp('mainTabpanel').fecharAbaAtiva();
                }
                else {
                    // Mostrando Mensagem de Erro
                    Ext.MessageBox.show({ title:'Desculpe!', msg: retorno.message, buttons: Ext. MessageBox.OK, icon:  Ext.MessageBox.ERROR })
                }
            },
        })
    }

});

