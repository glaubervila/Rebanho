Ext.define('Rebanho.view.cadastros.caracteristicas.CaracteristicasGrid' ,{
    extend: 'Ext.grid.Panel',

    alias : 'widget.caracteristicasgrid',

    title: 'Lista de Caracteristicas',

    loadMask: true,

    iconCls: 'icon-grid',

    initComponent: function() {

        this.store = 'Caracteristicas';

        // RowEdit Plugin
        this.plugins= [
            Ext.create('Ext.grid.plugin.RowEditing',{
            }),
        ],

        this.columns = [
            Ext.create('Ext.grid.RowNumberer'),
            {
                dataIndex: 'id',
                sortable:false,
                hidden : true,
            },
            {
                text: "Código",
                dataIndex: 'codigo',
                sortable: true,
                //flex:true,
                width: 150,
                field: {
                    xtype: 'textfield',
                },
            },
            {
                text: "Características",
                dataIndex: 'descricao',
                sortable: true,
                flex:true,
                field: {
                    xtype: 'textfield',
                },
            },
        ]

        this.dockedItems= [{
            xtype: 'toolbar',
            items: [{
                text: 'Novo',
                iconCls: 'icon-add',
                action: 'action_novo',
                tooltip: 'Click para <font color="green"><b>Incluir</b></font> um Novo Registro.',
            },
            {
                itemId:'delete',
                text: 'Excluir',
                iconCls: 'icon-cross',
                action: 'action_excluir',
                disabled: true,
                tooltip: 'Selecione um Registro na Lista, <br>Click para <font color="red"><b>Excluir</b></font> o Registro Selecionado.',
            }]
        }]

        // Barra de Paginacao
        this.bbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            displayMsg: 'Mostrando {0} à {1} de {2} Registro(s)',
            emptyMsg: "Não ha Registros!",
            afterPageText:'de {0}',
            beforePageText:'Página',
        });


        this.callParent(arguments);
    }
 }); 
