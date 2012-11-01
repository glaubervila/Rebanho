Ext.define('Rebanho.controller.Animais', {
    extend: 'Ext.app.Controller',

    require:[
        'Rebanho.view.ocorrencias.pesagens.PesagensPorAnimalGrid',
        'Rebanho.view.ocorrencias.OcorrenciasPorAnimalGrid',
    ],

    stores: [
        'Animais',
        'AnimaisResumo',
        'Pesagens',
        'Ocorrencias',
        'Caracteristicas',
        'Quadras',
    ],

    models: [
        'Rebanho.model.Animal',
        'Rebanho.model.AnimalResumo',
    ],

    views: [
        'Rebanho.view.animais.AnimaisGrid',
        'Rebanho.view.animais.AnimaisForm',
        'Rebanho.view.animais.AnimaisWindow',
        'Rebanho.view.animais.AnimaisEstatisticasPanel',
        'Rebanho.view.animais.LocalizarAnimalWindow',
        // Relatorio Resumido de Animais
        'Rebanho.view.animais.AnimaisResumoGrid',
    ],

    refs: [
        {
            ref: 'animaisGrid',
            selector: 'animaisgrid'
        },
        {
            ref: 'animaisForm',
            selector: 'animaisform'
        },
        {
            ref: 'animaisWindow',
            selector: 'animaiswindow'
        },
        {
            ref: 'localizarAnimalWindow',
            selector: 'localizaranimalwindow'
        },
        {
            ref: 'animaisResumoGrid',
            selector: 'animaisresumogrid'
        },
        {
            ref: 'animaisEstatisticasPanel',
            selector: 'animaisrestatisticas'
        },

    ],

    // Atributos
    // Chave estrangeira confinamento_id
    confinamento: 0,
    // Chave do Animal
    animal_id: 0,
    // Record do Animal
    animal: false,

    init: function() {

        this.control({

            // ----------< Actions do Grid >----------
            // After Render da Grid
            'animaisgrid': {
                afterrender: this.onAfterRender,
                // DoubleClick em uma linha da Grid
                itemdblclick: this.onItemDblClick,
            },
            // Select da Combo de Confinamento
            'animaisgrid [itemId=cmbConfinamento]': {
                select: this.onSelectConfinamento
            },
            // Botao Filtrar da Grid
            'animaisgrid [itemId=btnFiltrar]': {
                click: this.onClickFiltrar
            },

            // ----------< Actions do Form >----------
            'animaisform': {
                afterrender: this.onFormAfterRender,
            },

            // ----------< Actions da Window Pesquisar >----------
            'localizaranimalwindow': {
                show: this.onShowWindow,
            },

            'localizaranimalwindow [itemId=txtCodigoAnimal]': {
                keyup: this.onKeyUpWindow,
            },
            'localizaranimalwindow [action=action_pesquisar]': {
                click: this.onClickBtnPesquisar
            },

            // ----------< Actions da Grid AnimaisResumo >----------
            'animaisresumogrid': {
                afterrender: this.onAfterRenderAnimaisResumoGrid,
            },
            // Select da Combo de Confinamento
            'animaisresumogrid [itemId=cmbConfinamento]': {
                select: this.onSelectConfinamentoResumoGrid
            },

        });
    },


    // ----------< Funcoes da Grid de Animais por Confinamento >----------
    /** Funcao: onAfterRender
     * Executada no evendo afterrender da grid
     * Faz o Tratamento dos Filtros da Grid pelo Confinamento
     */
    onAfterRender: function(){
        console.log('AnimaisGrid - onAfterRender');

        // Carregando a Store de Caracteristicas
        this.getStore('Caracteristicas').load();
        
        // Setando o Atributo Confinamento
        this.confinamento = Ext.getCmp('main_viewport').getConfinamentoId();

        // Setando o Valor da Combo Confinamento
        cmbConfinamento = this.getAnimaisGrid().down('#cmbConfinamento');
        cmbConfinamento.setValue(this.confinamento);

        // Se Houver um Confinamento Setado
        if (this.confinamento > 0) {
            // Desabilito a Combo de Confinamento
            cmbConfinamento.disable();

            // Habilito a Combo de Quadras
            this.getAnimaisGrid().down('#cmbQuadras').enable();
            this.getAnimaisGrid().down('#cmbQuadras').filtrarConfinamento(this.confinamento);

            // Habilito o Botao de Filtrar
            this.getAnimaisGrid().down('#btnFiltrar').enable();
        }
        else {
            // Habilito a Combo
            cmbConfinamento.enable();
            // Aviso para Selecionar um
            Ext.ux.Alert.alert('Atenção!', 'Selecione um Confinamento!','warning');

            // Desabilitar o Combo de Quadras para só ser habilitado apos escolher o confinamento
            this.getAnimaisGrid().down('#cmbConfinamento').enable();
            this.getAnimaisGrid().down('#cmbQuadras').disable();

            // Desabilito o Botao de Filtrar
            this.getAnimaisGrid().down('#btnFiltrar').disable();
        }
    },

    /** Funcao: onSelectConfinamento
     * Executada no evendo select da Combo de Confinamento
     * Faz o Tratamento dos Filtros da Grid pelo Confinamento
     */
    onSelectConfinamento: function(combo, record){
        console.log('Animais - onSelectConfinamento');

        // Setando o Confinamento
        this.confinamento = combo.getValue();

        // Habilito a Combo de Quadras
        this.getAnimaisGrid().down('#cmbQuadras').enable();
        this.getAnimaisGrid().down('#cmbQuadras').filtrarConfinamento(this.confinamento);

        // Habilito o Botao de Filtrar
        this.getAnimaisGrid().down('#btnFiltrar').enable();
    },

    onClickFiltrar: function(){
        console.log('Animais - Filtrar');

        // Recuperando os Valores do Filtros
        confinamento = this.confinamento;
        quadra = this.getAnimaisGrid().down('#cmbQuadras').getValue();

        // Recuperando a Store
        store = this.getStore('Animais');

        // Limpando o Filtro
        store.clearFilter(true);

        store.proxy.setExtraParam('action','getAnimaisAtivos');

        // Adicionando os Filtros a Store
        store.filter([
            {property: "confinamento_id", value: confinamento},
            {property: "quadra_id", value: quadra},
        ]);

        store.proxy.setExtraParam('action','');
    },

    onItemDblClick: function(){
        var records = this.getAnimaisGrid().getSelectionModel().getSelection();
        var data = records[0];
        if (data){
            // Setando os Atributos de animais
            this.animal_id = data.data.id;
            this.animal = data;

            // Carrega a janela de Animais
            this.criaWindowAnimais();
            this.getAnimaisForm().getForm().loadRecord(data);
        }
    },

    // ----------< Funcoes do Form de Animais >----------

    onFormAfterRender: function(){
//        console.log('Animais - onFormAfterRender(animal_id: '+this.animal_id+')');

        // Se tiver um animal_id
        if (this.animal_id !=0){
            // Carregar a Store de Confinamento
            //this.getStore('Confinamentos').load();

            // Carregar a Stores de Pesagens
            store_pesagens = this.getStore('Pesagens');
            // Limpando o Filtro
            store_pesagens.clearFilter(true);

            // Adicionando novo Filtro pra Pegar todas as Ocorrencias deste animal
            store_pesagens.filter([
                {property: "animal_id", value: this.animal_id},
            ]);

            // Carrefar a Store de Ocorrencias
            store_ocorrencia = this.getStore('Ocorrencias');

            // Limpando o Filtro
            store_ocorrencia.clearFilter(true);

            // Adicionando novo Filtro pra Pegar todas as Ocorrencias deste animal
            store_ocorrencia.filter([
                {property: "animal_id", value: this.animal_id},
            ]);
        }

    },

    criaWindowAnimais: function(){
        if (this.win){
            this.win.close();
            this.win = null;
        }
        this.win = Ext.widget('animaiswindow');
    },


    // ----------< Funcoes da Window Pesquisar>----------
    /**
     * No Show da Janela colocar o Focus no campo Pesquisar
     */
    onShowWindow: function(window){
        console.log(window);
        form = window.down('#formPesquisarAnimal');
        form.items.first().focus(true, true);
        console.log(form);
    },
    
    /**
     * Quando apertar enter no campo codigo executa a funcao de click do botao pesquisar
     */
    onKeyUpWindow: function (field, e){
        if(e.getKey() === e.ENTER){
            this.onClickBtnPesquisar();
        }
    },

    onClickBtnPesquisar: function(){

        var txtCodigoAnimal = this.getLocalizarAnimalWindow().down('#txtCodigoAnimal');

        var codigo = txtCodigoAnimal.getValue();
        if (codigo > 0){
            this.getAnimal(codigo);
        }
        else {
            txtCodigoAnimal.setValue('');
            txtCodigoAnimal.setFocus();
        }
    },

    getAnimal: function(codigo){

        this.animalCodigo = codigo;

        Ext.Ajax.request({
            url : 'php/main.php',
            method : 'POST',
            params: {
                classe: 'Animais',
                action: 'localizarAnimal',
                codigo: this.animalCodigo,
            },
            scope:this,
            success: function ( result, request ) {
                var retorno = Ext.decode(result.responseText);
                if (retorno.success){
                    this.loadAnimal(retorno.data);
                }
                else {
                    // Mostrando Mensagem de Erro
                    //Ext.MessageBox.show({ title:'Desculpe!', msg: retorno.message, buttons: Ext. MessageBox.OK, icon:  Ext.MessageBox.WARNING })

                    Ext.ux.Alert.alert('Atenção', retorno.message, 'warning');
                }
            },
        });
    },

    loadAnimal: function(animal){
        // Setando os Atributos de animais
        this.animal_id = animal.id;
        var record = Ext.create('Rebanho.model.Animal',animal);
        this.animal = record;

        // Carregando a Store de Quadras e de Caracteristicas
        this.getStore('Caracteristicas').load();
        this.getStore('Quadras').load();

        // Carrega a janela de Animais
        this.criaWindowAnimais();
        this.getAnimaisForm().getForm().loadRecord(this.animal);

        // Fechando a Janela de Pesquisar
        this.getLocalizarAnimalWindow().close();
    },


    // ----------< Funcoes da Grid AnimaisResumo >----------
    onAfterRenderAnimaisResumoGrid: function(){
        console.log('AnimaisResumoGrid - onAfterRender');

        // Setando o Atributo Confinamento
        this.confinamento = Ext.getCmp('main_viewport').getConfinamentoId();

        // Setando o Valor da Combo Confinamento
        cmbConfinamento = this.getAnimaisResumoGrid().down('#cmbConfinamento');
        cmbConfinamento.setValue(this.confinamento);

        // Se Houver um Confinamento Setado
        if (this.confinamento > 0) {
            // Desabilito a Combo de Confinamento
            cmbConfinamento.disable();

            this.loadAnimalResumoGrid();

        }
        else {
            // Habilito a Combo
            cmbConfinamento.enable();
            // Aviso para Selecionar um
            Ext.ux.Alert.alert('Atenção!', 'Selecione um Confinamento!','warning');
        }

    },

    /** Funcao: onSelectConfinamentoResumoGrid
     * Executada no evendo select da Combo de Confinamento
     * Faz o Tratamento dos Filtros da Grid pelo Confinamento
     */
    onSelectConfinamentoResumoGrid: function(combo, record){
        console.log('AnimaisResumoGrid - onSelectConfinamento');

        // Setando o Confinamento
        this.confinamento = combo.getValue();

        this.loadAnimalResumoGrid();

    },

    loadAnimalResumoGrid: function(){
        console.log('AnimaisResumoGrid - loadAnimalResumoGrid');

        var store = this.getStore('AnimaisResumo');

        // Limpando o Filtro
        store.clearFilter(true);

        store.proxy.setExtraParam('confinamento_id',this.confinamento);

        // Adicionando os Filtros a Store
        store.filter([
            {property: "confinamento_id", value: this.confinamento},
        ]);

    },



});

