Ext.define('Rebanho.view.Header', {
    extend: 'Ext.Toolbar',

    xtype : 'pageHeader',

    height: 53,

    items: [
        {
            xtype: 'buttongroup',
            title: 'Compras',
            defaults: {
                scale: 'small'
            },
            items: [
                {
                    text: 'Compras',
                    iconCls: 'icon-money_delete',
                    menu: [
                        {
                            text: 'Compra de Animais',
                        },
                        {
                            text: 'Compra de Vacinas/Medicamentos',
                        },
                        {
                            text: 'Compra de Ração',
                        }
                    ]
                },
                {
                    text: 'Fornecedores',
                    iconCls: 'icon-user_suit',
                },
                {
                    text: 'Relatorios',
                    iconCls: 'icon-chart_bar',
                    menu: [
                        {
                            text: 'Compras Por Período',
                            iconCls: 'icon-report',
                        },
                        {
                            text: 'Compras Por Fornecedor',
                            iconCls: 'icon-report',
                        },
                        {
                            text: 'Lotes de Compras',
                            iconCls: 'icon-report',
                        },
                    ]
                },
            ]
        },
        {
            xtype: 'buttongroup',
            title: 'Lançamentos',
            defaults: {
                scale: 'small'
            },
            items:[
                {
                    text: 'Ocorrências',
                    iconCls: 'icon-pencil_add',
                    menu: [
                        {
                            text: 'Lançamento Geral',
                            iconCls: 'icon-application_form',
                        },
                        {
                            text: 'Lançamento Individual',
                            iconCls: 'icon-application_form',
                        },
                        {
                            text: 'Pesagens',
                            iconCls: 'icon-application_form',
                        },
                        {
                            text: 'Manejos',
                            iconCls: 'icon-application_form',
                        },
                        {
                            text: 'Remarcar',
                            iconCls: 'icon-application_form',
                        },
                        {
                            text: 'Dados do Abate',
                            iconCls: 'icon-application_form',
                        },
                    ]
                },
            ]
        },
        {
            xtype: 'buttongroup',
            title: 'Vendas',
            defaults: {
                scale: 'small'
            },
            items: [
                {
                    text: 'Vendas',
                    iconCls: 'icon-coins_add',
                },
                {
                    text: 'Clientes',
                    iconCls: 'icon-group',
                },
                {
                    text: 'Relatorios',
                    iconCls: 'icon-chart_pie',
                    menu: [
                        {
                            text: 'Vendas Por Período',
                            iconCls: 'icon-report',
                        },
                        {
                            text: 'Vendas Por Clientes',
                            iconCls: 'icon-report',
                        },
                    ]
                },
            ]
        },
        {
            xtype: 'buttongroup',
            title: 'Uteis',
            defaults: {
                scale: 'small'
            },
            items:[
                {
                    text: 'Cadastros',
                    iconCls: 'icon-application_form_add',
                    menu: [
                        {
                            text: 'Usuários',
                            iconCls: 'icon-group_gear',
                            handler: function(){
                                var tabs = Ext.getCmp('mainTabpanel').novaAba('usuariospanel');
                            },
                        },
                        {
                            text: 'Características',
                            iconCls:'icon-table_gear',
                            handler: function(){
                            },
                        },
                        {
                            text: 'Quadras',
                            iconCls:'icon-table_gear',
                            handler: function(){
                            },
                        },
                         {
                            text: 'Valor Arroba',
                            iconCls:'icon-table_gear',
                        },
                        {
                            text: 'Confinamentos',
                            iconCls:'icon-table_gear',
                        },
                    ]
                },
                {
                    text: 'Configurações',
                    iconCls: 'icon-cog',
                    menu: [
                    ]
                },
                {
                    text: 'Ferramentas',
                    iconCls: 'icon-tools_box',
                    menu: [
                    ]
                },
            ]
        },
    ]

});
