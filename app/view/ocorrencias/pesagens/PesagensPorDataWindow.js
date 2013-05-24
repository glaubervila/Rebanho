Ext.define('Rebanho.view.ocorrencias.pesagens.PesagensPorDataWindow' ,{
    extend: 'Ext.window.Window',

    requires:[ ],

    alias : 'widget.pesagenspordata',

    title: 'Relatório de Pesagens Por Data',

    layout: 'fit',

    autoShow: true,

    resizable:false,

    width: 400,

    height: 340,

    modal: true,

    initComponent: function() {

        var me = this;

        Ext.applyIf(me, {

            items: [
                Ext.create('Ext.form.Panel',{
                    fieldDefaults: {
                        labelAlign: 'top',
                        labelWidth: 100,
                    },
                    layout:'form',
                    bodyStyle:'padding:4px',
                    items:[{
                        xtype: 'fieldset',
                        defaults: {
                            anchor: '-5',
                        },
                        items:[{
                            xtype: 'textfield',
                            fieldLabel:'Fornecedor',
                            name: 'fornecedor_nome',
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel:'Fazenda',
                            name: 'fornecedor_fazenda',
                        }]
                    }]
                })
            ]
            , buttons:[{
                text: 'Limpar',
                iconCls: 'icon-cancel',
                scope: this,
                handler: function(button){
                    var form = this.down('form').getForm().reset();
                },
            }]
        });

        this.callParent(arguments);
    },

 }); 
