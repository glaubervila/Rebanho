Ext.define('Rebanho.store.Ocorrencias', {
    extend: 'Rebanho.store.MyStore',

    remoteFilter: true,

    model: 'Rebanho.model.Ocorrencia',

    groupField: 'confinamento_id',

    proxy: {

        type: 'rest',
        url: 'php/main.php',
        extraParams:{
            classe: 'Ocorrencias',
            returnJson: true,
        },

        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        },

    },
    sorters: [
        {
            property: 'data',
            direction: 'DESC'
        },{
            property: 'id',
            direction: 'DESC'
        }
        ,{
            property: 'confinamento_id',
            direction: 'DESC'
        }
    ],
});