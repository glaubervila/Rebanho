Ext.define('Rebanho.store.MyStore', {
    extend: 'Ext.data.Store',

    autoSync: true,

    pageSize: 20,

    remoteSort: true,

    listeners:{
        write: function(store, operation){

        var obj = Ext.decode(operation.response.responseText);

            if (obj.message){
                msg = obj.message;
            }
            else {
                msg = obj.msg;
            }
            // Verificando se Houve Falha
            if (obj.failure){
                Ext.MessageBox.show({ title:'Desculpe!', msg: msg, buttons: Ext. MessageBox.OK, icon:  Ext.MessageBox.ERROR })
                store.load();
            }
            else {
                Ext.ux.Alert.alert('Sucesso!', msg, 'success');
                store.sync();
                store.load();
            }
        },
    },


});