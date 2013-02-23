Ext.define('Rebanho.store.Nascimentos', {
    extend: 'Rebanho.store.MyStore',

    remoteFilter: true,

    model: 'Rebanho.model.Nascimento',

    proxy: {

        type: 'rest',
        url: 'php/main.php',
        extraParams:{
            classe: 'Nascimentos',
            returnJson: true,
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
    sorters: [
        {
            property: 'data',
            direction: 'DESC'
        }
        ,{
            property: 'confinamento_id',
            direction: 'DESC'
        }
    ],
});