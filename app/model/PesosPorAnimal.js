Ext.define('Rebanho.model.PesosPorAnimal', {

    extend: 'Ext.data.Model',

    alias: 'pesosporanimal',


    fields: [
        {name:'id', type: 'int'},
        {name:'confinamento_id', type: 'int'},
        {name:'quadra_id', type: 'string'},
        {name:'animal_id', type: 'string'},
        {name:'status', type: 'int'},
        {name:'data', type: 'date', dateFormat: 'Y-m-d' },
        {name:'peso', type: 'float'},
        {name:'tipo', type: 'string'},
        {name:'quadra', type: 'string'},
        {name:'idade', type: 'string'},
        {name:'intervalo', type: 'float'},
        {name:'peso_ganho', type: 'float'},
        {name:'media_dia', type: 'float'},
        {name:'sequencia', type: 'int'},

        {name:'confinamento', type: 'string'},

    ],

    proxy: {

        type: 'rest',
        url: 'php/main.php',
        extraParams:{
            classe: 'Pesagens',
            action: '',
            returnJson: true,
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
