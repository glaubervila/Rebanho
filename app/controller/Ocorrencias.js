Ext.define('Rebanho.controller.Ocorrencias', {
    extend: 'Ext.app.Controller',

    require:[ ],

    stores: [
        'Ocorrencias',
    ],

    models: [
        'Rebanho.model.Ocorrencia',
    ],

    views: [
        // Grid de Ocorrencias por Animal
        'ocorrencias.OcorrenciasPorAnimalGrid',
        // Formulario para lancamento de Ocorrencia Individual
        'Rebanho.view.ocorrencias.OcorrenciaForm',
        'Rebanho.view.ocorrencias.OcorrenciaWindow',
    ],

    refs: [
        {
            ref: 'ocorrenciasporanimalGrid',
            selector: 'ocorrenciasporanimalgrid'
        },
        {
            ref: 'ocorrenciaForm',
            selector: 'ocorrenciaform'
        },
        {
            ref: 'ocorrenciaWindow',
            selector: 'ocorrenciawindow'
        },


    ],

    // Atributos
    // Chave estrangeira animal_id
    animal_id   : 0,
    // Record Animal
    animal      : false,

    init: function() {

        // ----------< Actions no Store >----------
        // Load da Store
        //this.getStore('Pesagens').addListener('load', this.onLoadStore, this);

        this.control({

            // ----------< Actions do Grid de Pesagens >----------
            'pesagensgrid': {
                render: this.onGridRender,
                afterrender: this.onGridAfterRender,
            },

            // ----------< Actions do Grid Ocorrencias por Animal >----------
            'ocorrenciasporanimalgrid': {
            },

            'ocorrenciasporanimalgrid [action=action_adicionar]': {
                click: this.onClickBtnAdicionar
            },
            // ----------< Actions do Form Ocorrencia Individual >----------
            'ocorrenciaform [itemId=cmbTipoOcorrencia]': {
                select: this.onSelectTipoOcorrencia
            },
            'ocorrenciaform [action=action_salvar]': {
                click: this.onClickBtnSalvar
            },


        });
    },

    /** Function: onGridRender
     * Executado no Render da Grid
     */
    onGridRender: function(){
        
    },

    /** Function: onGridAfterRender
     * Executado no Render da Grid
     */
    onGridAfterRender: function(){

    },

    /** Function: setAnimalId
     * Atribui o id do animal ao Controller
     */
    setAnimalId:function(animal_id){
        console.log('Ocorrencias - setAnimalId('+animal_id+')');
        this.animal_id = animal_id;
    },
    /** Function: setAnimal
     * Atribui o objeto animal ao Controller
     */
    setAnimal:function(animal){
        console.log('Ocorrencias - setAnimal()');
        this.animal = animal;
    },

    // ----------< Metodos da Grid Ocorrencias por Animal >----------
    onClickBtnAdicionar: function(button){
        console.log('Ocorrencias - onClickBtnAdicionar()');

        // Recuperando o objAnimal
        ctlr_animal = this.getController('Animais');
        this.animal = ctlr_animal.getRecordAnimal();

        // Se o animal estiver ativo
        if (this.animal.data.status > 0){

            // Verificar se o animal está no confinamento do usuario
            
            this.criaWindow();
            // Setando o Id
            var form = this.getOcorrenciaForm().getForm();
            form.findField('animal_id').setValue(this.animal_id);

            // Setando as quadras disponiveis pelo confinamento
            form.findField('quadra_id').filtrarConfinamento(this.animal.data.confinamento_id);

            // Setando as vacinas disponiveis pelo confinamento
            form.findField('vacina_id').filtrarVacinas(this.animal.data.confinamento_id);
        }
        else {
            Ext.ux.Alert.alert('Atenção!', 'Verifique se este animal está Ativo!', 'warning');
            button.setDisabled(true);
        }


    },

    criaWindow: function(){
        if (this.win){
            this.win.close();
            this.win = null;
        }
        this.win = Ext.widget('ocorrenciawindow');
    },



    // ----------< Metodos do Form Ocorrencia por Animal >----------
    onSelectTipoOcorrencia: function(combo, record){
        console.log('Ocorrencias - onSelectConfinamento');

        // Recuperando o Form
        form  = combo.up('form').getForm();

        var tipo = combo.getValue();

        // A cada select eu volto o form ao stado normal
        this.resetForm(form);
        // Para cada Tipo de Ocorrencia Habilitar os campos respectivos
        switch (tipo) {
            // Pesagem Individual
            case '4':
                console.log('habilitar o campo de peso');
                form.findField('peso').setDisabled(false);
            break;
            // Manejo
            case '5':
                console.log('habilitar a combo de Descricao');
                form.findField('quadra_id').setDisabled(false);
            break;
            // Vacinacao
            case 'V':
                console.log('habilitar a combo de vacinas');
                form.findField('vacina_id').setDisabled(false);
            break;
            // Morte
            case 'M':
                console.log('habilitar a combo de Descricao');
                form.findField('descricao').setDisabled(false);
            break;

            default:
                console.log('defalt');
                form.findField('descricao').setDisabled(false);
            break;
        }
    },

    resetForm: function(form){
        console.log('Ocorrencias - resetForm');

        form.findField('peso').setDisabled(true);
        form.findField('quadra_id').setDisabled(true);
        form.findField('vacina_id').setDisabled(true);
        form.findField('descricao').setDisabled(true);
    },

    onClickBtnSalvar: function(button){
        console.log('Ocorrencias - onClickBtnSalvar');

        painel = button.up('form');
        form = painel.getForm();
        values = form.getValues();

        if (form.isValid){
            //console.log(values);
            var record = Ext.create('Rebanho.model.Ocorrencia',values);

            store = this.getStore('Ocorrencias');

            // Adicino o Action para o Create
            store.proxy.setExtraParam('action','create');
            store.add(record);
            store.proxy.setExtraParam('action','');
            store.load();

            this.win.close();

            // Recarregar o Cadastro do Animal
            //ctlr_animal = this.getController('Animais');
            //ctlr_animal.reloadAnimal();
        }
        else {
            Ext.ux.Alert.alert('Atenção!', 'Preencha todos os campos...', 'warning');
        }

    },
});

