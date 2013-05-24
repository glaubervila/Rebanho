Ext.define('Rebanho.view.compras.animais.ComprasReportForm' ,{
    extend: 'Ext.form.Panel',

    requires:[

    ],
    alias : 'widget.comprasreportform',

    iconCls: 'icon-application_form',

    layout: 'form',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 80,
            },
            // Items do FormPanel Principal
            items:[{
                xtype: 'fieldset',
                layout: 'form',
                items: [{
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    defaultType:'textfield',
                    fieldDefaults: {
                        labelAlign: 'top',
                    },
                    items:[{
                        xtype: 'datefield',
                        fieldLabel:'Data Inicial',
                        name: 'data_inicial',
                        format: 'd/m/y',
                        submitFormat: 'Y-m-d',
                        flex:1,
                        allowBlank: false,
                    },{
                        xtype: 'datefield',
                        fieldLabel:'Data Final',
                        name: 'data_final',
                        format: 'd/m/y',
                        submitFormat: 'Y-m-d',
                        flex:1,
                        margins: '0 0 0 5',
                        allowBlank: false,
                    }]
                },{
                    xtype: 'triggerfieldfornecedores',
                    fieldLabel:'Forncedor',
                    name: 'fornecedor_id',
                    itemId: 'cmbFornecedores',
                    flex: 1,
                    lastQuery:'',
                },{
                    xtype:'combobox',
                    fieldLabel:'Tipo de Lotes',
                    name: 'tipo_relatorio',
                    width: 100,
                    margins: '0 0 0 5',
                    typeAhead: true,
                    triggerAction: 'all',
                    value: '0',
                    store: [
                        ['0','Ativos'],
                        //['1','Encerrados'],
                        //['2','Todos'],
                    ],
                    flex: 1,
                }]
            }]
            , bbar:{
                items:['->',{
                    xtype: 'button',
                    text: 'Gerar Relatorio',
                    action: 'action_report',
                    iconCls: 'icon-report_32x32',
                    scale: 'large'
                }]
            }
        });

        this.callParent(arguments);
    }
});