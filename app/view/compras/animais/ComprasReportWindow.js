Ext.define('Rebanho.view.compras.animais.ComprasReportWindow' ,{
    extend: 'Ext.window.Window',

    alias : 'widget.comprasreportwindow',

    title: 'Relatórios de Compras',

    layout: 'fit',

    autoShow: true,

    width: 400,

    height: 250,

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
                    xtype: 'comprasreportform',
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