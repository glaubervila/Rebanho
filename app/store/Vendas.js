Ext.define('Rebanho.store.Vendas', {
    extend: 'Rebanho.store.MyStore',

    model: 'Rebanho.model.Venda',

    pageSize: 20,

    proxy: {

        type: 'rest',
        url: 'php/main.php',
        extraParams:{
            classe: 'Vendas',
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