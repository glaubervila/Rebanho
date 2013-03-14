Ext.define('Rebanho.controller.TransferenciasReport', {
    extend: 'Ext.app.Controller',

    stores: ['TransferenciasReport'],

    models: [
        'Rebanho.model.TransferenciasReport',
    ],

    views: [
         'transferencias.TransferenciasReportWindow',
         'transferencias.TransferenciasReportForm',
    ],

    refs: [
        {
            ref: 'transferenciasReportForm',
            selector: 'transferenciasreportform'
        },
        {
            ref: 'transferenciasReportWindow',
            selector: 'transferenciasreportwindow'
        },
    ],

    // Chave estrangeira confinamento_id
    confinamento: 0,

    init: function() {

        // ----------< Actions no Store >----------
        // Eventos da Store
        this.getTransferenciasReportStore().addListener('Download_Relatorio',this.onDownloadRelatori, this);

        this.control({

            // ----------< Actions do Grid >----------

            // Ao Clicar no Botao Novo

            'transferenciasreportform button[action=action_report]': {
                click: this.onBtnClickReport
            },

            // ----------< Actions do Window >----------
            // Show da Window
            'transferenciasreportwindow':{
                show: this.onShowWindow
            }
        });

    },


    onBtnClickReport: function (button){
        console.log('PesagensReport - onBtnClickReport');

        // Recuperar as informacoes do form e enviar a requisicao
        form = button.up('form');
        values = form.getValues();
        record = Ext.create('Rebanho.model.TransferenciasReport', values);

        // saber se tem confinamento
        if (record.get('confinamento_id') == 0){
            record.set('confinamento_id', this.confinamento);
        }
        //console.log(values);
        store = this.getStore('TransferenciasReport');
        //console.log(store);
        store.removeAll(true);
        store.add(record);

        Ext.Ajax.timeout = 12000;
        store.sync();

        record.save();

    },

    onDownloadRelatori: function(store,obj){

        url = "php/core/Download_Arquivo.php?file="+obj.file+'&path='+obj.path+'&filename='+obj.filename+'&mime='+obj.mime;

        window.open(url,'_blank');
    },


    /** Funcao: onShowWindow
     * executada no Evendo Show da Window do Form
     */
    onShowWindow: function(){
        console.log('TransferenciasReportWindow - onShowWindow');

        // Setando o Atributo Confinamento
        this.confinamento = Ext.getCmp('main_viewport').getConfinamentoId();

        // Recupera o Form
        var form = this.getTransferenciasReportForm();

        combo_confinamento = form.down('#cmbConfinamento');

        if (this.confinamento > 0){

            combo_confinamento.setValue(this.confinamento);
            combo_confinamento.setDisabled(true);
        }
        else {
            combo_confinamento.setValue(0);
        }

    },


});


