Ext.define('Rebanho.controller.CompraAnimais', {
    extend: 'Ext.app.Controller',

    stores: ['CompraAnimais', 'Fornecedores', 'Quadras', 'Confinamentos'],

    models: ['Rebanho.model.CompraAnimal'],

    views: [
        'compras.animais.CompraAnimaisGrid',
        'compras.animais.EntradaAnimaisList',
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

    // Atributos
    // Chave estrangeira confinamento_id
    confinamento: 0,


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

            // Ao Selecionar um Confinamento
            'compraanimaisgrid [itemId=confinamento]': {
                select: this.onSelectCmbConfinamentos
            },

            'compraanimaisgrid': {
                // Ao Renderizar a Grid
                render: this.onGridRender,
                // Depois de Renderizar a Grid
                afterrender: this.onGridAfterRender,
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

            // ----------< Actions do Window >----------
            // Show da Window
            'compraanimaiswindow':{
                show: this.onShowWindow
            }
        });

    },

    onGridAfterRender: function(){
        console.log('CompraAnimais - onGridAfterRender');
        // Setando o Valor da Combo Confinamento
        cmbConfinamento = this.getCompraAnimaisGrid().down('#confinamento');
        cmbConfinamento.setValue(this.confinamento);

        // Se o Usuario Pertencer a um Confinamento desabilitar a Combo
        if (this.confinamento > 0){
            cmbConfinamento.disable();
        }
    },
    
    /** Funcao: onGridRender
     * Executada no evendo render da grid
     * Recupera o confinamento do usuario
     * Gera os Filtros para a Store
     * Executa o Load da Store
     */
    onGridRender: function(){
        console.log('CompraAnimais - onGridRender');

        // Setando o Atributo Confinamento
        this.confinamento = Ext.getCmp('main_viewport').getConfinamentoId();

        // Carregando Stores Secundarias
        this.getStore('Caracteristicas').load();


        // Recuperando a Store
        store = this.getStore('CompraAnimais');

        // Se houver um Confinamento Usar o Filtro na Store
        if (this.confinamento > 0) {
            // Adicionando novo Filtro pra Trazer so as Notas do Confinamento
            store.filter("confinamento_id", this.confinamento);
        }
        else {
            // Carrega a Store
            store.load();
        }
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
     * Se tiver o Confinamento ja faz os filtros nas grids, se nao houver so carrega
     * e o filtro sera feito no select do combo confinamento
     */
    onFormRender: function(){
        console.log('CompraAnimais - onFormRender');
        // Setando o Atributo Confinamento
        this.confinamento = Ext.getCmp('main_viewport').getConfinamentoId();
    },

    /** Funcao: onShowWindow
     * executada no Evendo Show da Window do Form
     */
    onShowWindow: function(){
        console.log('CompraAnimais - onShowWindow');

        // Recupera o Form
        var form = this.getCompraAnimaisForm();
        form.down('#cmbConfinamento').setValue(1);

        // Recupera o Form
        var form = this.getCompraAnimaisForm();

        // Recuperado as Stores
        store_fornecedores = this.getStore('Fornecedores');
        store_quadras = this.getStore('Quadras');
        // Recuperando a Combo
        combo_confinamento = form.down('#cmbConfinamento');

        if (this.confinamento > 0){

            combo_confinamento.setValue(this.confinamento);
            combo_confinamento.setDisabled(true);
            // Chamando o Metodo onSelectCmbConfinamentos para carregar os combos
            this.onSelectCmbConfinamentos(combo_confinamento, this.confinamento);
        }
        else {
            combo_confinamento.setValue(0);
            // Carregando as Stores
            store_fornecedores.clearFilter(true);
            store_quadras.clearFilter(true);
            store_fornecedores.load();
            store_quadras.load();

        }
    },

    /** Funcao executada quando seleciona um confinamento
     * habilita a combo de quadra e cria um filtro
     */
    onSelectCmbConfinamentos: function(combo, value){
        //console.log('CompraAnimais - onSelectCmbConfinamentos');

        // Recupera o Form se a combo tiver vindo do form faz os tratamentos se nao so atualiza a grid
        var form = combo.up('form');

        if (form) {
            console.log('Entrou no Form');
            var comboFornecedores = form.down('#cmbFornecedores');
            var comboQuadras = form.down('#cmbQuadras');

            // Limpando as Stores
            comboQuadras.store.clearFilter(true);
            comboFornecedores.store.clearFilter(true);

            // Tratamento dos Fornecedores
            comboFornecedores.setValue('');
            comboFornecedores.store.removeAll();
            comboFornecedores.store.load({
                params: {
                    action: 'getAt',
                    field : 'confinamento_id',
                    value : combo.getValue(),
                }
            });
            comboFornecedores.setDisabled(false);

            // Tratamento das Quadras
            comboQuadras.store.removeAll();
            comboQuadras.store.filter('confinamento_id', combo.getValue());
            comboQuadras.setDisabled(false);
        }

        // Atualiza o Store da Grid
        storeCompras = this.getStore('CompraAnimais');
        storeCompras.clearFilter(true);
        storeCompras.filter('confinamento_id', combo.getValue());
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
            form.down('#cmbQuadras').setDisabled(false);

            // Desabilitando Campos
            form.down('#cmbConfinamento').setDisabled(true);
            form.down('#dtfDataCompra').setDisabled(true);
            form.down('#cmbFornecedores').setDisabled(true);

            // Se a Nota Estiver Fechada (status == 2) Nao permite salvar
            if (data.data.status == 2) {
                form.down('#cmbConfinamento').setDisabled(false);
                form.down('#dtfDataCompra').setDisabled(false);
                form.down('#cmbFornecedores').setDisabled(false);
                // Aqui Evito que a nota seja Alterada
                form.down('#btnSalvar').setDisabled(true);
            }

            // Carregar a Store de Animais na Compra
            store = this.getStore('EntradaAnimais');

            // Limpando o Filtro
            store.removeAll();
            store.clearFilter(true);
            // Adicionando novo Filtro pra Pegar todos os animais dessa nota
            store.filter("compra_id", data.data.id);

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
        this.win = null;
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
                //console.log(record);
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

