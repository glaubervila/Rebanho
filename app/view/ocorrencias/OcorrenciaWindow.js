Ext.define('Rebanho.view.ocorrencias.OcorrenciaWindow' ,{
    extend: 'Ext.window.Window',

    requires:[ ],

    alias : 'widget.ocorrenciawindow',

    title: 'Lançamento de Ocorrencia',

    layout: 'fit',

    autoShow: true,

    resizable:false,

    width: 400,

    height: 340,

    iconCls: 'icon-application_form',
 
    modal: true,

    initComponent: function() {

        var me = this;

        Ext.applyIf(me, {

            items: [{
                xtype:'ocorrenciaform',
            }]
        });

        this.callParent(arguments);
    },

 }); 
