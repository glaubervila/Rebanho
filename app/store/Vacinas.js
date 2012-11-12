Ext.define('Rebanho.store.Vacinas', {
    extend: 'Rebanho.store.MyStore',

    model: 'Rebanho.model.Vacina',

    pageSize: 20,

    proxy: {

        type: 'rest',
        url: 'php/main.php',
        extraParams:{
            classe: 'Vacinas',
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