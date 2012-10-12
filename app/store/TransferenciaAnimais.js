Ext.define('Rebanho.store.TransferenciaAnimais', {
    extend: 'Rebanho.store.MyStore',

    remoteFilter: true,

    storeId: 'transferenciasAnimaisStore',

    autoSync: false,

    model: 'Rebanho.model.TransferenciaAnimal',

    proxy: {

        type: 'rest',
        url: 'php/main.php',
        extraParams:{
            classe: 'Transferencias',
            //action: '',
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
//     sorters: [{
//         property: 'data',
//         direction: 'DESC'
//     }],
});