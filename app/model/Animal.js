Ext.define('Rebanho.model.Animal', {

    extend: 'Ext.data.Model',

    requires : [
        'Rebanho.model.AnimalCodigo',
        'Rebanho.model.Pesagem',
    ],


    alias: 'animal',


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

        // Campos Estrangeiros
        {name:'quadra', type: 'string'},
        {name:'codigo', type: 'string'},
        {name:'data_entrada', type: 'date', dateFormat: 'Y-m-d'},
        {name:'peso_entrada', type: 'float'},
        {name:'data_ultima_pesagem', type: 'date', dateFormat: 'Y-m-d'},
        {name:'peso_atual', type: 'float'},
        {name:'peso_ganho', type: 'float'},
        {name:'ganho_diario', type: 'float'},
        {name:'dias_confinamento', type: 'string', convert:function(value,record){
            dias =  value + ' - Dias';
            return dias;
        }},
    ],

    associations: [
        {
            type: 'hasMany',
            model: 'Rebanho.model.Pesagem',
            name: 'pesagens',
            primaryKey: 'id',
            foreignKey: 'animal_id',
            associationKey:'pesagens',
        },
        {
            type: 'hasMany',
            model: 'Rebanho.model.AnimalCodigo',
            name: 'codigos',
            primaryKey: 'id',
            foreignKey: 'animal_id',
            associationKey:'codigos',
        }

    ],

// EXEMPLO USANDO ASSOCIAÇÃO
//          var store = this.getEntradaAnimaisGrid().getStore();
//         //console.log(store);
//
//         animal = store.findRecord('codigo',value);
//         console.log(animal);
//
//         pesagens = animal.pesagens();
//         console.log(pesagens);
//
//         peso = pesagens.getAt(0);
//         console.log(peso);

//         codigos = animal.codigos();
//         console.log(codigos);
//
//         codigo = codigos.getAt(0).get('codigo');
//         console.log(codigo);
});


