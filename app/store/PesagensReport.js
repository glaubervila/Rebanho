Ext.define('Rebanho.store.PesagensReport', {
    extend: 'Rebanho.store.MyStore',

    remoteFilter: true,

    autoSync: false,

    model: 'Rebanho.model.PesagensReport',

    proxy: {

        type: 'rest',
        url: 'php/main.php',
        extraParams:{
            classe: 'PesagensReport',
            action: 'getRelatorioPesagens',
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
        write: function(store, operation){
            var obj = Ext.decode(operation.response.responseText);
            console.log(obj);
            if (obj.success){
                //Ext.ux.Alert.alert('Sucesso!', obj.msg, 'success');
                window.location.href = "php/core/Download_Arquivo.php?file="+obj.file+'&path='+obj.path+'&filename='+obj.filename+'&mime='+obj.mime;
            }
            else {

                Ext.MessageBox.show({ title:'Atenção!', msg:"Um ou mais registros podem conter erros.<br>"+obj.msg+"<br> Os demais registros foram salvos.", buttons: Ext. MessageBox.OK, icon:  Ext.MessageBox.WARNING });

            }
        }
    }
});