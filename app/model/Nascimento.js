Ext.define('Rebanho.model.Nascimento', {

    extend: 'Ext.data.Model',

    requires : [],

    alias: 'nascimento',


    fields: [
        {name:'animal_id', type: 'int'},
        {name:'confinamento_id', type: 'int'},
        {name:'quadra_id', type: 'int'},
        {name:'caracteristica_id', type: 'int'},
        {name:'data_nascimento', type: 'date', dateFormat: 'Y-m-d' },
        {name:'codigo_mae', type: 'int'},
        {name:'codigo_pai', type: 'int'},
        {name:'codigo', type: 'int'},
        {name:'peso', type: 'float'},
        {name:'sexo', type: 'string'},

        {name:'confinamento', type: 'string'},
        {name:'quadra', type: 'string'},
    ],

});
