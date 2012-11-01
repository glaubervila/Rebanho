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
    ],

    refs: [
        {
            ref: 'ocorrenciasporanimalGrid',
            selector: 'ocorrenciasporanimalgrid'
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

            'ocorrenciasporanimalgrid [action=action_morte]': {
                click: this.onClickBtnMorte
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
        this.animal_id = animal_id;
    },


    // ----------< Metodos da Grid Ocorrencias por Animal >----------
    onClickBtnMorte: function(button){
        console.log('Clicou em Morte');
    },
    
});

