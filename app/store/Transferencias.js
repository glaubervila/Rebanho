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
            writeAllFields: true,
            encode: true,
            allowSingle: false,
        },

    },

    sorters: [
        {
            property: 'data_saida',
            direction: 'DESC'
        },{
            property: 'id',
            direction: 'DESC'
        }
    ],

    listeners: {
        write: function(store, operation){
            var obj = Ext.decode(operation.response.responseText);

            // Verificando se Houve Falha
            if (obj.failure){
                Ext.MessageBox.show({ title:'Desculpe!', msg: obj.msg, buttons: Ext. MessageBox.OK, icon:  Ext.MessageBox.ERROR })

                //store.rejectChanges();
                store.load();
            }
            else {
                if (!obj.data){
                    Ext.ux.Alert.alert('Sucesso!', obj.message, 'success');
                }
                else {
                    // Tratando o Evento Pelo Status
                    if (obj.data.status == 0) {
                        // 0 - Saida - logo apos o isert da transferencia
                        this.fireEvent('saida', this, obj.data);
                    }
                    else if (obj.data.status == 1){
                        // 1 - Transito - update finalizando a entrada
                        this.fireEvent('transito', this, obj.data);
                    }
                    else if (obj.data.status == 2){
                        // 2 - Entrada - update iniciando a pesagem
                        this.fireEvent('entrada', this, obj.data);
                    }
                    else if (obj.data.status == 3){
                        // 3 - Concluido - update finalizando totalmente a transferencia
                        this.fireEvent('concluido', this, obj.data);
                    }
                }

                store.sync();
                store.load();
            }
        },
    }

});