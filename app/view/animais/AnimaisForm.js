Ext.define('Rebanho.view.animais.AnimaisForm' ,{
    extend: 'Ext.form.Panel',

    requires:[
        'Rebanho.view.cadastros.confinamentos.ConfinamentosCombo',
        'Rebanho.view.cadastros.caracteristicas.CaracteristicasCombo',
        'Rebanho.view.cadastros.quadras.QuadrasCombo',
        'Rebanho.view.compras.fornecedores.FornecedoresTriggerField',
        'Ext.ux.form.FieldMoney',
        'Ext.ux.form.fieldstarrating.FieldStarRating',
    ],
    alias : 'widget.animaisform',

    iconCls: 'icon-application_form',

    layout: 'fit',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 100,
            },
            items:[{
                xtype:'tabpanel',
                activeTab: 0,
                border: false,
                items:[{
                    title    : 'Informa&ccedil;&otilde;es do Animal',
                    border :false,
                    bodyStyle:'padding:10px',
                    layout: 'form',
                    tbar:{
                        items:[
                        {
//                             xtype: 'button',
//                             text: 'TESTE',
//                             action: 'action_cancelar',
//                             iconCls: 'icon-cancel',
//                             tooltip: 'Click para <font color="red"><b>Abandonar</b></font> a Janela de Cadastro<br>Nenhuma informação será Gravada e o Cadastro será Fechado.'
                        }]
                    },
                    items:[{
                        xtype: 'fieldset',
                        title: 'Dados do Animal',
                        items: [{
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            fieldDefaults: {
                                labelAlign: 'top',
                            },
                            items:[{
                                xtype:'textfield',
                                fieldLabel:'Codigo Atual',
                                name: 'codigo',
                                width: 200,
                            },{
                                xtype:'textfield',
                                fieldLabel:'SisBov',
                                name: 'sisbov',
                                width: 200,
                                margins: '0 0 0 5',
                            },{
                                xtype:'combobox',
                                fieldLabel:'Status',
                                name: 'status',
                                width: 100,
                                margins: '0 0 0 5',
                            }]
                        },{
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            fieldDefaults: {
                                labelAlign: 'top',
                            },
                            items:[{
                                xtype:'cmbconfinamento',
                                fieldLabel:'Confinamento',
                                name: 'confinamento_id',
                                width: 200,
                            },{
                                xtype:'cmbcaracteristicas',
                                fieldLabel:'Caracteristica',
                                name: 'caracteristica_id',
                                margins: '0 0 0 5',
                                width: 250,
                            },{
                                xtype:'textfield',
                                fieldLabel:'Sexo',
                                name: 'sexo',
                                width: 50,
                                margins: '0 0 0 5',
                            }]
                        },{
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            fieldDefaults: {
                                labelAlign: 'top',
                            },
                            items:[{
                                xtype:'cmbquadras',
                                fieldLabel:'Quadra',
                                name: 'quadra_id',
                                width: 190,
                            },{
                                fieldLabel : 'Classificação',
                                xtype : 'ratingfield',
                                name  : 'classificacao',
                                value : 'Regular',
                                items : ['Pessima', 'Ruim', 'Regular', 'Boa', 'Otima'],
                                margins: '0 0 0 5',
                                width: 130,
                            },{
                                fieldLabel : 'Escore',
                                xtype : 'ratingfield',
                                name  : 'escore',
                                value : 3,
                                items : [1, 2, 3, 4, 5],
                                margins: '0 0 0 5',
                                width: 130,
                            },{
                                xtype:'textfield',
                                fieldLabel:'Idade',
                                name: 'quadra_id',
                                width: 50,
                            }]
                        }]
                    },{
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
                                width: 100,
                                margins: '0 0 0 5',
                            },{
                                xtype:'datefield',
                                fieldLabel:'Ultima Pesagem',
                                name: 'data_ultima_pesagem',
                                width: 100,
                                margins: '0 0 0 5',
                            },{
                                xtype:'textfield',
                                fieldLabel:'Peso Recente',
                                name: 'peso_atual',
                                width: 100,
                                margins: '0 0 0 5',
                            },{
                                xtype:'textfield',
                                fieldLabel:'Peso Ganho',
                                name: 'peso_ganho',
                                width: 100,
                                margins: '0 0 0 5',
                            },{
                                xtype:'textfield',
                                fieldLabel:'Ganho Diário',
                                name: 'ganho_diario',
                                width: 100,
                                margins: '0 0 0 5',
                            }]
                        }]
                    },{
                        xtype: 'fieldset',
                        title: 'Dados da Compra',
                        items: [{
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            fieldDefaults: {
                                labelAlign: 'top',
                            },
                            items:[{
                                xtype:'triggerfieldfornecedores',
                                fieldLabel:'Fornecedor',
                                name: 'fornecedor',
                                width: 300,
                            },{
                                xtype:'datefield',
                                fieldLabel:'Data Entrada',
                                name: 'data_entrada',
                                width: 100,
                                margins: '0 0 0 5',
                            },{
                                xtype:'textfield',
                                fieldLabel:'Idade Entrada',
                                name: 'idade',
                                width: 100,
                                margins: '0 0 0 5',
                            }]
                        },{
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            fieldDefaults: {
                                labelAlign: 'top',
                            },
                            items:[{
                                xtype:'textfield',
                                fieldLabel:'Nota Fiscal',
                                name: 'nota',
                                width: 100,
                            },{
                                xtype:'textfield',
                                fieldLabel:'Serie',
                                name: 'serie',
                                width: 100,
                                margins: '0 0 0 5',
                            },{
                                xtype: 'field-money',
                                fieldLabel:'Valor Arroba',
                                name: 'data_entrada',
                                width: 100,
                                margins: '0 0 0 5',
                            },{
                                xtype:'textfield',
                                fieldLabel:'Peso Entrada',
                                name: 'peso_entrada',
                                width: 100,
                                margins: '0 0 0 5',
                            }]
                        }]
                    }]
                },
                {
                    title    : 'Pesagens',
                    border :false,
                    bodyStyle:'padding:10px',
                    items:[{
                        xtype:'textfield',
                        fieldLabel:'Confinamento',
                        name: 'confinamento_id',
                    }]
                }]
            }],
            // Barra e Menus
            bbar:{
                items:[
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


// ,{
//{
//                         xtype:'textfield',
//                         fieldLabel:'Quadra',
//                         name: 'quadra',
//                     },{
//                         xtype:'textfield',
//                         fieldLabel:'SisBov',
//                         name: 'caracteristica_id',
//                     },{
//                         xtype:'textfield',
//                         fieldLabel:'Idade',
//                         name: 'caracteristica_id',
//                     }]