Ext.define('Rebanho.store.EntradaAnimais', {
    extend: 'Rebanho.store.MyStore',

    model: 'Rebanho.model.EntradaAnimal',

    remoteFilter: true,

    remoteSort: true,

    proxy: {

        type: 'rest',
        url: 'php/main.php',
        extraParams:{
            classe: 'NotasEntrada',
            // action: 'getAnimaisNota',
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
            allowSingle: true,
        },

    },

    listeners: {
        write: function(store, operation){
            console.log(operation);
            var obj = Ext.decode(operation.response.responseText);
            if (operation.action == 'update'){
                if (obj.failure){
                    Ext.MessageBox.show({ title:'Desculpe!', msg: obj.msg, buttons: Ext. MessageBox.OK, icon:  Ext.MessageBox.ERROR })
                }
                else {
                    Ext.BoxMsg.msg('Sucesso!', obj.msg);
                    store.proxy.setExtraParam('action','getAnimaisNota');
                    store.load();
                }

            }
        },
    }


});