Ext.define('Rebanho.view.transferencias.TransferenciasReportWindow' ,{
    extend: 'Ext.window.Window',

    alias : 'widget.transferenciasreportwindow',

    title: 'Relatórios de Transferência',

    layout: 'fit',

    autoShow: true,

    width: 400,

    height: 300,

    iconCls: 'icon-report',

    initComponent: function() {

        var me = this;

        Ext.applyIf(me, {

            items: [{
                xtype: 'panel',
                layout: 'border',
                items: [
                {
                    title: '',
                    region: 'center',
                    xtype: 'transferenciasreportform',
                    margins: '5',
                    bodyStyle:'padding:5px',
                    width: 340,
                },
/*                {
                    title: '',
                    region: 'east',
                    xtype: 'saidagrid',
                    margins: '5',
                    width: 460,
                }*/]
            }]
        });

        this.callParent(arguments);
    }
 });