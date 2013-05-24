Ext.define('Rebanho.controller.PesosPorAnimal', {
    extend: 'Ext.app.Controller',

    require:[ ],

    stores: [
        'PesosPorAnimal',
    ],

    models: [
        'Rebanho.model.PesosPorAnimal',
    ],

    views: [
        // Grid de Pesagem Por Animal
        'ocorrencias.pesagens.PesagensPorAnimalGrid',
    ],

    refs: [
        {
            ref: 'pesagensPorAnimalGrid',
            selector: 'pesagensporanimalgrid'
        },
    ],

    // Chave estrangeira animal_id
    animal_id   : 0,

    init: function() {

        // ----------< Actions no Store >----------

        this.control({

            // ----------< Actions do Grid >----------

            'pesagensporanimalgrid': {
                afterrender: this.onAfterRender,
            },

        });
    },


    onAfterRender: function(){
        console.log('PesosPorAnimal - onAfterRender');

    },


});

