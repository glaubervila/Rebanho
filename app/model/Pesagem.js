Ext.define('Rebanho.model.Pesagem', {

    extend: 'Ext.data.Model',

    requires : [],

    alias: 'pesagem',


    fields: [
        {name:'id', type: 'int'},
        {name:'confinamento_id', type: 'string'},
        {name:'quadra_id', type: 'string'},
        {name:'animal_id', type: 'string'},
        {name:'data', type: 'date', dateFormat: 'Y-m-d' },
        {name:'peso', type: 'float'},
        {name:'tipo', type: 'string'},
        {name:'sexo', type: 'string'},
        {name:'quadra', type: 'string'},
        {name:'codigo', type: 'string'},
        {name:'idade', type: 'string'},
        {name:'icone', convert:function(value,record){
            // Se tiver Peso Coloca o Icone de Tick
            if (record.get('peso') > 0){
                return '<img src="resources/tick.png">';
            }
        }},

    ],

    validations: [
        {type: 'presence',  field: 'confinamento_id'},
        {type: 'presence',  field: 'quadra_id'},
        {type: 'presence',  field: 'animal_id'},
        {type: 'presence',  field: 'data'},
        {type: 'presence',  field: 'peso'},
        {type: 'presence',  field: 'tipo'},
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
