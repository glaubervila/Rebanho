Ext.define('Rebanho.store.PesosPorAnimal', {
    extend: 'Rebanho.store.MyStore',

    autoLoad: false,
    
    remoteFilter: true,

    remoteSorter: true,

    model: 'Rebanho.model.PesosPorAnimal',

    groupField: 'confinamento_id',

    proxy: {

        type: 'rest',
        url: 'php/main.php',
        extraParams:{
            classe: 'Pesagens',
            action: 'getPesosPorAnimal',
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