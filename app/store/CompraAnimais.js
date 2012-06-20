Ext.define('Rebanho.store.CompraAnimais', {
    extend: 'Rebanho.store.MyStore',

    model: 'Rebanho.model.CompraAnimal',

    pageSize: 20,

    autoSync: true,

    proxy: {

        type: 'rest',
        url: 'php/main.php',
        extraParams:{
            classe: 'CompraAnimais',
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        },

        writer: {
            type: 'json',
            root: 'data',
            writeAllFields: true,
            encode: true,
            allowSingle: true,
        },
    },

});