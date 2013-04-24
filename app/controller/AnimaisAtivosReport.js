Ext.define('Rebanho.controller.AnimaisAtivosReport', {
    extend: 'Ext.app.Controller',

    stores: ['AnimaisAtivosReport'],

    models: [
        'Rebanho.model.AnimaisAtivosReport',
    ],

    views: [
         'animais.AnimaisAtivosReportWindow'
    ],

    refs: [
        {
            ref: 'animaisAtivosReportWindow',
            selector: 'animaisativosreportwindow'
        },
    ],

    // Chave estrangeira confinamento_id
    confinamento: 0,

    init: function() {

        // ----------< Actions no Store >----------
        // Eventos da Store
        this.getAnimaisAtivosReportStore().addListener('Download_Relatorio',this.onDownloadRelatori, this);

        this.control({

            // ----------< Actions do Grid >----------

            // Ao Clicar no Botao Novo

            'animaisativosreportwindow button[action=action_report]': {
                click: this.onBtnClickReport
            },


            // Ao Selecionar o Confinamento
            'animaisativosreportwindow [itemId=cmbConfinamento]': {
                select: this.onSelectCmbConfinamentos
            },
            // ----------< Actions do Window >----------
            // Show da Window
            'animaisativosreportwindow':{
                show: this.onShowWindow
            }
        });

    },

    /** Funcao: onShowWindow
     * executada no Evendo Show da Window
     */
    onShowWindow: function(window){
        console.log('AnimaisAtivosReportWindow - onShowWindow');

        // Setando o Atributo Confinamento
        this.confinamento = Ext.getCmp('main_viewport').getConfinamentoId();

        // Recupera o Form
        form = window.down('#formAnimaisAtivosReport');

        combo_confinamento = form.down('#cmbConfinamento');
        if (this.confinamento > 0){
 
            combo_confinamento.setValue(this.confinamento);
            combo_confinamento.setReadOnly(true);

            // Pegar a combo quadra e setar um valor
            combo_quadra = form.down('#cmbQuadra');
            combo_quadra.setDisabled(false);
            combo_quadra.filtrarConfinamento(this.confinamento);
        }
        else {
            combo_confinamento.setValue(0);
        }
    },


    onSelectCmbConfinamentos: function(combo, record, options){
        console.log('AnimaisAtivosReportWindow - onSelectCmbConfinamentos');
        // Setando o Confinamento
        this.confinamento = combo.getValue();
        form = combo.up('#formAnimaisAtivosReport');

        // Pegar a combo quadra e setar um valor
        combo_quadra = form.down('#cmbQuadra');
        combo_quadra.setDisabled(false);
        combo_quadra.filtrarConfinamento(this.confinamento);
    },

    onBtnClickReport: function (button){
        console.log('AnimaisAtivosReport - onBtnClickReport');

        Ext.Ajax.timeout = 12000;

        // Recuperar as informacoes do form e enviar a requisicao
        form = this.getAnimaisAtivosReportWindow().down('#formAnimaisAtivosReport');

        values = form.getForm().getValues();

        record = Ext.create('Rebanho.model.AnimaisAtivosReport', values);

        store = this.getStore('AnimaisAtivosReport');

        store.removeAll(true);
        store.add(record);
        store.sync();

        record.save();

    },

    onDownloadRelatori: function(store,obj){

        url = "php/core/Download_Arquivo.php?file="+obj.file+'&path='+obj.path+'&filename='+obj.filename+'&mime='+obj.mime;

        window.open(url,'_blank');
    },

});


