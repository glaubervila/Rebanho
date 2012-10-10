Ext.define('Rebanho.view.transferencias.TransferenciasWindow' ,{
    extend: 'Ext.window.Window',

    alias : 'widget.transferenciaswindow',

    title: 'Cadastro de Transferências - Saída',

    layout: 'fit',

    autoShow: true,

    width: 600,

    height: 400,

    iconCls: 'icon-control_fastforward_blue',

    initComponent: function() {

        var me = this;

        Ext.applyIf(me, {

            items: [
                //Ext.widget('fornecedoresform'),
            ]
        });

        this.callParent(arguments);
    }
 });