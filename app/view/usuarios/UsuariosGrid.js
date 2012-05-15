Ext.define('Rebanho.view.usuarios.UsuariosGrid' ,{
    extend: 'Ext.grid.Panel',

    alias : 'widget.usuariosgrid',

    title: 'Lista de Usuários',

    iconCls: 'icon-grid',

    initComponent: function() {

        this.store = 'Usuarios';

        this.columns = [
            {
                text: "Código",
                dataIndex: 'id',
                sortable: true,
                hidden : true,
            },
            {
                text: "Nome",
                dataIndex: 'nome',
                sortable: true,
                flex:true,
            },
            {
                text: "Login",
                dataIndex: 'login',
                sortable: true,
                flex:true,
            },
            {
                text: "E-mail",
                dataIndex: 'email',
                sortable: true,
                flex:true,
            }
        ]

        // Barra de Paginacao
        this.bbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            displayMsg: 'Mostrando {0} à {1} de {2} Registro(s)',
            emptyMsg: "Não ha Registros!",
            afterPageText:'de {0}',
            beforePageText:'Página',
        });

        // Barra e Menus
        this.tbar = Ext.create('Ext.Toolbar', {
            items:[{
                xtype: 'button',
                text: 'Novo',
                action: 'action_novo',
                iconCls: 'icon-add',
                tooltip: 'Click para <font color="green"><b>Incluir</b></font> um Novo Registro.'
            },{
                xtype: 'button',
                id: 'btnUsuariosEditar',
                text: 'Editar',
                action: 'action_editar',
                iconCls: 'icon-page_edit',
                tooltip: 'Selecione um Registro na Lista, <br>Click para <font color="blue"><b>Editar</b></font> o Registro Selecionado.',
                disabled:true,
            },{
                xtype: 'button',
                id: 'btnUsuariosExcluir',
                text: 'Excluir',
                action: 'action_excluir',
                iconCls: 'icon-cross',
                tooltip: 'Selecione um Registro na Lista, <br>Click para <font color="red"><b>Excluir</b></font> o Registro Selecionado.',
                disabled:true,
                scope: this,
            }]
        });

        this.callParent(arguments);
    }
 }); 