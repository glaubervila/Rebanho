/** AnimaisResumidoGrid
 * Esta Grid tem como objetivo dar uma visao geral da situação do confinamento
 * ela mostra a quantidade total de animais no confinamento
 * a quantidade de animais por quadra, peso medio de cada quadra, menor peso e o maior peso
 */

Ext.define('Rebanho.view.animais.AnimaisResumidoGrid' ,{
    extend: 'Ext.grid.Panel',

    requires: [ ],

    alias : 'widget.animaisresumogrid',

    title: 'Lista Resumida Por Confinamento',

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
                text: "Quadra",
                dataIndex: 'quadra',
                sortable: false,
                width: 200,
            },
            {
                text: "Quantidade",
                dataIndex: 'quantidade',
                sortable: false,
                width: 50,
            },
            {
                text: "Machos",
                dataIndex: 'qtd_machos',
                sortable: false,
                width: 50,
            },
            {
                text: "Femeas",
                dataIndex: 'qtd_femeas',
                sortable: false,
                width: 150,
            },
            {
                text: "Peso Medio",
                dataIndex: 'peso_medio',
                sortable: false,
                width: 100,
                renderer : Ext.util.Format.dateRenderer('d-m-Y'),
            },
            {
                text: "Peso Min",
                dataIndex: 'peso_minimo',
                sortable: false,
                width: 100,
            },
            {
                text: "Peso Max",
                dataIndex: 'peso_maximo',
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

        ];

        this.dockedItems= [{
            xtype: 'toolbar',
            items: [
                // Combo Box Confinamentos
                {
                    xtype:'cmbconfinamento',
                    itemId   :'cmbConfinamento',
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
