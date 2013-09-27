Ext.define('Rebanho.controller.Vendas', {
    extend: 'Ext.app.Controller',

    stores: [
        'Vendas',
        'Confinamentos',
    ],

    models: [
        'Rebanho.model.Venda',
    ],

    views: [
        'vendas.VendasGrid',
        'vendas.VendasWindow',
        'vendas.VendasForm'
    ],

    refs: [
        {
            ref: 'vendasGrid',
            selector: 'vendasgrid'
        },
        {
            ref: 'vendasForm',
            selector: 'vendasform'
        },
        {
            ref: 'vendasWindow',
            selector: 'vendaswindow'
        },
    ],

    // Chave estrangeira confinamento_id
    confinamento: 0,

    init: function() {

        // ----------< Actions no Store >----------
        // Load da Store
        this.getVendasStore().addListener('load',this.onStoreLoad, this);

        this.control({

            // ----------< Actions do Grid >----------

            // Ao Clicar no Botao Novo

            'vendasgrid button[action=action_novo]': {
                click: this.onBtnNovoClick
            },
            // Ao Clicar no Botao Excluir na Grid
            'vendasgrid button[action=action_excluir]': {
                click: this.onBtnExcluirClick
            },

            'vendasgrid': {
                // Ao Selecionar um Registro na Grid
                selectionchange: this.onSelectChange,
                render:function(){
                    this.getVendasStore().load();
                },
                // DoubleClick em uma linha da Grid
                itemdblclick: this.onBtnEditarClick,

            },
 
            
            //----------< Actions do Form Venda >----------
            'vendasform': {
                afterrender: this.onAfterRenderVendasForm,
            },

            // ----------< Actions do Window >----------
            // Show da Window
            'vendaswindow':{
                show: this.onShowWindow
            }
        });

    },

    // ----------< Metodos da Window de Venda >----------
    onShowWindow: function(){
        console.log('Vendas - onShowWindow');

        console.log(this.confinamento);
        // Recupero o Form
        var form = this.getVendasForm();
        console.log(form);
        // Recupero a combo de origem
        var cmb = form.down('#vendas_cmbConfinamento');
        cmb.setValue("2");
        console.log(cmb);
        // Recupero o Confinamento de Origem
        if (this.confinamento != 0){
            // se tiver um confinamento
            //cmb.setReadOnly(true);
        }

    },
    // ----------< Metodos do Form de Saida >----------

    onAfterRenderVendasForm: function(){
        console.log('Vendas - onAfterRenderVendasForm');

        // Setando o Atributo Confinamento
        this.confinamento = Ext.getCmp('main_viewport').getConfinamentoId();
    },

    // ----------< Metodos do Form de Saida >----------
    onStoreLoad: function(){
        grid = this.getVendasGrid();
    },

    onSelectChange: function(selModel, selections){
        
    },

    /**Funcao: onBtnEditarClick()
     * Funcao executada quando se Clica no Botao 'Editar' da Grid
     * Recupera o Registro e chama a funcao onEditUsuario(null,registro)
     */
    onBtnEditarClick: function(btn, pressed){

        var records = this.getVendasGrid().getSelectionModel().getSelection();
        var data = records[0];

        if (data){
            // Cria a Janela de Cadastro
            this.onBtnNovoClick();
            form = this.win.down('form');
           //console.log(form);
            // Seta o Registro no Form
            form.getForm().loadRecord(data);
        }
    },

    onBtnNovoClick: function (btn){

        if (this.win){
            this.win.close();
            this.win = null;
        }
        this.win = Ext.widget('vendaswindow');
        this.getVendasForm().getForm().reset();
    },

    onBtnCancelarClick: function(){
        this.getVendasWindow().close();
    },

    /**Funcao: onBtnSalvarClick()
     * Funcao executada quando se Clica no Botao 'Salvar' no Form
     * Faz um Submit no Form
     */
    onBtnSalvarClick: function(btn, pressed){

        // Recupera o Form
        var form = this.getVendasForm();
        var store = this.getStore('Vendas');

        console.log(store);
        // Recupera os dados do Formulario
        var values = this.getVendasForm().getForm().getValues();
        var record = form.getRecord();

        // Verifica se é Valido
        if(form.getForm().isValid()){

            if (values.id > 0){
                console.log(record);
                record.set(values);
            }
            else {
                var record = Ext.create('Rebanho.model.Cliente', values);
                // Criando o Registro pela Store
                store.add(record);
                this.getVendasForm().getForm().reset();
           }
         }

    },

    /**Funcao: onBtnExcluirClick()
     * Funcao executada quando se Clica no Botao 'Excluir' no Grid
     * recupera a Grid, verifica se tem registros selecionados
     * e executa a funcao de excluir
     */
    onBtnExcluirClick: function(btn, pressed){

        var me = this;
        // Recuperando a Linha Selecionada
        var grid = me.getVendasGrid();
        var store = grid.getStore();
        var records = grid.getSelectionModel().getSelection();

        // Verificar se Tem Registro a Excluir

        if(records.length === 0){
            Ext.Msg.alert('Atenção!', 'Nenhum Registro à excluir...');
        }else{
            this.excluir(records[0]);
        }
    },

    /**Funcao: onFrmBtnExcluirClick()
     * Funcao executada quando se Clica no Botao 'Excluir' no Formulario
     * recupera o Form, verifica se tem registro
     * e executa a funcao de excluir
     */
    onFrmBtnExcluirClick: function(btn, pressed){

        // Recuperando os Valores do Form
        var record = this.getVendasForm().getForm().getRecord();


        // Verificar se Tem Registro a Excluir
        if(!record.data.id){
            Ext.Msg.alert('Atenção!', 'Nenhum Registro selecionado...');
        }else{
            this.excluir(record);
        }
    },

    /**Funcao: excluir(record)
     * Confirma a Exclusao
     * Recupera a Store e destroy o registro
     */
    excluir: function(record){

        var store = this.getStore('Vendas');

        // Verificar se Tem Registro a Excluir
        if (record.data.id) {

            // Confirmar a Exclusao
            Ext.MessageBox.confirm('Confirmação', 'Deseja Mesmo <font color="red"><b>EXCLUIR</b></font> este(s) Registro(s)?', function(btn){

                if (btn == 'yes'){
                    // Excluindo Usando a Store
                    //store.remove(store.getById(data.id));
                    store.remove(record);
                }
            },this);
        }
    }


});

