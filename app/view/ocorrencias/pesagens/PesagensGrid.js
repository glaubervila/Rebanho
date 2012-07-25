Ext.define('Rebanho.view.ocorrencias.pesagens.PesagensGrid' ,{
    extend: 'Ext.grid.Panel',

    requires: [ ],

    alias : 'widget.pesagensgrid',

    title: 'Pesagens de Animais',

    loadMask: true,

    iconCls: 'icon-grid',

    initComponent: function() {

        this.store = 'Pesagens';

        this.columns = [
            Ext.create('Ext.grid.RowNumberer'),
            {
                dataIndex: 'icone',
                width: 38,
            },
            {
                text: "Confinamento",
                dataIndex: 'confinamento_id',
                hidden: true,
            },
            {
                text: "Identificação",
                dataIndex: 'id',
                width: 200,
            },
            {
                text: "peso",
                dataIndex: 'peso',
                sortable: true,
                width: 100,
            },
            {
                text: "Sexo",
                dataIndex: 'sexo',
                sortable: true,
                width: 50,
            },
            {
                text: "quadra",
                dataIndex: 'quadra',
                sortable: true,
                flex:true,
            },

        ];

        this.dockedItems= [{
            xtype: 'toolbar',
            items: [
                // Combo Box Confinamentos
                {
                    xtype:'cmbconfinamento',
                    itemId   :'confinamento',
                },
                {
                    xtype: 'button',
                    text: 'Pesar',
                    itemId: 'btnPesar',
                    action: 'action_pesar',
                    iconCls: 'icon-scale-16',
                    tooltip: 'Click para Iniciar a Pesagem. a Janela de Codigo será exibida<br>após digitar o codigo, digite o Peso.',
                    disabled: true,
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
                {xtype: 'tbtext', itemId: 'tbpesados',text: '<b>Pesados:</b>'},
                '-',
                {xtype: 'tbtext', itemId: 'tbpesototal',text: '<b>Peso Total:</b>'},
                {xtype: 'tbtext', itemId: 'tbpesomedio',text: '<b>Peso Médio:</b>'},
                '-',
            ]
        }]


        this.callParent(arguments);
    },

 }); 
