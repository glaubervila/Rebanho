Ext.define('Rebanho.controller.Nascimentos', {
    extend: 'Ext.app.Controller',

    require:[ ],

    stores: [
        'Nascimentos',
    ],

    models: [
        'Rebanho.model.Nascimento',
    ],

    views: [
        // Grid de Nascimentos por Confinamentos
        'ocorrencias.nascimentos.NascimentosGrid',
        // Form de Nascimentos
        'ocorrencias.nascimentos.NascimentosForm',
        // Window de Nascimentos
        'ocorrencias.nascimentos.NascimentosWindow',
    ],

    refs: [
        {
            ref: 'nascimentosGrid',
            selector: 'nascimentosgrid'
        },
        {
            ref: 'nascimentosForm',
            selector: 'nascimentosform'
        },
        {
            ref: 'nascimentosWindow',
            selector: 'nascimentoswindow'
        },
    ],

    init: function() {

        // ----------< Actions no Store >----------
        // Load da Store
        //this.getStore('Pesagens').addListener('load', this.onLoadStore, this);

        this.control({

            // ----------< Actions do Grid de Nascimentos >----------
            'nascimentosgrid': {
                render: this.onGridRender,
                afterrender: this.onGridAfterRender,
            },
            'nascimentosgrid [action=action_adicionar]': {
                click: this.onClickBtnNovo
            },
            // ----------< Actions do Form de Nascimentos >----------
            'nascimentosform': {
                afterrender: this.onFormAfterRender,
            },
            'nascimentosform [action=action_salvar]': {
                click: this.onClickBtnSalvar
            },


        });
    },


    // ----------< Funcoes da Grid de Nascimentos por Confinamento >----------

    onGridRender: function(){
        console.log('Nascimentos - onGridRender');
    },

    onGridAfterRender: function(){
        console.log('Nascimentos - onGridAfterRender');
    },

    onClickBtnNovo: function(){
        console.log('Nascimentos - onClickBtnNovo');

        this.criaWindow();
    },


    // ----------< Funcoes do Form de Nascimentos >----------
    onFormAfterRender: function(){
        console.log('Nascimentos - onFormAfterRender');

        // Setando o Atributo Confinamento
        this.confinamento = Ext.getCmp('main_viewport').getConfinamentoId();

        // Setando o Valor da Combo Confinamento
        cmbConfinamento = this.getNascimentosForm().down('#confinamento');
        cmbConfinamento.setValue(this.confinamento);

        // Se o Usuario Pertencer a um Confinamento desabilitar a Combo
        if (this.confinamento > 0) {
            cmbConfinamento.setReadOnly(true);
        }
    },

    onClickBtnSalvar:function(btn){
        console.log('Nascimentos - onFormAfterRender');

        form = btn.up('form').getForm();
        values = form.getValues();

        if (form.isValid){
            //console.log(values);
            var record = Ext.create('Rebanho.model.Nascimento',values);

            store = this.getStore('Nascimentos');

            store.add(record);

            //store.sync();

            //this.win.close();

            // Recarregar o Cadastro do Animal
            //ctlr_animal = this.getController('Animais');
            //ctlr_animal.reloadAnimal();
        }
        else {
            Ext.ux.Alert.alert('Atenção!', 'Preencha todos os campos...', 'warning');
        }
    },
    
    // ----------< Funcoes da Window de Nascimentos >----------
    criaWindow: function(){
        if (this.win){
            this.win.close();
            this.win = null;
        }
        this.win = Ext.widget('nascimentoswindow');
    },

});

