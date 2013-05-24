Ext.define('Rebanho.view.transferencias.EntradaWindow' ,{
    extend: 'Ext.window.Window',

    alias : 'widget.entradawindow',

    title: 'Cadastro de Transferências - Entrada',

    layout: 'fit',

    autoShow: true,

    width: 800,

    height: 400,

    iconCls: 'icon-control_rewind_blue',

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
                    xtype: 'entradaform',
                    margins: '5',
                    bodyStyle:'padding:5px',
                    width: 340,
                },
                {
                    title: '',
                    region: 'east',
                    xtype: 'entradagrid',
                    margins: '5',
                    width: 460,
                }]
            }]
        });

        this.callParent(arguments);
    }
 });