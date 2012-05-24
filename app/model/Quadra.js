Ext.define('Rebanho.model.Quadra', {

    extend: 'Ext.data.Model',

    alias: 'Quadra',


    fields: [
        {name:'id', type: 'int'},
        {name:'quadra', type: 'string'},
        {name:'confinamento_id', type: 'string'},
        {name:'confinamento', type: 'string'},
    ],

});