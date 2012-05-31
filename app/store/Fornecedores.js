Ext.define('Rebanho.store.Fornecedores', {
    extend: 'Rebanho.store.MyStore',

    model: 'Rebanho.model.Fornecedor',

    pageSize: 20,

    proxy: {

        type: 'rest',
        url: 'php/Fornecedores.php',
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