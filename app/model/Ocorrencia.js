Ext.define('Rebanho.model.Ocorrencia', {

    extend: 'Ext.data.Model',

    requires : [],

    alias: 'ocorrencia',


    fields: [
        {name:'id', type: 'int'},
        {name:'confinamento_id', type: 'int'},
        {name:'quadra_id', type: 'int'},
        {name:'animal_id', type: 'int'},
        {name:'data', type: 'date', dateFormat: 'Y-m-d' },
        {name:'tipo', type: 'string'},
        {name:'ocorrencia', type: 'string'},
        {name:'descricao', type: 'string'},

        {name:'confinamento', type: 'string'},
        {name:'quadra', type: 'string'},
    ],

    proxy: {

        type: 'rest',
        url: 'php/main.php',
        extraParams:{
            classe: 'Ocorrencias',
            returnJson: true,
        },

    },

});
