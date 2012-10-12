Ext.define('Rebanho.store.Transferencias', {
    extend: 'Ext.data.Store',

    model: 'Rebanho.model.Transferencia',

    autoSync:false,

    proxy: {

        type: 'rest',
        url: 'php/main.php',
        // BatchAction para enviar todas as linhas alteradas no mesmo request
        batchActions: true,
        extraParams:{
            classe: 'Transferencias',
            //action: '',
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

            // Verificando se Houve Falha
            if (obj.failure){
                Ext.MessageBox.show({ title:'Desculpe!', msg: obj.message, buttons: Ext. MessageBox.OK, icon:  Ext.MessageBox.ERROR })
                store.load();
            }
            else {
                Ext.BoxMsg.msg('Sucesso!', obj.message);
                console.log(obj);
                this.fireEvent('create', this, obj.data);
            }
        },
    }

});