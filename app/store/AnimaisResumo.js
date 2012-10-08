Ext.define('Rebanho.store.AnimaisResumo', {
    extend: 'Rebanho.store.MyStore',

    remoteFilter: true,

    model: 'Rebanho.model.AnimalResumo',

    groupField: 'confinamento_id',

    proxy: {

        type: 'rest',
        url: 'php/main.php',
        extraParams:{
            classe: 'AnimaisResumo',
            returnJson: true,
        },

        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        },
    },
    sorters: [{
        property: 'quadra',
        direction: 'ASC'
    }],
});