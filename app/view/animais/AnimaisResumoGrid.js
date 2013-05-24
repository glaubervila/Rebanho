/** AnimaisResumidoGrid
 * Esta Grid tem como objetivo dar uma visao geral da situação do confinamento
 * ela mostra a quantidade total de animais no confinamento
 * a quantidade de animais por quadra, peso medio de cada quadra, menor peso e o maior peso
 */

Ext.define('Rebanho.view.animais.AnimaisResumoGrid' ,{
    extend: 'Ext.grid.Panel',

    requires: [ ],

    alias : 'widget.animaisresumogrid',

    title: 'Resumo Por Confinamento',

    loadMask: true,

    iconCls: 'icon-grid',

    initComponent: function() {

        this.store = 'AnimaisResumo';

        var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
            groupHeaderTpl: Ext.create('Ext.XTemplate',
                '<div>{children:this.confinamento}',
                ' | Total Ativos: {children:this.total}',
                '</div>',
                {
                    confinamento: function(children) {
                        console.log(children[0].data.confinamento);
                        return children[0].data.confinamento;
                    },
                    total: function(children) {
                        console.log(children[0].data.total_ativo);
                        return children[0].data.total_ativo;
                    },
                }
            ),
            hideGroupedHeader: true
        });

        this.features = [groupingFeature],
        
        this.columns = [
            Ext.create('Ext.grid.RowNumberer'),
            {
                dataIndex: 'confinamento_id',
                hidden: true,
            },
            {
                dataIndex: 'quadra_id',
                hidden: true,
            },
            {
                text: "Quadra",
                dataIndex: 'quadra',
                sortable: false,
                width: 100,
            },
            {
                text: "Quantidade",
                dataIndex: 'quantidade_total',
                sortable: false,
                width: 80,
            },
            {
                text: "Machos",
                dataIndex: 'quantidade_machos',
                sortable: false,
                width: 80,
            },
            {
                text: "Femeas",
                dataIndex: 'quantidade_femeas',
                sortable: false,
                width: 80,
            },
            {
                text: "Peso Médio",
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
                text: "Ultima Pesagem",
                dataIndex: 'ultima_pesagem',
                sortable: false,
                width: 100,
            },
            {
                text: "Média Confinamento",
                dataIndex: 'media_confinamento',
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
            ]
        }]


        this.callParent(arguments);
    },

 }); 
