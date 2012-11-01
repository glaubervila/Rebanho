Ext.define('Rebanho.view.animais.AnimaisEstatisticasPanel' ,{
    extend: 'Ext.form.Panel',

    requires:[
        'Ext.chart.*',
        'Ext.chart.axis.Gauge',
        'Ext.chart.series.*',
    ],
    
    alias : 'widget.animaisestatisticas',

    iconCls: 'icon-application_form',

    layout: 'fit',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 100,
            },
            // Items do FormPanel Principal
            items:[{
                xtype: 'fieldset',
                title: 'Estatísticas do Animal',
                items: [{
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    fieldDefaults: {
                        labelAlign: 'top',
                    },
                    items:[{
                        xtype:'textfield',
                        fieldLabel:'Neste Conf.',
                        name: 'dias_confinamento',
                        //width: 80,
                        flex: 1,
                        margins: '0 0 0 5',
                        readOnly: true,
                    },{
                        xtype:'datefield',
                        fieldLabel:'Pesagem',
                        name: 'data_ultima_pesagem',
                        //width: 100,
                        flex: 1,
                        margins: '0 0 0 5',
                        readOnly: true,
                    },{
                        xtype:'textfield',
                        fieldLabel:'Peso',
                        name: 'peso_atual',
                        //width: 100,
                        flex: 1,
                        margins: '0 0 0 5',
                        readOnly: true,
                    },{
                        xtype:'textfield',
                        fieldLabel:'Peso Ganho',
                        name: 'peso_ganho',
                        //width: 100,
                        flex: 1,
                        margins: '0 0 0 5',
                        readOnly: true,
                    },{
                        xtype:'textfield',
                        fieldLabel:'Diário',
                        name: 'ganho_diario',
                        //width: 100,
                        flex: 1,
                        margins: '0 0 0 5',
                        readOnly: true,
                    }]
                }]
            // FIM fieldset Estatisticas
            }]
        });

        this.callParent(arguments);
    }
 });
            