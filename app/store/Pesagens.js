Ext.define('Rebanho.store.Pesagens', {
    extend: 'Rebanho.store.MyStore',

    remoteFilter: true,

    model: 'Rebanho.model.Pesagem',

    proxy: {

        type: 'rest',
        url: 'php/main.php',
        extraParams:{
            classe: 'Pesagens',
            action: '',
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