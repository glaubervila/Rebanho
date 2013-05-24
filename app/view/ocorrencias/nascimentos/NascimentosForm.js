Ext.define('Rebanho.view.ocorrencias.nascimentos.NascimentosForm' ,{
    extend: 'Ext.form.Panel',

    requires:[
        'Rebanho.view.cadastros.quadras.QuadrasCombo',
    ],
    alias : 'widget.nascimentosform',

    bodyStyle:'padding:5px;',

    iconCls: 'icon-application_form',

    layout:'form',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {

            defaultType:'textfield',
            fieldDefaults: {
                labelAlign: 'top',
            },
            items:[{
                xtype: 'fieldset',
                defaultType:'textfield',
                items:[{
                    name: 'animal_id',
                    hidden: true,
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
                        itemId: 'confinamento',
                        width: 200,
                    },{
                        xtype: 'datefield',
                        fieldLabel:'Data de Nascimentos',
                        name: 'data_nascimento',
                        format: 'd/m/y',
                        submitFormat: 'Y-m-d',
                        flex:1,
                        allowBlank: false,
                        margins: '0 0 0 5',
                    }]

                }]
            },{
                xtype: 'fieldset',
                layout: 'hbox',
                items:[{
                    xtype: 'numberfield',
                    fieldLabel:'Mãe',
                    name: 'codigo_mae',
                    minValue: 0,
                    hideTrigger: true,
                    flex: 1,
                    allowBlank: false,
                },{
                    xtype: 'numberfield',
                    fieldLabel:'Pai',
                    name: 'codigo_pai',
                    minValue: 0,
                    hideTrigger: true,
                    flex: 1,
                    margins: '0 0 0 5',
                },{
                    xtype: 'numberfield',
                    fieldLabel:'Código',
                    name: 'codigo',
                    minValue: 0,
                    keyNavEnabled: false,
                    mouseWheelEnabled: false,
                    hideTrigger: true,
                    flex: 1,
                    margins: '0 0 0 5',
                    allowBlank: false,
                }]
            },{
                xtype: 'fieldset',
                layout: 'hbox',
                items:[{
                    xtype:'cmbcaracteristicas',
                    fieldLabel:'Caracteristica',
                    name: 'caracteristica_id',
                    flex: 1,
                    allowBlank: false,
                },{
                    xtype:'combobox',
                    fieldLabel:'Sexo',
                    name: 'sexo',
                    width: 50,
                    margins: '0 0 0 5',
                    typeAhead: true,
                    triggerAction: 'all',
                    selectOnTab: true,
                    store: [
                        ['F','F'],
                        ['M','M'],
                    ],
                    allowBlank: false,
                }]
            },{
                xtype: 'fieldset',
                layout: 'hbox',
                items:[{
                    xtype: 'numberfield',
                    fieldLabel:'Peso',
                    name: 'peso',
                    minValue: 0,
                    maxValue: 999,
                    hideTrigger: true,
                    keyNavEnabled: false,
                    mouseWheelEnabled: false,
                    flex: 1,
                    margins: '0 0 0 5',
                },{
                    xtype:'cmbquadras',
                    fieldLabel:'Quadra Destino',
                    name: 'quadra_id',
                    flex: 2,
                    margins: '0 0 0 5',
                    allowBlank: false,
                }]
            }]
            , buttons:[{
                text: 'Limpar',
                iconCls: 'icon-cancel',
                scope: this,
                handler: function(button){
                    var form = this.getForm().reset();
                }
            },{
                text: 'Salvar',
                iconCls: 'icon-disk',
                scope: this,
                itemId: 'btnSalvar',
                action: 'action_salvar',
            }]

        });

        this.callParent(arguments);
    }
 }); 