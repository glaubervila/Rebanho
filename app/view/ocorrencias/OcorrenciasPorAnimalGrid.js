Ext.define('Rebanho.view.ocorrencias.OcorrenciasPorAnimalGrid' ,{
    extend: 'Ext.grid.Panel',

    requires: [ ],

    alias : 'widget.ocorrenciasporanimalgrid',

    title: 'Ocorrencias Por Animal',

    loadMask: true,

    iconCls: 'icon-grid',

    initComponent: function() {

        this.store = 'Ocorrencias';

        var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
            groupHeaderTpl: Ext.create('Ext.XTemplate',
                '<div>',
                    '{children:this.confinamento}',
                '</div>',
                {
                    confinamento: function(children) {
                        console.log(children[0].data.confinamento);
                        return children[0].data.confinamento;
                    },
                }
            ),
            hideGroupedHeader: true
        });

        this.features = [groupingFeature],

        
        this.columns = [
            Ext.create('Ext.grid.RowNumberer'),
            {
                text: "Data",
                dataIndex: 'data',
                sortable: true,
                width: 100,
                renderer : Ext.util.Format.dateRenderer('d-m-Y'),
            },
//             {
//                 text: "Confinamento",
//                 dataIndex: 'confinamento',
//                 width: 100,
//             },
            {
                text: "Quadra",
                dataIndex: 'quadra',
                sortable: false,
                width: 100,
            },
            {
                text: "Ocorrência",
                dataIndex: 'ocorrencia',
                sortable: false,
                width: 100,
            },
            {
                text: "Descrição",
                dataIndex: 'descricao',
                sortable: false,
                flex:true,
            },
        ];

        this.dockedItems= [{
        }]


        this.callParent(arguments);
    },

 }); 
