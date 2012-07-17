Ext.define('Rebanho.controller.CompraAnimais', {
    extend: 'Ext.app.Controller',

    stores: ['CompraAnimais', 'Fornecedores', 'Quadras', 'Confinamentos'],

    models: ['Rebanho.model.CompraAnimal'],

    views: [
        'compras.animais.CompraAnimaisGrid',
        'compras.animais.CompraAnimaisWindow',
        'compras.animais.CompraAnimaisForm',
    ],

    refs: [
        {
            ref: 'compraAnimaisGrid',
            selector: 'compraanimaisgrid'
        },
        {
            ref: 'compraAnimaisForm',
            selector: 'compraanimaisform'
        },
        {
            ref: 'compraAnimaisWindow',
            selector: 'compraanimaiswindow'
        },

    ],
    init: function() {

        this.control({

            // ----------< Actions do Grid >----------

            // Ao Clicar no Botao Novo

            'compraanimaisgrid button[action=action_novo]': {
                click: this.onBtnNovoClick
            },
            // Ao Clicar no Botao Excluir na Grid
            'compraanimaisgrid button[action=action_excluir]': {
                click: this.onBtnExcluirClick
            },

            'compraanimaisgrid': {
                // Ao Renderizar a Grid
                render:function(){
                    // Carrega a Store
                    this.getStore('CompraAnimais').load();
                },
                // DoubleClick em uma linha da Grid
                itemdblclick: this.onBtnEditarClick,
                // Ao Selecionar um Registro na Grid
                selectionchange: this.onSelectChange,

            },

            // ----------< Actions do Form >----------

              // Ao Clicar No Select de Fornecedores
            'compraanimaisform [name=fornecedor_id]': {
                fornecedorestriggerclick: this.searchFornecedor
            },
            // Ao Selecionar um Confinamento
            'compraanimaisform [name=confinamento_id]': {
                select: this.onSelectCmbConfinamentos
            },
            // Ao Clicar no Botao Excluir
            'compraanimaisform button[action=action_excluir_form]': {
                click: this.onFrmBtnExcluirClick
            },
            // Ao Clicar no Salvar
            'compraanimaisform button[action=action_salvar]': {
                click: this.onBtnSalvarClick
            },
            // Ao Clicar no Cancelar
            'compraanimaisform button[action=action_cancelar]': {
                click: this.onBtnCancelarClick
            },
            // Ao Clicar no Botao Novo
            'compraanimaisform button[action=action_novo]': {
                click: this.onBtnNovoClick
            },
            // Render do Form
            'compraanimaisform': {
                render: this.onFormRender
            },
        });

    },

    /**Funcao onSelectChange
     * Executada Toda Vez que se seleciona algum registro na grid
     * Se houver registro selecionado habilita o botao de excluir na grid
     */
    onSelectChange: function(selModel, selections){
        this.getCompraAnimaisGrid().down('#delete').setDisabled(selections.length === 0);
    },

    /**Funcao searchFornecedor
     * Executada quando o evendo customizado do triggerfild de Fornecedores e disparado
     * OBS: Implementacao Futura abrir uma janela com a lista de fornecedores
     */
    searchFornecedor: function(btn){
        alert('Localizar Fornecedor');
    },

    /** Funcao executada no Render do Form
     *  Carrega as Store das Combo aninhadas para que o filtro funcione
     */
    onFormRender: function(){
        // Carregando a Store de Fornecedores
        this.getStore('Fornecedores').load();
        // Carregando a Store de Quadras
        this.getStore('Quadras').load();
    },
    
    /** Funcao executada quando seleciona um confinamento
     * habilita a combo de quadra e cria um filtro
     */
    onSelectCmbConfinamentos: function(combo, value){
        var form = combo.up('form');

        // Tratamento dos Fornecedores
        var comboFornecedores = form.down('#cmbFornecedores');
        comboFornecedores.setValue('');
        comboFornecedores.store.removeAll();
        comboFornecedores.store.load({
            params: {
                action: 'getAt',
                field : 'confinamento_id',
                value : combo.getValue(),
            }
        });
        //comboFornecedores.store.filter('confinamento_id', combo.getValue());
        comboFornecedores.setDisabled(false);

        // Tratamento das Quadras
        var comboQuadras = form.down('#cmbQuadras');
        comboQuadras.store.clearFilter();
        comboQuadras.store.filter('confinamento_id', combo.getValue());
        comboQuadras.setDisabled(false);
    },

    /**Funcao: onBtnEditarClick()
     * Funcao executada quando se Clica no Botao 'Editar' da Grid
     * Recupera o Registro e chama a funcao onEditUsuario(null,registro)
     */
    onBtnEditarClick: function(btn, pressed){

        var records = this.getCompraAnimaisGrid().getSelectionModel().getSelection();
        var data = records[0];

        if (data){
            // Cria a Janela de Cadastro
            this.onBtnNovoClick();
            form = this.win.down('form');
            //console.log(form);
            // Seta o Registro no Form
            form.getForm().loadRecord(data);

            // Reconfigura o Form
            // Setando as Combo de desabilitada pra habilitada
            form.down('#cmbFornecedores').setDisabled(false);
            form.down('#cmbQuadras').setDisabled(false);

            // Se a Nota Estiver Fechada (status == 2) Nao permite salvar
            if (data.data.status == 2) {
                console.log('EDITANDO NOTA FECHADA');
                // Aqui Evito que a nota seja Alterada
                form.down('#btnSalvar').setDisabled(true);
            }
        }
    },

    onBtnNovoClick: function (btn){

        if (this.win){
            this.win.close();
            this.win = null;
        }
        this.win = Ext.widget('compraanimaiswindow');
        //this.getFornecedoresForm().getForm().reset();
    },

    onBtnCancelarClick: function(){
        this.getCompraAnimaisWindow().close();
    },
    
    /**Funcao: onBtnSalvarClick()
     * Funcao executada quando se Clica no Botao 'Salvar' no Form
     * Faz um Submit no Form
     */
    onBtnSalvarClick: function(btn, pressed){

        // Recupera o Form
        var form = this.getCompraAnimaisForm();
        var store = this.getStore('CompraAnimais');
        // Recupera os dados do Formulario
        var values = form.getForm().getValues();
        var record = form.getRecord();

        // Verifica se é Valido
        if(form.getForm().isValid()){

            if (values.id > 0){
                console.log(record);
                record.set(values);
            }
            else {
                var record = Ext.create('Rebanho.model.CompraAnimal', values);
                // Criando o Registro pela Store
                store.add(record);
                this.getCompraAnimaisForm().getForm().reset();
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
        var grid = me.getCompraAnimaisGrid();
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
        var record = this.getCompraAnimaisForm().getForm().getRecord();

        
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

        var store = this.getStore('CompraAnimais');

        // Verificar se Tem Registro a Excluir
        if (record.data.id) {

            // Confirmar a Exclusao
            Ext.MessageBox.confirm('Confirmação', 'Deseja Mesmo <font color="red"><b>EXCLUIR</b></font> este(s) Registro(s)?', function(btn){

                if (btn == 'yes'){
                    // Excluindo Usando a Store
                    store.remove(record);
                }
            },this);
        }
    }

});

