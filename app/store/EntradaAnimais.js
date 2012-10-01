Ext.define('Rebanho.store.EntradaAnimais', {
    extend: 'Ext.data.Store',

    model: 'Rebanho.model.EntradaAnimal',

    remoteFilter: true,

    remoteSort: false,

    autoSync:false,

    proxy: {

        type: 'rest',
        url: 'php/main.php',
        // BatchAction para enviar todas as linhas alteradas no mesmo request
        batchActions: true,
        extraParams:{
            classe: 'NotasEntrada',
            //action: 'getAnimaisNota',
            returnJson: true,
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        },
        writer: {
            type: 'json',
            root: 'data',
            writeAllFields: false,
            encode: true,
            allowSingle: false,
        },

    },

    listeners: {
        write: function(store, operation){
            var obj = Ext.decode(operation.response.responseText);
            if (operation.action == 'update'){

                if (obj.success){
                    Ext.BoxMsg.msg('Sucesso!', obj.msg);
                }
                else {

                    console.log(obj.erros);

                    Ext.Array.each(obj.erros, function(value) {
                        animal_id = value.id;
                        record = store.getById(animal_id);
                        record.set('error',true);
                        record.set('icone','');
                    });

                    Ext.MessageBox.show({ title:'Atenção!', msg:"Um ou mais registros podem conter erros.<br>"+obj.msg+"<br> Os demais registros foram salvos.", buttons: Ext. MessageBox.OK, icon:  Ext.MessageBox.WARNING });

                }
            }
        },
    }
});
