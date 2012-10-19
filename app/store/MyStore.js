Ext.define('Rebanho.store.MyStore', {
    extend: 'Ext.data.Store',

    autoSync: true,

    pageSize: 20,

    remoteSort: true,

    listeners:{
        write: function(store, operation){

        var obj = Ext.decode(operation.response.responseText);

            // Verificando se Houve Falha
            if (obj.failure){
                Ext.MessageBox.show({ title:'Desculpe!', msg: obj.message, buttons: Ext. MessageBox.OK, icon:  Ext.MessageBox.ERROR })
                store.load();
            }
            else {
                Ext.ux.Alert.alert('Sucesso!', obj.message, 'success');
                store.sync();
                store.load();
            }
        },
    },


});