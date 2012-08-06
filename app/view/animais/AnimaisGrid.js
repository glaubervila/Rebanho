Ext.define('Rebanho.view.animais.AnimaisGrid' ,{
    extend: 'Ext.grid.Panel',

    requires: [ ],

    alias : 'widget.animaisgrid',

    title: 'Lista de Animais Por Confinamento',

    loadMask: true,

    iconCls: 'icon-grid',

    initComponent: function() {

        this.store = 'Animais';

        this.columns = [
            Ext.create('Ext.grid.RowNumberer'),
            {
                text: "Confinamento",
                dataIndex: 'confinamento_id',
                hidden: true,
            },
            {
                text: "Identificação",
                dataIndex: 'codigo',
                sortable: false,
                width: 200,
            },
            {
                text: "Sexo",
                dataIndex: 'sexo',
                sortable: false,
                width: 50,
            },
            {
                text: "Idade",
                dataIndex: 'idade',
                sortable: false,
                width: 50,
            },
            {
                text: "Quadra",
                dataIndex: 'quadra',
                sortable: false,
                width: 150,
            },
            {
                text: "Data Entrada",
                dataIndex: 'data_entrada',
                sortable: false,
                width: 100,
                renderer : Ext.util.Format.dateRenderer('d-m-Y'),
            },
            {
                text: "Peso Entrada",
                dataIndex: 'peso_entrada',
                sortable: false,
                width: 100,
            },
            {
                text: "Ultima Pesagem",
                dataIndex: 'data_ultima_pesagem',
                sortable: false,
                width: 100,
                renderer : Ext.util.Format.dateRenderer('d-m-Y'),
            },
            {
                text: "Ultimo Peso",
                dataIndex: 'peso_atual',
                sortable: false,
                width: 100,
            },
            {
                text: "Ganho/Dia",
                dataIndex: 'ganho_diario',
                sortable: false,
                width: 100,
            },
            {
                text: "Confinado",
                dataIndex: 'dias_confinamento',
                sortable: false,
                width: 100,
            },
            {
                text: "Total Ganho",
                dataIndex: 'peso_ganho',
                sortable: false,
                width: 100,
            },
            {
                text: "Classificação",
                dataIndex: 'classificacao',
                sortable: false,
                width: 100,
            },
            {
                text: "Escore",
                dataIndex: 'escore',
                sortable: false,
                width: 100,
            },

        ];

        this.dockedItems= [{
            xtype: 'toolbar',
            items: [
                // Combo Box Confinamentos
                {
                    xtype:'cmbconfinamento',
                    itemId   :'cmbConfinamento',
                },
                {
                    xtype:'cmbquadras',
                    itemId   :'cmbQuadras',
                },
                '-',
                {
                    text: 'Filtrar',
                    iconCls: 'icon-filter',
                    action: 'action_filtrar',
                    itemId: 'btnFiltrar',
                    tooltip: 'Click para Filtrar os Registros por Confinamentos ou Por Quadras.',
                },

            ]
        }]


        this.callParent(arguments);
    },

 }); 
