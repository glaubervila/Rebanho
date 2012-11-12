Ext.define('Rebanho.view.cadastros.vacinas.VacinasForm' ,{
    extend: 'Ext.form.Panel',

    requires:[
        'Rebanho.view.cadastros.confinamentos.ConfinamentosCombo',
    ],
    alias : 'widget.vacinasform',

    bodyStyle:'padding:5px;',

    iconCls: 'icon-pill',

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
                xtype: 'fieldset',
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
                        fieldLabel:'Confinamento',
                        name: 'confinamento_id',
                        flex: 1,
                    },{
                        xtype:'combobox',
                        fieldLabel:'Status',
                        name: 'status',
                        width: 100,
                        margins: '0 0 0 5',
                        typeAhead: true,
                        triggerAction: 'all',
                        value: '1',
                        store: [
                            ['0','Inativo'],
                            ['1','Ativo'],
                        ],
                        flex: 1,
                    }]
                },{
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    defaultType:'textfield',
                    fieldDefaults: {
                        labelAlign: 'top',
                    },
                    items:[{
                        fieldLabel:'Nome',
                        name: 'nome',
                        flex: 1,
                        allowBlank: false,
                        maxLength: 45,
                    },{
                        fieldLabel:'Laboratório',
                        name: 'laboratorio',
                        flex: 1,
                        maxLength: 45,
                        margins: '0 0 0 5',
                    }]
                },{
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    defaultType:'textfield',
                    fieldDefaults: {
                        labelAlign: 'top',
                    },
                    items:[{
                        fieldLabel:'Lote',
                        name: 'lote',
                        flex: 1,
                        allowBlank: false,
                        maxLength: 10,
                    },{
                        fieldLabel:'Fabricação',
                        name: 'fabricacao',
                        flex: 1,
                        allowBlank: false,
                        margins: '0 0 0 5',
                        maxLength: 10,
                    },{
                        fieldLabel:'Validade',
                        name: 'validade',
                        margins: '0 0 0 5',
                        flex: 1,
                        maxLength: 10,
                    }]
                }]
            //}]

            }],
            // Barra e Menus
            tbar:{
                items:[{
                    xtype: 'button',
                    text: 'Excluir',
                    action: 'action_excluir_form',
                    iconCls: 'icon-cross',
                },{
                    xtype: 'button',
                    text: 'Salvar',
                    action: 'action_salvar',
                    iconCls: 'icon-disk',
                    tooltip: 'Click para <font color="blue"><b>Salvar</b></font> as Informações.'
                },
                '->',
                {
                    xtype: 'button',
                    text: 'Cancelar',
                    action: 'action_cancelar',
                    iconCls: 'icon-cancel',
                    tooltip: 'Click para <font color="red"><b>Abandonar</b></font> a Janela de Cadastro<br>Nenhuma informação será Gravada e o Cadastro será Fechado.'
                }]
            }

        });

        this.callParent(arguments);

    }
 }); 