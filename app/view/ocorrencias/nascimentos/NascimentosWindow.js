Ext.define('Rebanho.view.ocorrencias.nascimentos.NascimentosWindow' ,{
    extend: 'Ext.window.Window',

    requires:[ ],

    alias : 'widget.nascimentoswindow',

    title: 'Cadastro de Nascimento',

    layout: 'fit',

    autoShow: true,

    resizable:false,

    width: 400,

    height: 400,

    iconCls: 'icon-application_form',
 
    modal: true,

    initComponent: function() {

        var me = this;

        Ext.applyIf(me, {

            items: [{
                xtype:'nascimentosform',
            }]
        });

        this.callParent(arguments);
    },

 }); 
