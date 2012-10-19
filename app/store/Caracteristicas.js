Ext.define('Rebanho.store.Caracteristicas', {
    extend: 'Ext.data.Store',
    
    model: 'Rebanho.model.Caracteristica',

    autoSync: true,

    pageSize: 20,

    remoteSort: true,

    proxy: {

        type: 'rest',
        url: 'php/main.php',
        extraParams:{
            classe: 'Caracteristicas',
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
            allowSingle: true,
        },

    },

    listeners: {
        write: function(store, operation){


            var obj = Ext.decode(operation.response.responseText);
            // Por Ser uma Grid Editavel verificar se a operacao e um 'create'
            // Se for nao faz nada
            if (operation.action == 'create'){

            }
            else {
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
            }
        },
    }
});