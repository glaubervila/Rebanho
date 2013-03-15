Ext.define('Rebanho.controller.ComprasReport', {
    extend: 'Ext.app.Controller',

    stores: ['ComprasReport','Fornecedores'],

    models: [
       'Rebanho.model.ComprasReport',
    ],

    views: [
         'compras.animais.ComprasReportWindow',
         'compras.animais.ComprasReportForm',
    ],

    refs: [
        {
            ref: 'comprasReportForm',
            selector: 'comprasreportform'
        },
        {
            ref: 'comprasReportWindow',
            selector: 'comprasreportwindow'
        },
    ],

    // Chave estrangeira confinamento_id
    confinamento: 0,

    init: function() {

        // ----------< Actions no Store >----------
        // Eventos da Store
        this.getComprasReportStore().addListener('Download_Relatorio',this.onDownloadRelatori, this);

        this.control({

            // ----------< Actions do Grid >----------


            // ----------< Actions do Form >----------
            'comprasreportform button[action=action_report]': {
                click: this.onBtnClickReport
            },
              // Ao Clicar No Select de Fornecedores
            'comprasreportform [name=fornecedor_id]': {
                fornecedorestriggerclick: this.searchFornecedor
            },
            // Ao Selecionar um Confinamento
//             'comprasreportform [name=confinamento_id]': {
//                 select: this.onSelectCmbConfinamentos
//             },


            // ----------< Actions do Window >----------
            // Show da Window
            'comprasreportwindow':{
                show: this.onShowWindow
            }
        });

    },


    onBtnClickReport: function (button){
        console.log('ComprasReport - onBtnClickReport');

        // Recuperar as informacoes do form e enviar a requisicao
        form = button.up('form');
        values = form.getValues();
        record = Ext.create('Rebanho.model.ComprasReport', values);

        // saber se tem confinamento
        if (record.get('confinamento_id') == 0){
            record.set('confinamento_id', this.confinamento);
        }
        //console.log(values);
        store = this.getStore('ComprasReport');
        //console.log(store);
        store.removeAll(true);
        store.add(record);

        Ext.Ajax.timeout = 99999;
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
        console.log('ComprasReportWindow - onShowWindow');

        // Setando o Atributo Confinamento
        this.confinamento = Ext.getCmp('main_viewport').getConfinamentoId();

//         // Recuperado as Stores
        store_fornecedores = this.getStore('Fornecedores');
        // Carregando as Stores
        store_fornecedores.clearFilter(true);
        store_fornecedores.load();

         
// 
//         // Recupera o Form
//         var form = this.getComprasReportForm();
// 
//         combo_confinamento = form.down('#cmbConfinamento');
// 
//         if (this.confinamento > 0){
// 
//             combo_confinamento.setValue(this.confinamento);
//             combo_confinamento.setDisabled(true);
// 
//             // Chamando o Metodo onSelectCmbConfinamentos para carregar os combos
//             this.onSelectCmbConfinamentos(combo_confinamento, this.confinamento);
// 
//         }
//         else {
//             combo_confinamento.setValue(0);
//             // Carregando as Stores
//             store_fornecedores.clearFilter(true);
//             store_fornecedores.load();
//         }

    },


    

});


