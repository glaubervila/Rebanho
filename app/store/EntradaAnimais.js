Ext.define('Rebanho.store.EntradaAnimais', {
    extend: 'Rebanho.store.MyStore',

    remoteFilter: true,

    model: 'Rebanho.model.EntradaAnimal',

    proxy: {

        type: 'rest',
        url: 'php/main.php',
        extraParams:{
            classe: 'NotasEntrada',
            action: 'getAnimaisNota',
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        },

    },

});