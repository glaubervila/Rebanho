Ext.define('Rebanho.view.transferencias.TransferenciasReportForm' ,{
    extend: 'Ext.form.Panel',

    requires:[

    ],
    alias : 'widget.transferenciasreportform',

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
                    xtype:'cmbconfinamento',
                    fieldLabel:'Confinamento',
                    itemId: 'cmbConfinamento',
                    name: 'confinamento_id',
                    flex: 1,
                },{
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
                    xtype:'combobox',
                    fieldLabel:'Tipo de Transferência',
                    name: 'tipo_relatorio',
                    width: 100,
                    margins: '0 0 0 5',
                    typeAhead: true,
                    triggerAction: 'all',
                    value: '0',
                    store: [
                        ['0','Entrada'],
                        ['1','Entrada / Resumido'],
                        ['2','Saida'],
                        ['3','Saida / Resumido'],
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