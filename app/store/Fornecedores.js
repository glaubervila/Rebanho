Ext.define('Rebanho.store.Fornecedores', {
    extend: 'Rebanho.store.MyStore',

    model: 'Rebanho.model.Fornecedor',

    pageSize: 20,

    remoteSort: true,

    proxy: {

        type: 'rest',
        url: 'php/main.php',
        extraParams:{
            classe: 'Fornecedores',
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
    sorters: [{
        property: 'nome',
        direction: 'ASC'
    }],
});