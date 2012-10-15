Ext.define('Rebanho.store.TransferenciaAnimais', {
    extend: 'Rebanho.store.MyStore',

    remoteFilter: true,

    storeId: 'transferenciasAnimaisStore',

    autoSync: false,

    model: 'Rebanho.model.TransferenciaAnimal',

    proxy: {

        type: 'rest',
        url: 'php/main.php',
        extraParams:{
            classe: 'Transferencias',
            //action: '',
            returnJson: true,
        },
        // BatchAction para enviar todas as linhas alteradas no mesmo request
        batchActions: true,
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

    listeners: {
        write: function(store, operation){
            var obj = Ext.decode(operation.response.responseText);

            if (operation.action == 'delete'){

            }
            else {
                // Verificando se Houve Falha
                if (obj.failure){
                    Ext.MessageBox.show({ title:'Desculpe!', msg: obj.msg, buttons: Ext. MessageBox.OK, icon:  Ext.MessageBox.ERROR });
                    store.load();
                }
                else {
                    //Ext.BoxMsg.msg('Sucesso!', obj.msg);
                    this.fireEvent('createAnimais', this);
                }
            }
        },
    }
    
});