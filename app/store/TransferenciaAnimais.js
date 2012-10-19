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

                    // Carregando a Store de AnimaisTransferidos
                    store.removeAll();
                    console.log(obj);
                    //altera o action da store
                    store.proxy.setExtraParam('action','getAnimaisTransferencia');
                    store.proxy.setExtraParam('transferencia_id',obj.transferencia_id);
                    // Carrega os animais na grid, usa o campo animais na tabela transferencia
                    store.load();
                    //volta o action da store
                    store.proxy.setExtraParam('action','');
                    store.proxy.setExtraParam('transferencia_id', 0);

                }
                else {
                    if (obj.evento == 'entrada'){
                        this.fireEvent('entradaAnimais', this);
                    }
                    else {
                        this.fireEvent('createAnimais', this);
                    }
                }
            }
        },
    }
    
});