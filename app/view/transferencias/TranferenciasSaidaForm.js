Ext.define('Rebanho.view.tranferencias.TransferenciasSaidaForm' ,{
    extend: 'Ext.form.Panel',

    requires:[
    ],
    alias : 'widget.transferenciassaidaform',

    bodyStyle:'padding:5px;',

    iconCls: 'icon-application_form',

    layout:'column',

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
                // Coluna 1
                columnWidth:0.6,
                border:false,
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
                        xtype:'cmbconfinamento',
                        fieldLabel:'Confinamento',
                        name: 'confinamento_id',
                    },{
                        fieldLabel:'Nome',
                        name: 'nome',
                        flex: 1,
                        allowBlank: false,
                        maxLength: 150,
                    },{
                        fieldLabel:'Fazenda',
                        name: 'fazenda',
                        flex: 1,
                        maxLength: 150,
                    },{
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        defaultType:'textfield',
                        fieldDefaults: {
                            labelAlign: 'top',
                        },
                        items:[{
                            fieldLabel:'CNPJ/CPF',
                            name: 'cnpj_cpf',
                            flex: 1,
                            allowBlank: false,
                            minLength: 11,
                            maxLength: 20,
                        },{
                            fieldLabel:'IE/RG',
                            name: 'ie_rg',
                            margins: '0 0 0 5',
                            flex: 1,
                            maxLength: 20,
                        }]
                    },]
                },{
                    xtype: 'fieldset',
                    items:[{
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    defaultType:'textfield',
                    fieldDefaults: {
                        labelAlign: 'top',
                    },
                    items:[{
                            fieldLabel:'Logradouro',
                            name: 'logradouro',
                            flex: 1,
                            maxLength: 150,
                        },{
                            fieldLabel:'Número',
                            name: 'numero',
                            margins: '0 0 0 5',
                            width: 80,
                            maxLength: 10,
                        }]
                    },{
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    defaultType:'textfield',
                    fieldDefaults: {
                        labelAlign: 'top',
                    },
                    items:[{
                            fieldLabel:'Municipio',
                            name: 'municipio',
                            flex: 1,
                            maxLength: 45,
                        },{
                            fieldLabel:'CEP',
                            name: 'cep',
                            margins: '0 0 0 5',
                            width: 80,
                            maxLength: 10,
                        }]
                    },{
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        defaultType:'textfield',
                        fieldDefaults: {
                            labelAlign: 'top',
                        },
                        items:[{
                            fieldLabel:'Complemento',
                            name: 'complemento',
                            flex: 1,
                            maxLength: 45,
                        },{
                            xtype: 'combobox',
                            fieldLabel:'Estado',
                            name: 'uf',
                            margins: '0 0 0 5',
                            width: 80,
                            store: 'Estados',
                            valueField: 'uf',
                            displayField: 'uf',
                        }]
                    }]
                }],
            }
            // Coluna 2
            ,{
                columnWidth:0.4,
                border:false,
                items:[{
                    xtype: 'fieldset',
                    defaultType:'textfield',
                    defaults: {
                        anchor: '-5',
                    },
                    items:[{
                        fieldLabel:'E-mail',
                        name: 'email',
                        vtype: 'email',
                    },{
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        defaultType:'textfield',
                        fieldDefaults: {
                            labelAlign: 'top',
                        },
                        items:[{
                            fieldLabel:'Telefone',
                            name: 'telefone',
                            flex: 1,
                            minLength: 8,
                            maxLength: 15,
                        },{
                            fieldLabel:'Telefone 2',
                            name: 'telefone2',
                            margins: '0 0 0 5',
                            flex: 1,
                            minLength: 8,
                            maxLength: 15,
                        }]
                    },
                    {
                        fieldLabel:'Corretor',
                        name: 'corretor',
                        maxLength: 45,
                        anchor: '-5',
                    },
                    {
                        xtype: 'textarea',
                        fieldLabel:'Observação',
                        name: 'observacao',
                        maxLength: 250,
                        anchor: '-5',
                    }],
                }]
            }],
            // Barra e Menus
            tbar:{
                items:[{
                    xtype: 'button',
                    text: 'Novo',
                    action: 'action_novo',
                    iconCls: 'icon-add',
                },{
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