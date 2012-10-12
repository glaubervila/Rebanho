Ext.define('Rebanho.model.Caracteristica', {

    extend: 'Ext.data.Model',

    alias: 'Caracteristica',

    fields: [
        {name:'id', type: 'int'},
        {name:'codigo', type: 'string'},
        {name:'descricao', type: 'string'},
        {name:'cod_desc', type: 'string'},
    ],

});