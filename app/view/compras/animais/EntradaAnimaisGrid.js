Ext.define('Rebanho.view.compras.animais.EntradaAnimaisGrid' ,{
    extend: 'Ext.grid.Panel',

    requires: [
        'Ext.ux.grid.column.ActionButtonColumn',
    ],

    alias : 'widget.entradaanimaisgrid',

    loadMask: true,

    iconCls: 'icon-grid',

    initComponent: function() {

        this.store = 'EntradaAnimais';


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
                //flex:true,
                width: 200,
            },
            {
                text: "Sexo",
                dataIndex: 'sexo',
                sortable: true,
                //flex:true,
                width: 50,
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

 }); 
