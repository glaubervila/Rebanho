Ext.define('Rebanho.store.TransferenciasReport', {
    extend: 'Rebanho.store.MyStore',

    remoteFilter: true,

    autoSync: false,

    model: 'Rebanho.model.TransferenciasReport',

    proxy: {

        type: 'rest',
        url: 'php/main.php',
        extraParams:{
            classe: 'TransferenciasReport',
            action: 'getRelatorioTransferencias',
            returnJson: true,
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
        beforesync: function (options, eOpts){

            var loginMask = new Ext.LoadMask(Ext.getBody(), {msg:"Aguarde ..."});
            loginMask.show();

        },
        write: function(store, operation){

            Ext.getBody().unmask();

            var obj = Ext.decode(operation.response.responseText);
            //console.log(obj);
            if (obj.success){

                if (obj.filename){
                    this.fireEvent('Download_Relatorio', this, obj);
                }
            }
            else {
                if (obj.msg){
                    Ext.MessageBox.show({ title:'Atenção!', msg:obj.msg, buttons: Ext. MessageBox.OK, icon:  Ext.MessageBox.WARNING });
                }
                else {

                    Ext.MessageBox.show({ title:'Atenção!', msg:"Desculpe, mas houve uma Falha e Não foi possivel realizar a operação", buttons: Ext. MessageBox.OK, icon:  Ext.MessageBox.WARNING });
                }
            }
        }
    }
});