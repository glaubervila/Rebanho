Ext.define('Rebanho.controller.EntradaAnimais', {
    extend: 'Ext.app.Controller',

    require:[
//         'Ext.util.Format',
    ],

    stores: [
        'EntradaAnimais',
        'Pesagens',
        'Quadras',
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
    // Chave estrangeira Confinamento
    confinamento: 0,
    // Data da Pesagem
    data_pesagem: 0,
    // delay do auto save
    time_to_autosave: 60,
    // segundos ate o auto save
    second_to_save: 60,


    init: function() {

        // ----------< Actions no Store >----------
        // Load da Store
        //this.getStore('Pesagens').addListener('load', this.onLoadStore, this);

        this.control({

            // ----------< Actions do Grid >----------

            'entradaanimaispanel': {
                // Ao Renderizar o Panel
                render: this.onRenderPanel,
            },

            // Ao Clicar no Pesar
            'entradaanimaisgrid button[action=action_salvar]': {
                click: this.gravarPesagem,
            },

            // Ao Clicar em Finalizar
            'entradaanimaisgrid button[action=action_finalizar]': {
                click: this.finalizarPesagem
            },

            // Actions da Grid 
            'entradaanimaisgrid': {
                // DoubleClick em uma linha da Grid
                itemdblclick: this.onRowDblClick,
            },

        });
    },

    // Start a simple clock task that updates a div once per second
    updateClock: function () {
        this.second_to_save = this.second_to_save - 1;

        this.getEntradaAnimaisGrid().down('#tbautosave').setText('<font color="gray">Auto Save em '+this.second_to_save+ ' segundos</font>');

        if (this.second_to_save == 0){
            this.gravarPesagem();
        }
    },

    // Startando o Auto Save
    autoSave: function (){
        this.runner = new Ext.util.TaskRunner();
        this.task = this.runner.start({
            run: this.updateClock,
            interval: 1000,
            scope: this,
        });
    },
    /** Funcao: onRenderPanel
     * Funcao executada quando o painel for renderizado
     * vai criar uma janela para Selecao da Nota de Etrada
     */
    onRenderPanel: function (){
        console.log('EntradaAnimais - onRenderPanel');

        // Setando o Atributo Confinamento
        this.confinamento = Ext.getCmp('main_viewport').getConfinamentoId();

        if (this.confinamento != 0){
            // Carregando a Store de Quadras
            this.getStore('Quadras').filter("confinamento_id", this.confinamento);
        }
        
        // Setando a Data da Pesagem
        if (this.data_pesagem == 0){
            this.data_pesagem = Ext.Date.dateFormat(new Date(),'Y-m-d');
        }

        grid = this.getEntradaAnimaisGrid();

        // Adicionando Listenner ao Grid para receber os eventos do Plugin CellEditing
        grid.on({
            scope: this,
            beforeedit: this.onBeforeEditCell,
            edit: this.onEditRowCell,
            canceledit: this.onEditRowCell,
        });

        // Limpando a Store
        // Recuperar a Store
        var store = this.getStore('EntradaAnimais');
        store.removeAll();

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
        console.log('EntradaAnimais - windowSelecaoNota');
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
                    // Setando a Data de Entrada
                    this.data_pesagem = values.data_entrada;
                    // Setando o Status da Nota
                    this.statusNota = values.status;

                    this.confinamento_id = values.confinamento_id;

                    // Carregando a Store de Quadras
                    this.getStore('Quadras').filter("confinamento_id", this.confinamento_id);

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
        console.log('EntradaAnimais - onWindowSelecaoNotaClose');
        // Verifica se tem uma Nota Selecionada
        // obs: se a nota estiver com status "Aguardando Pesagem" Nao mostra a janela
        if (this.idNotaAberta != 0){

            if  (this.statusNota == 4) {
                this.inicioEntradaAnimais(controller.scope.idNotaAberta);
            }
            else {
                // Se tiver Pedir o Numero Inicial dos Codigos

                Ext.Msg.prompt('Identificação', 'Digite o numero da 1º Identificação:', function(btn, text){
                    if (btn == 'ok'){

                        // Verifica se tem Identificacao
                        if (text != ''){
                            // Seta o Atributo Identificacao
                            //controller.scope.identificacao = text;
                            this.identificacao = text;
                            // Executa a Funcao Responsavel por criar os registros
                            //controller.scope.inicioEntradaAnimais(controller.scope.idNotaAberta, controller.scope.identificacao);
                            this.inicioEntradaAnimais(this.idNotaAberta, this.identificacao);
                        }
                        else {
                            // Se nao tiver abre novamente a janela
                            this.onWindowSelecaoNotaClose(window, controller);
                        }
                    }
                    else {
                        // abre novamente a janela
                        this.onWindowSelecaoNotaClose(window, controller);
                    }
                },this);
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
        console.log('EntradaAnimais - inicioEntradaAnimais');

        // Recuperando a Store
        store = this.getStore('EntradaAnimais');

        // Setando a Action para o Load
        //store.proxy.setExtraParam('action','getAnimaisNota');

        // Limpando o Filtro
        store.removeAll();
        store.clearFilter(true);
        // Adicionando novo Filtro pra Pegar todos os animais dessa nota
        store.filter("compra_id", this.idNotaAberta);

        Ext.Ajax.request({
            url : 'php/main.php',
            method : 'POST',
            params: {
                classe: 'NotasEntrada',
                action: 'inicioEntradaAnimais',
                nota_aberta: idNotaAberta,
                identificacao: identificacao,
                data_pesagem: this.data_pesagem,
            },
            scope:this,
            success: function ( result, request ) {
                var retorno = Ext.decode(result.responseText);
                if (retorno.success){
                    // Inicia os Contadores
                    this.getContadores();
                    // Inicia Funcao de Auto Save
                    this.autoSave();
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

    /** Funcao: digitarCodigo
     * Executada quando se digita um codigo na Janela Prompt de Codigo
     * vai buscar pelo codigo na store
     * se achar vai marcar a linha da grid,
     * e chamar a Funcao digitarPeso para o campo de peso
     */
     digitarCodigo: function(codigo){
        console.log('EntradaAnimais - digitarCodigo');
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
                            Ext.ux.Alert.alert('Atenção!', 'Nenhum Animal Encontrado!', 'warning');
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
     * @param:{bool} looping = se looping for true repete a digitacao do peso
     */
     digitarPeso: function(animal, codigo, looping){
        console.log('EntradaAnimais - digitarPeso');
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
                        if (peso > 0) {
                            this.gravarPesagem(animal,codigo,peso,looping);
                        }
                        else {
                            // Peso Negativo Digitar de Novo
                            Ext.ux.Alert.alert('Atenção!', 'Peso Deve ser Valor Positivo!','warning');
                            this.digitarPeso(animal,codigo);
                        }
                    }
                }
            }
        });
    },

    /** Funcao: gravarPesagem
     * Grava todas as alteraçoes na Grid de entrada de animais
     * executa o metodo sync da store EntradaAnimais
     */
    gravarPesagem: function(){
        console.log('EntradaAnimais - gravarPesagem');

        // Recuperar a Store
        var store = this.getStore('EntradaAnimais');
        store.sync();
        store.load();
        this.getContadores();
        this.second_to_save = this.time_to_autosave;
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
                data_pesagem : this.data_pesagem,
            },
            scope:this,
            success: function ( result, request ) {
                var retorno = Ext.decode(result.responseText);
                if (retorno.success){

                    Ext.ux.Alert.alert('Sucesso!', 'Compra de Animais Finalizada Com sucesso!','success');

                    // Recarregando a Store de Compras
                    this.getStore('CompraAnimais').load();
                    
                    // Fechando o Aba
                    Ext.getCmp('mainTabpanel').fecharAbaAtiva();

                }
                else {
                    // Mostrando Mensagem de Erro
                    Ext.MessageBox.show({ title:'Desculpe!', msg: retorno.message, buttons: Ext. MessageBox.OK, icon:  Ext.MessageBox.ERROR })
                }
            },
        })
    },

    onRowDblClick: function(){
        console.log('EntradaAnimais - onRowDblClick');
        var records = this.getEntradaAnimaisGrid().getSelectionModel().getSelection();
        var animal = records[0];
        //this.digitarPeso(animal, animal.data.codigo, false);
    },

    onBeforeEditCell: function(editor, e, object){
        // Recupera a Store para alterar o Action
        store = e.grid.getStore('EntradaAnimais');
        // Adiciona a Data de Entrada ao Registro
        e.record.set('data_entrada', this.data_pesagem);

    },

    onEditRowCell: function(editor, e, object){
        // Recupera a Store para alterar o Action
        store = e.grid.getStore('EntradaAnimais');
        // Zera o BaseParans
        store.proxy.setExtraParam('action','');

        this.getContadores();
    },

    onCancelEditCell: function(editor, e, object){
        // Recupera a Store para alterar o Action
        store = e.grid.getStore('EntradaAnimais');
    },

    getContadores: function(){
        console.log('EntradaAnimais - getContadores');
        // Recuperando a Store
        var store = this.getStore('EntradaAnimais');

        // Quantidade Total
        this.quantidade_total = store.count();
        // Quantidade Pesada
        this.quantidade_pesada = 0;
        store.each(function(record){
            if (record.data.peso_entrada > 0){
                this.quantidade_pesada = this.quantidade_pesada + 1;
            };
        }, this);
        // Quantidade que Falta
        this.quantidade_falta = this.quantidade_total - this.quantidade_pesada;

        // Peso Total
        this.peso_total = store.sum('peso_entrada');
        // Peso Medio
        this.peso_medio = Ext.util.Format.round((this.peso_total/this.quantidade_total), 3);

        // Atualizando os Contadores
        this.setContadores();

        // Verifica se Todos Ja Foram Pesados
        if ((this.quantidade_total == this.quantidade_pesada) && (this.quantidade_falta == 0) && this.quantidade_pesada > 0){

            // Se a Pesagem estiver Completa
            Ext.Msg.show({
                title:'Pesagem Completa',
                msg: 'Pesagem Completa Confira os Dados e Click no Botão Finalizar Pesagem!',
                buttons: Ext.Msg.OK,
            });

            // Habilitar o Botao Finalizar Pesagem
            this.getEntradaAnimaisGrid().down('#btnFinalizar').enable();
        }


    },

    /** Funcao: setContadores
     * Recebe um objeto com os valores de quantidade e peso
     * e atualiza os toolbarText com os valores
     * @param:{object} contadores - objeto com os contadores
     */
    setContadores: function(){
        console.log('EntradaAnimais - setContadores');

        var grid = this.getEntradaAnimaisGrid();
        grid.down('#tbquantidade').setText('<b>Quantidade: <font color="blue"> '+this.quantidade_total+' </font></b>');

        grid.down('#tbpesados').setText('<b>Pesados: <font color="green">'+this.quantidade_pesada+'</font></b>');

        grid.down('#tbfalta').setText('<b>Faltam: <font color="red">'+this.quantidade_falta+'</font></b>');

        grid.down('#tbpesototal').setText('<b>Peso Total: <font color="blue">'+this.peso_total+' Kg</font></b>');

        grid.down('#tbpesomedio').setText('<b>Peso Médio: <font color="blue">'+this.peso_medio+' Kg</font></b>');

    },

});

