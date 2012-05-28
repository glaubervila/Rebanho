Ext.define('Rebanho.model.Cepea', {

    extend: 'Ext.data.Model',

    alias: 'Cepea',


    fields: [
        {name:'id', type: 'int'},
        {name:'data', type: 'date', dateFormat: 'Y-m-d' },
        {name:'valor', type: 'fload'},
    ],

});