Ext.define('Rebanho.view.ocorrencias.pesagens.PesagensGrid' ,{
    extend: 'Ext.grid.Panel',

    requires: [ ],

    alias : 'widget.pesagensgrid',

    title: 'Pesagens de Animais',

    loadMask: true,

    iconCls: 'icon-grid',

    initComponent: function() {

        this.store = 'Pesagens';

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
                printAble: false,
            },
            {
                text: "Data",
                dataIndex: 'data',
                sortable: false,
                width: 100,
                renderer : Ext.util.Format.dateRenderer('d-m-Y'),
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
            },
            {
                text: "Quadra",
                dataIndex: 'quadra',
                width: 150,
                itemId: 'cmb_quadra',
                field: {
                    xtype: 'cmbquadras',
                    valueField: 'id',
                    displayField: 'quadra',
                },
            },
            {
                text: "vacina",
                dataIndex: 'vacina',
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
                ,{
                    xtype: 'datefield',
                    fieldLabel:'Data',
                    itemId: 'dtf_data',
                    name: 'data',
                    format: 'd/m/y',
                    submitFormat: 'Y-m-d',
                    labelWidth: 50,
                    width: 150,
                },
                '-',
                {
                    xtype:'cmbvacinas',
                    fieldLabel:'Vacina',
                    name: 'vacina_id',
                    itemId: 'cmb_vacina',
                    labelWidth: 50,
                    width: 300,

                },
                '-',
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
                    text: 'Salvar',
                    itemId: 'btnSalvar',
                    action: 'action_salvar',
                    iconCls: 'icon-disk',
                    tooltip: 'Click para Salvar as Pesagens.',
                },
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
                {xtype: 'tbtext', itemId: 'tbpesototal',text: '<b>Total:</b>'},
                {xtype: 'tbtext', itemId: 'tbpesomedio',text: '<b>Médio:</b>'},
                '-',
            ]
        }]


        this.callParent(arguments);
    },

//     rendererQuadra:function(value, obj, record){
//         return record.get('quadra');
//     }

 }); 
