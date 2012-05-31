Ext.define('Rebanho.controller.Fornecedores', {
    extend: 'Ext.app.Controller',

    stores: ['Fornecedores', 'Estados'],

    models: ['Rebanho.model.Fornecedor'],

    views: [
        'compras.fornecedores.FornecedoresGrid',
        'compras.fornecedores.FornecedoresForm',
        'compras.fornecedores.FornecedoresWindow',
    ],

    refs: [
        {
            ref: 'fornecedoresGrid',
            selector: 'fornecedoresgrid'
        },
        {
            ref: 'fornecedoresForm',
            selector: 'fornecedoresform'
        },
        {
            ref: 'FornecedoresWindow',
            selector: 'fornecedoreswindow'
        },

    ],
    init: function() {

        // Load da Store
        this.getFornecedoresStore().addListener('load',this.onStoreLoad, this);

        this.control({

            // ----------< Actions do Grid >----------

            // Ao Clicar no Botao Novo

            'fornecedoresgrid button[action=action_novo]': {
                click: this.onBtnNovoClick
            },
            // Ao Clicar no Botao Excluir na Grid
            'fornecedoresgrid button[action=action_excluir]': {
                click: this.onBtnExcluirClick
            },

            'fornecedoresgrid': {
                // Ao Selecionar um Registro na Grid
                selectionchange: this.onSelectChange,
                render:function(){
                    this.getFornecedoresStore().load();
                },
                // DoubleClick em uma linha da Grid
                itemdblclick: this.onBtnEditarClick,

            },

            // ----------< Actions do Form >----------

            // Ao Clicar no Botao Novo
            'fornecedoresform button[action=action_novo]': {
                click: this.onBtnNovoClick
            },

            // Ao Clicar no Botao Excluir
            'fornecedoresform button[action=action_excluir_form]': {
                click: this.onFrmBtnExcluirClick
            },
            // Ao Clicar no Salvar
            'fornecedoresform button[action=action_salvar]': {
                click: this.onBtnSalvarClick
            },
            // Ao Clicar no Cancelar
            'fornecedoresform button[action=action_cancelar]': {
                click: this.onBtnCancelarClick
            },

        });

    },



    onStoreLoad: function(){
        grid = this.getFornecedoresGrid();
    },

    onSelectChange: function(selModel, selections){
        this.getFornecedoresGrid().down('#delete').setDisabled(selections.length === 0);
    },

    /**Funcao: onBtnEditarClick()
     * Funcao executada quando se Clica no Botao 'Editar' da Grid
     * Recupera o Registro e chama a funcao onEditUsuario(null,registro)
     */
    onBtnEditarClick: function(btn, pressed){

        var records = this.getFornecedoresGrid().getSelectionModel().getSelection();
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
        this.win = Ext.widget('fornecedoreswindow');
        this.getFornecedoresForm().getForm().reset();
    },

    onBtnCancelarClick: function(){
        this.getFornecedoresWindow().close();
    },
    
    /**Funcao: onBtnSalvarClick()
     * Funcao executada quando se Clica no Botao 'Salvar' no Form
     * Faz um Submit no Form
     */
    onBtnSalvarClick: function(btn, pressed){

        // Recupera o Form
        var form = this.getFornecedoresForm();
        var store = this.getStore('Fornecedores');
        // Recupera os dados do Formulario
        var values = this.getFornecedoresForm().getForm().getValues();
        var record = form.getRecord();

        // Verifica se é Valido
        if(form.getForm().isValid()){

            if (values.id > 0){
                console.log(record);
                record.set(values);
            }
            else {
                var record = Ext.create('Rebanho.model.Fornecedor', values);
                // Criando o Registro pela Store
                store.add(record);
                //store.sync();
            }
        }
        this.getFornecedoresForm().getForm().reset();
    },

    /**Funcao: onBtnExcluirClick()
     * Funcao executada quando se Clica no Botao 'Excluir' no Grid
     * recupera a Grid, verifica se tem registros selecionados
     * e executa a funcao de excluir
     */
    onBtnExcluirClick: function(btn, pressed){

        var me = this;
        // Recuperando a Linha Selecionada
        var grid = me.getFornecedoresGrid();
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
        var record = this.getFornecedoresForm().getForm().getRecord();

        
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

        var store = this.getStore('Fornecedores');

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

