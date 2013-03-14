Ext.define('Rebanho.view.ocorrencias.pesagens.PesagensReportForm' ,{
    extend: 'Ext.form.Panel',

    requires:[],
    alias : 'widget.pesagensreportform',

    bodyStyle:'padding:5px;',

    //iconCls: 'icon-pill',

    layout:'form',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {

            defaultType:'textfield',
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 100,
            },
            defaults:{
                layout:'form',
                bodyStyle:'padding:4px',
            },
            items:[{
                border :false,
                bodyStyle:'padding:4px;',
                layout:'column',
                items:[{
                    // Coluna 1
                    columnWidth:0.5,
                    border:false,
                    items:[{
                        xtype: 'fieldset',
                        defaultType:'textfield',
                        title: 'Tipo Relátorio',
                        defaults: {
                            anchor: '-5',
                        },
                        items:[{
                            xtype:'cmbconfinamento',
                            itemId: 'cmbConfinamento',
                            fieldLabel:'Confinamento',
                            name: 'confinamento_id',
                            flex: 1,
                        },{
                            xtype:'combobox',
                            fieldLabel:'Tipo de Relatório',
                            name: 'tipo_relatorio',
                            width: 100,
                            margins: '0 0 0 5',
                            typeAhead: true,
                            triggerAction: 'all',
                            value: '0',
                            store: [
                                //['0','Pesagens / '],
                                ['1','Pesagens / Individual'],
                                ['2','Resumo por Confinamento'],
                            ],
                            flex: 1,
                        }]
                    }]
                },{
                    // Coluna 2
                    columnWidth:0.5,
                    border:false,
                    items:[{
                        xtype: 'fieldset',
                        defaultType:'textfield',
                        title: 'Filtros',
                        defaults: {
                            anchor: '-5',
                        },
                        items:[{
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
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            defaultType:'textfield',
                            fieldDefaults: {
                                labelAlign: 'top',
                            },
                            items:[{
                                xtype:'cmbquadras',
                                fieldLabel:'Quadra',
                                name: 'quadra_id',
                                flex: 1,
                            },{
                                xtype:'combobox',
                                fieldLabel:'Sexo',
                                name: 'sexo',
                                width: 60,
                                margins: '0 0 0 5',
                                typeAhead: true,
                                triggerAction: 'all',
                                value: '0',
                                store: [
                                    ['0',''],
                                    ['M','M'],
                                    ['F','F'],
                                ]
                            }]
                        },{
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            items:[{
                                xtype: 'fieldcontainer',
                                fieldLabel: 'Peso',
                                labelAlign: 'top',
                                layout: 'hbox',
                                flex:1,
                                defaults: {
                                    hideLabel: true
                                },
                                items:[{
                                    xtype:'combobox',
                                    name: 'peso_comparacao',
                                    width: 40,
                                    typeAhead: true,
                                    triggerAction: 'all',
                                    value: '0',
                                    store: [
                                        ['0',''],
                                        ['=','='],
                                        ['<=','<='],
                                        ['>=','>='],
                                    ]
                                },{
                                    xtype:'textfield',
                                    fieldLabel:'',
                                    name: 'peso',
                                    //width: 40,
                                    flex: 1,
                                    margins: '0 0 0 5',
                                }]
                            }
/*                            ,{
                                xtype: 'fieldcontainer',
                                fieldLabel: 'Idade',
                                layout: 'hbox',
                                labelAlign: 'top',
                                border: true,
                                flex: 1,
                                defaults: {
                                    hideLabel: true
                                },
                                items:[{
                                    xtype:'combobox',
                                    name: 'idade_comparacao',
                                    width: 40,
                                    typeAhead: true,
                                    triggerAction: 'all',
                                    value: '0',
                                    store: [
                                        ['0',''],
                                        ['=','='],
                                        ['<=','<='],
                                        ['=>','>='],
                                    ]
                                },{
                                    xtype:'textfield',
                                    fieldLabel:'',
                                    name: 'idade',
                                    //width: 60,
                                    flex: 1,
                                    margins: '0 0 0 5',
                                }]
                            }*/]
                        }]
                    }]
                }]
            }],
            // Barra e Menus
            bbar:{
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