Ext.define('Rebanho.controller.PesagensReport', {
    extend: 'Ext.app.Controller',

    stores: ['PesagensReport'],

    models: [
        'Rebanho.model.Relatorio',
    ],

    views: [
         'ocorrencias.pesagens.PesagensReportWindow',
         'ocorrencias.pesagens.PesagensReportForm',
    ],

    refs: [
        {
            ref: 'pesagensReportForm',
            selector: 'pesagensreportform'
        },
    ],

    // Chave estrangeira confinamento_id
    confinamento: 0,

    init: function() {

        // ----------< Actions no Store >----------
        // Eventos da Store
        this.getPesagensReportStore().addListener('Download_Relatorio',this.onDownloadRelatori, this);

        this.control({

            // ----------< Actions do Grid >----------

            // Ao Clicar no Botao Novo

            'pesagensreportform button[action=action_report]': {
                click: this.onBtnClickReport
            },
//             // Ao Clicar no Botao Excluir na Grid
//             'vacinasgrid button[action=action_excluir]': {
//                 click: this.onBtnExcluirClick
//             },

/*            'vacinasgrid': {
                // Ao Selecionar um Registro na Grid
                selectionchange: this.onSelectChange,
                render:function(){
                    this.getVacinasStore().load();
                },
                // DoubleClick em uma linha da Grid
                itemdblclick: this.onBtnEditarClick,

            },
*/
        });

    },


    onBtnClickReport: function (button){
        console.log('PesagensReport - onBtnClickReport');

        // Recuperar as informacoes do form e enviar a requisicao
        form = button.up('form');
        values = form.getValues();
        record = Ext.create('Rebanho.model.PesagensReport', values);
        //console.log(values);
        //var loginMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait ..."});
        //loginMask.show();
        //loginMask.hide();        
        store = this.getStore('PesagensReport');
        //console.log(store);
        store.removeAll(true);
        store.add(record);

        //var loginMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait ..."});
        
        Ext.Ajax.timeout = 12000;
        store.sync();

        record.save();


    },

    onDownloadRelatori: function(store,obj){

        url = "php/core/Download_Arquivo.php?file="+obj.file+'&path='+obj.path+'&filename='+obj.filename+'&mime='+obj.mime;

        window.open(url,'_blank');
    },

});


