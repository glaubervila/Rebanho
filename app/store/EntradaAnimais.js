Ext.define('Rebanho.store.EntradaAnimais', {
    extend: 'Rebanho.store.MyStore',

    model: 'Rebanho.model.EntradaAnimal',

    remoteFilter: true,

    remoteSort: true,

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