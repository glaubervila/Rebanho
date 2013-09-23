Ext.define('Rebanho.view.relatorios.RelatoriosForm' ,{
    extend: 'Ext.form.Panel',

    requires:[],
    alias : 'widget.relatoriosform',

    //bodyStyle:'padding:5px;',

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
                //bodyStyle:'padding:4px',
            },
            items:[{
                xtype: 'fieldset',
                title: 'Filtros',
                defaultType:'textfield',
                defaults: {
                    anchor: '-5',
                },
                items:[{
                    name: 'id',
                    hidden: true,
                },{
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    defaultType:'textfield',
                    fieldDefaults: {
                        labelAlign: 'top',
                    },
                    items:[{
                        xtype:'cmbconfinamento',
                        itemId:'relatorios_cmbConfinamento',
                        fieldLabel:'Confinamento',
                        name: 'confinamento_id',
                        flex: 1,
                    },{
                        xtype:'combobox',
                        fieldLabel:'Status',
                        name: 'status',
                        width: 60,
                        margins: '0 0 0 5',
                        typeAhead: true,
                        triggerAction: 'all',
                        value: '1',
                        store: [
                            ['-1','Todos'],
                            ['0','Inativo'],
                            ['1','Ativo'],
                        ],
                        flex: 1,
                    }]
                },{
                    xtype: 'triggerfieldfornecedores',
                    fieldLabel:'Forncedor',
                    name: 'fornecedor_id',
                    itemId: 'relatorios_cmbFornecedores',
                    flex: 1,
                    lastQuery:'',
                    disabled: true,
                }
                ,{
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
                        itemId:'relatorios_cmbQuadras',
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
                    }]
                }]
            },{
                xtype: 'fieldset',
                defaultType:'textfield',
                defaults: {
                    anchor: '-5',
                },
                items:[{
                    xtype:'combobox',
                    name: 'group_by',
                    typeAhead: true,
                    triggerAction: 'all',
                    value: '',
                    store: [
                        ['','Não Agrupar'],
                        ['compra_id','Lotes de Compra'],
                    ]
                }]
            }],
            // Barra e Menus
            bbar:{
                items:['->',{
                    xtype: 'button',
                    text: 'Gerar Relatório',
                    action: 'action_relatorio',
                    iconCls: 'icon-disk',
                    tooltip: 'Click para <font color="blue"><b>Gerar um Relatório</b></font> as Informações que representão o filtro.'
                }]
            }

        });

        this.callParent(arguments);

    }
 }); 