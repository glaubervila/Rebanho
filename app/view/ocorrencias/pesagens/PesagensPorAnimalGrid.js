Ext.define('Rebanho.view.ocorrencias.pesagens.PesagensPorAnimalGrid' ,{
    extend: 'Ext.grid.Panel',

    requires: [ ],

    alias : 'widget.pesagensporanimalgrid',

    title: 'Pesagens Por Animais',

    loadMask: true,

    iconCls: 'icon-grid',

    initComponent: function() {

        this.store = 'PesosPorAnimal';


        var groupingFeature = Ext.create('Ext.grid.feature.GroupingSummary',{
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
            hideGroupedHeader: true,
        });

        this.features = [
            groupingFeature,
        ],

        this.columns = [
            {
                text: "Tipo",
                dataIndex: 'tipo',
                sortable: false,
                width: 70,
                renderer : this.changeTipo,
                summaryRenderer: function(value){
                    return 'Total:';
                }
            },
            {
                text: "Data",
                dataIndex: 'data',
                sortable: true,
                width: 70,
                renderer : Ext.util.Format.dateRenderer('d/m/y'),
            },
            {
                text: "Peso",
                dataIndex: 'peso',
                sortable: true,
                flex: 1,
                renderer : this.changePeso,
            },
            {
                text: "Intervalo",
                dataIndex: 'intervalo',
                sortable: false,
                flex: 1,
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return value + ' Dias';
                },
                renderer : this.changeIntervalo,
            },
            {
                text: "Ganho",
                dataIndex: 'peso_ganho',
                sortable: false,
                flex: 1,
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return value + ' Kg';
                },
                renderer : this.changePeso,
            },
            {
                text: "Media/Dia",
                dataIndex: 'media_dia',
                sortable: false,
                flex: 1,
                renderer : this.changePeso,

            },
        ];
        

        this.dockedItems= [{
        }]

        this.bbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            displayMsg: 'Mostrando {0} à {1} de {2} Registro(s)',
            emptyMsg: "Não ha Registros!",
            afterPageText:'de {0}',
            beforePageText:'Página',
        });

        this.callParent(arguments);
    },

    changeTipo: function(value, obj, record){
        switch (value) {

            case '1':
                return 'Entrada';
            break;
            case '2':
                return 'Pesagem';
            break;
            case '3':
                return 'Compra';
            break;
            case '4':
                return 'Saida';
            break;
        }
    },
    changePeso: function(value, obj, record){
        if (value > 0) {
            return value+' Kg';
        }
        else {
            return '-';
        }
    },
    changeIntervalo: function(value, obj, record){
        if (value > 0) {
            return value+' Dias';
        }
        else {
            return '-';
        }
    },

 }); 
