Ext.define('Rebanho.view.compras.animais.EntradaAnimaisGrid' ,{
    extend: 'Ext.grid.Panel',

    requires: [
        'Ext.ux.grid.column.ActionButtonColumn',
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
            },
            {
                text: "Peso Entrada",
                dataIndex: 'peso_entrada',
                sortable: true,
                width: 200,
            },
            {
                text: "Sexo",
                dataIndex: 'sexo',
                sortable: true,
                width: 50,
                field: {
                    xtype: 'textfield',
                },
            },
            {
                text: "Quadra",
                dataIndex: 'quadra_id',
                width: 150,
                renderer: this.rendererQuadra,
                field: {
                    xtype: 'cmbquadras',
                },
            },

        ];

        this.dockedItems= [{
            xtype: 'toolbar',
            items: [
                {
                    xtype: 'button',
                    text: 'Pesar',
                    action: 'action_pesar',
                    iconCls: 'icon-scale-16',
                    tooltip: 'Click para Iniciar a Pesagem. a Janela de Codigo será exibida<br>após digitar o codigo, digite o Peso.'
                },
                {
                    xtype: 'button',
                    text: 'Digitar Código',
                    action: 'action_codigo',
                    iconCls: 'icon-barcode-16',
                    enableToggle: true,
                    tooltip: 'Click para Digitar o Código do Animal antes do Peso. a Janela de Codigo será exibida<br>Digite o Codigo e após digite o Peso.<br>Se estiver desativada está opção aparecerá a janela de peso seguindo a ordem dos códigos dos animais'
                },
//                 {
//                     xtype: 'datefield',
//                     itemId: 'dtfDataEntrada',
//                     fieldLabel:'Data de Entrada',
//                     name: 'data_entrada',
//                     allowBlank: false,
//                     format: 'd/m/y',
//                     submitFormat: 'Y-m-d',
//                 },
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
            ]
        }]


        this.callParent(arguments);
    },

    rendererQuadra:function(value, obj, record){
        return record.get('quadra');
    }
 }); 
