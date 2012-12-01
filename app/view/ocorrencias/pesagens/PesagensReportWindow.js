Ext.define('Rebanho.view.ocorrencias.pesagens.PesagensReportWindow' ,{
    extend: 'Ext.window.Window',

    alias : 'widget.pesagensreportwindow',

    title: 'Relatórios de Pesagens',

    layout: 'fit',

    autoShow: true,

    width: 300,

    height: 400,

    //iconCls: 'icon-',

    initComponent: function() {

        var me = this;

        Ext.applyIf(me, {

            items: [
                Ext.widget('pesagensreportform'),
            ]
        });

        this.callParent(arguments);
    }
 });