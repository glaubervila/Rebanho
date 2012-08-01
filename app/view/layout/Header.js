Ext.define('Rebanho.view.layout.Header', {
    extend: 'Ext.Toolbar',

    alias : 'widget.layoutheader',

    requires: [
        'Rebanho.view.cadastros.confinamentos.ConfinamentosCombo',
    ],

    region:'north',

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
                            handler: function(){
                                var tabs = Ext.getCmp('mainTabpanel').novaAba('compraanimaisgrid');
                            },
                        },
                        {
                            text: 'Entrada de Animais',
                            handler: function(){
                                var tabs = Ext.getCmp('mainTabpanel').novaAba('entradaanimaispanel');
                            },
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
                    handler: function(){
                        var tabs = Ext.getCmp('mainTabpanel').novaAba('fornecedoresgrid');
                    },
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
                            handler: function(){
                                var tabs = Ext.getCmp('mainTabpanel').novaAba('pesagensgrid');
                            },
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
                {
                    text: 'Relatorios',
                    iconCls: 'icon-chart_curve',
                    menu: [
                        {
                            text: 'Pesagens por Data',
                            iconCls: 'icon-report',
                        },
                        {
                            text: 'Pesagens por Período',
                            iconCls: 'icon-report',
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
                                var tabs = Ext.getCmp('mainTabpanel').novaAba('caracteristicasgrid');
                            },
                        },
                        {
                            text: 'Quadras',
                            iconCls:'icon-table_gear',
                            handler: function(){
                                var tabs = Ext.getCmp('mainTabpanel').novaAba('quadrasgrid');
                            },
                        },
                        {
                            text: 'Valor Arroba',
                            iconCls:'icon-table_gear',
                            handler: function(){
                                var tabs = Ext.getCmp('mainTabpanel').novaAba('cepeasgrid');
                            },
                        },
                        {
                            text: 'Confinamentos',
                            iconCls:'icon-table_gear',
                            handler: function(){
                                var tabs = Ext.getCmp('mainTabpanel').novaAba('confinamentosgrid');
                            },
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
//         {
//             text: 'TESTE',
//             handler: function(){
//                 var tabs = Ext.getCmp('mainTabpanel').novaAba('pesagensgrid');
//             },
//         },
//         {
//             text: 'TESTE2',
//             handler: function(){
//                 Ext.create('Rebanho.view.ocorrencias.pesagens.PesagensPorDataWindow',{});
//             },
//         },


    ]

});
