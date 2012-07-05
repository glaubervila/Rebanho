Ext.define('Rebanho.model.EntradaAnimal', {

    extend: 'Ext.data.Model',

    requires : [
    ],


    alias: 'entradaanimal',


    fields: [
        {name:'id', type: 'int'},
        {name:'confinamento_id', type: 'string'},
        {name:'quadra_id', type: 'int'},
        {name:'compra_id', type: 'int'},
        {name:'fornecedor_id', type: 'int'},
        {name:'caracteristica_id', type: 'int'},
        {name:'sisbov', type: 'string'},
        {name:'sexo', type: 'string'},
        {name:'idade', type: 'string'},
        {name:'classificacao', type: 'string'},
        {name:'escore', type: 'string'},
        {name:'status', type: 'string'},
        {name:'codigo', type: 'string'},
        {name:'peso_entrada', type: 'float'},
    ],


});
