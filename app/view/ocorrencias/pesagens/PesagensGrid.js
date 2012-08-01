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
                printAble: false,
            },
            {
                text: "Confinamento",
                dataIndex: 'confinamento_id',
                hidden: true,
            },
            {
                text: "Identificação",
                dataIndex: 'codigo',
                width: 200,
            },
            {
                text: "Peso",
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
                text: "Quadra",
                dataIndex: 'quadra',
                sortable: true,
                flex:true,
            },
            {
                text: "Idade",
                dataIndex: 'idade',
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
                    text: 'Relatório',
                    itemId: 'btnRelatorio',
                    action: 'action_relatorio',
                    iconCls: 'icon-printer',
                    tooltip: 'Click para Imprimir um Relatório da Pesagem.<br>O Relatório Conterá todas as Pesagens na Data Atual.',
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
