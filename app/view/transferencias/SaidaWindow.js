Ext.define('Rebanho.view.transferencias.SaidaWindow' ,{
    extend: 'Ext.window.Window',

    alias : 'widget.saidawindow',

    title: 'Cadastro de Transferências - Saída',

    layout: 'fit',

    autoShow: true,

    width: 800,

    height: 400,

    iconCls: 'icon-control_fastforward_blue',

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
                    xtype: 'saidaform',
                    margins: '5',
                    bodyStyle:'padding:5px',
                    width: 340,
                },
                {
                    title: '',
                    region: 'east',
                    xtype: 'saidagrid',
                    margins: '5',
                    width: 460,
                }]
            }]
        });

        this.callParent(arguments);
    }
 });