Ext.define('Rebanho.model.Fornecedor', {

    extend: 'Ext.data.Model',

    alias: 'Fornecedor',

//     belongsTo: [
//         {
//             type: 'belongsTo',
//             model:'Rebanho.model.Confinamento',
//             primaryKey: 'id',
//             foreignKey: 'confinamento_id',
//             associationKey: 'confinamento', // read parent data from parent_group
//             associatedName: 'Confinamento',
//         }
//     ],


    fields: [
        {name:'id', type: 'int'},
        {name:'nome', type: 'string'},
        {name:'fazenda', type: 'string'},
        {name:'cnpj_cpf', type: 'string'},
        {name:'ie_rg', type: 'string'},
        {name:'logradouro', type: 'string'},
        {name:'numero', type: 'string'},
        {name:'complemento', type: 'string'},
        {name:'municipio', type: 'string'},
        {name:'uf', type: 'string'},
        {name:'cep', type: 'string'},
        {name:'corretor', type: 'string'},
        {name:'telefone', type: 'string'},
        {name:'telefone2', type: 'string'},
        {name:'email', type: 'string'},
        {name:'observacao', type: 'string'},
        {name:'confinamento_id', type: 'int'},
        {name:'confinamento', type: 'string'},
    ],


});