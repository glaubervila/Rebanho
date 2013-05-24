Ext.define('Rebanho.store.Pesagens', {
    extend: 'Rebanho.store.MyStore',

    remoteFilter: true,

    autoSync: false,

    model: 'Rebanho.model.Pesagem',

    proxy: {

        type: 'rest',
        url: 'php/main.php',
        // BatchAction para enviar todas as linhas alteradas no mesmo request
        batchActions: true,
        extraParams:{
            classe: 'Pesagens',
            action: '',
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
            writeAllFields: true,
            encode: true,
            allowSingle: false,
        },

    },
    sorters: [{
        property: 'data',
        direction: 'DESC'
    }],

    listeners: {
        write: function(store, operation){
            var obj = Ext.decode(operation.response.responseText);
    //        if (operation.action == 'update'){

            if (obj.success){
                Ext.ux.Alert.alert('Sucesso!', obj.msg, 'success');
            }
            else {

                Ext.Array.each(obj.erros, function(value) {
                    animal_id = value.id;
                    record = store.getById(animal_id);
                    record.set('error',true);
                    record.set('icone','');
                });

                Ext.MessageBox.show({ title:'Atenção!', msg:"Um ou mais registros podem conter erros.<br>"+obj.msg+"<br> Os demais registros foram salvos.", buttons: Ext. MessageBox.OK, icon:  Ext.MessageBox.WARNING });

            }
        }
    //    },
    }
});