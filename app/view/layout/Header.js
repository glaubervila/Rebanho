Ext.define('Rebanho.view.layout.Header', {
    extend: 'Ext.Toolbar',

    alias : 'widget.layoutheader',

    requires: [
        'Rebanho.view.cadastros.confinamentos.ConfinamentosCombo',
    ],

    region:'north',

    height: 60,

    items: [
        {
            xtype: 'buttongroup',
            title: 'Compras',
            defaults: {
                scale: 'small',
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
                    text: 'Fornecedores',
                    iconCls: 'icon-user_suit',
                    handler: function(){
                        var tabs = Ext.getCmp('mainTabpanel').novaAba('fornecedoresgrid');
                    },
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
                            text: 'Manejo',
                            iconCls: 'icon-application_form',
                        },
                        {
                            text: 'Remarcar',
                            iconCls: 'icon-application_form',
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

            ]
        },
        {
            xtype: 'buttongroup',
            title: 'Animais',
            defaults: {
                scale: 'small'
            },
            items:[
                {
                    text: 'Animais',
                    iconCls: 'icon-cow',
                    menu: [
                        {
                            text: 'Lista de Animais',
                            iconCls: 'icon-report',
                            handler: function(){
                                var tabs = Ext.getCmp('mainTabpanel').novaAba('animaisgrid');
                            },
                        },
                        {
                            text: 'Resumo por Confinamento',
                            iconCls: 'icon-report',
                            handler: function(){
                                var tabs = Ext.getCmp('mainTabpanel').novaAba('animaisresumogrid');
                            },
                        },
                    ]
                },
                {
                    text: 'Localizar Animal',
                    iconCls: 'icon-find',
                    handler: function(){
                        Ext.create('Rebanho.view.animais.LocalizarAnimalWindow',{});
                    },
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
                    menu: [{
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
                    }]
                },
                {
                    text: 'Clientes',
                    iconCls: 'icon-group',
                    handler: function(){
                        var tabs = Ext.getCmp('mainTabpanel').novaAba('clientesgrid');
                    },
                },

            ]
        },
        {
            xtype: 'buttongroup',
            title: 'Transferências',
            defaults: {
                scale: 'small'
            },
            items: [
                {
                    text: 'Tranferências',
                    iconCls: 'icon-arrow_refresh',
                    menu: [
                    {
                        text: 'Saída',
                        iconCls: 'icon-control_fastforward_blue',
                        handler: function(){
                            Ext.create('Rebanho.view.transferencias.SaidaWindow',{});
                        },
                        tooltip: 'Click para Criar uma nova Transferencia, vai abrir a janela de transferencias de saida, para inclusão dos animais a serem transferidos.',

                    },
                    {
                        text: 'Transferências Por Período',
                        iconCls: 'icon-lorry',
                        handler: function(){
                            var tabs = Ext.getCmp('mainTabpanel').novaAba('transferenciasgrid');
                        },
                        tooltip: 'Abra uma Lista com todas as Tranferências.',
                    }]
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
                        {
                            text: 'Vacinas',
                            iconCls:'icon-pill',
                            handler: function(){
                                var tabs = Ext.getCmp('mainTabpanel').novaAba('vacinasgrid');
                            },
                        },

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
//                 Ext.create('Rebanho.view.animais.AnimaisWindow',{});
//             },
//         },


    ]

});
