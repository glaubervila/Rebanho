Ext.define('Rebanho.view.compras.animais.EntradaAnimaisGrid' ,{
    extend: 'Ext.grid.Panel',

    requires: [
        'Ext.grid.plugin.RowEditing',
    ],

    alias : 'widget.entradaanimaisgrid',

    loadMask: true,

    iconCls: 'icon-grid',

    initComponent: function() {

        this.store = 'EntradaAnimais';

        // RowEdit Plugin
        this.plugins= [
            Ext.create('Ext.grid.plugin.CellEditing',{
                triggerEvent: 'cellclick',
                clicksToEdit: 1,
            }),
        ],


        this.columns = [
            Ext.create('Ext.grid.RowNumberer'),
            {
                dataIndex: 'icone',
                width: 38,
            },
            {
                text: "Identificação",
                dataIndex: 'codigo',
                width: 200,
                field: {
                    xtype: 'numberfield',
                    minValue: 0,
                    allowBlank: false,
                    hideTrigger: true,
                    keyNavEnabled: false,
                    mouseWheelEnabled: false
                },
            },
            {
                text: "Peso Entrada",
                dataIndex: 'peso_entrada',
                width: 200,
                field: {
                    xtype: 'numberfield',
                    allowBlank: false,
                    minValue: 0,
                    maxValue: 999,
                    hideTrigger: true,
                    keyNavEnabled: false,
                    mouseWheelEnabled: false
                },
            },
            {
                text: "Sexo",
                dataIndex: 'sexo',
                sortable: true,
                width: 50,
                editor: new Ext.form.field.ComboBox({
                    typeAhead: true,
                    triggerAction: 'all',
                    selectOnTab: true,
                    store: [
                        ['F','F'],
                        ['M','M'],
                    ],
                })
            },
            {
                text: "Quadra",
                dataIndex: 'quadra_id',
                width: 150,
                renderer: this.rendererQuadra,
                editor:{
                    xtype: 'cmbquadras',
                },
            },

        ];

        this.dockedItems= [{
            xtype: 'toolbar',
            items: [
                {
                    xtype: 'button',
                    text: 'Salvar',
                    itemId: 'btnSalvar',
                    action: 'action_salvar',
                    iconCls: 'icon-disk',
                    tooltip: 'Click para Salvar a Pesagem.<br>',
                },
                '-',
                {
                    xtype: 'button',
                    text: 'Finalizar Pesagem',
                    itemId: 'btnFinalizar',
                    action: 'action_finalizar',
                    iconCls: 'icon-tick',
                    tooltip: 'Click para Finalizar a Pesagem.<br>Após Finalizar Nenhuma alteração poderá ser feita.',
                    disabled: true,
                },
                '-',
                // Contadores
                {xtype: 'tbtext', itemId: 'tbquantidade',text: '<b>Quantidade</b>'},
                {xtype: 'tbtext', itemId: 'tbpesados',text: '<b>Pesados</b>'},
                {xtype: 'tbtext', itemId: 'tbfalta',text: '<b>Faltam</b>'},
                '-',
                {xtype: 'tbtext', itemId: 'tbpesototal',text: '<b>Peso Total</b>'},
                {xtype: 'tbtext', itemId: 'tbpesomedio',text: '<b>Peso Médio</b>'},
                '-',
/*                {xtype: 'tbtext', itemId: 'tbautosave',text: ''},
                '-',*/
            ],
        }]


        this.callParent(arguments);
    },

    rendererQuadra:function(value, obj, record){
        return record.get('quadra');
    }
 }); 
