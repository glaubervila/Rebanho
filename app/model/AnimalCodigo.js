Ext.define('Rebanho.model.AnimalCodigo', {

    extend: 'Ext.data.Model',

    alias: 'animalcodigo',

    fields: [
        {name:'id', type: 'int'},
        {name:'confinamento_id', type: 'int'},
        {name:'animal_id', type: 'int'},
        {name:'codigo', type: 'string'},
        {name:'tipo', type: 'string'},
        {name:'data',type: 'date', dateFormat: 'Y-m-d' },
    ],


});