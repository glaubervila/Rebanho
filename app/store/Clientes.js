Ext.define('Rebanho.store.Clientes', {
    extend: 'Rebanho.store.MyStore',

    model: 'Rebanho.model.Cliente',

    pageSize: 20,

    proxy: {

        type: 'rest',
        url: 'php/main.php',
        extraParams:{
            classe: 'Clientes',
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