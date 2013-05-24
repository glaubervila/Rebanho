/**
 *
 * Modelo de Login usando MCV
 * Desenvolvido por Ricardo Hirashiki
 * Publicado em: http://www.sitedoricardo.com.br
 * Data: Ago/2011
 *
 */
 
Ext.Loader.setConfig({
  enabled : true,
  paths   : {Rebanho:'app'}
});

        
Ext.application({
    name               : 'Rebanho',
    autoCreateViewport : true,
    enableQuickTips    : true,
//   paths              : {'Ext.ux': 'app/ux'},
    paths: {
        'Ext' : 'extjs/src',
        'Ext.ux' : 'ux',
    },
    requires           : [
        'Rebanho.Initialization',
        'Ext.ux.grid.Printer',
        'Ext.ux.Alert',
    ],
    appFolder          : 'app',
    enableRouter       : true,
    routes: {
        '/'           : 'viewport#index'        ,
        //'validate'    : 'viewport#validate'        ,
        'login'       : 'authentication#index',
        'home'        : 'home#index'
    },
    launch: function() {
        var hideMask = function () {
        //Ext.get('loading').remove();
        Ext.fly('loading-mask').animate({
            opacity : 0,
            remove  : true
        });
        };
        Ext.defer(hideMask, 250);
    },

    controllers: [
        'Viewport',
        'Header',

        // Compras
        'CompraAnimais',
        'EntradaAnimais',

        // Fornecedores
        'Fornecedores',

        // Ocorrencias
        'Ocorrencias',
        'Pesagens',
        'Nascimentos',

        // Animais
        'Animais',
        'PesosPorAnimal',

        // Cadastros
        'Usuarios',
        'Caracteristicas',
        'Confinamentos',
        'Cepeas',
        'Quadras',
        'Vacinas',
        
        // Transferencias
        'Transferencias',

        // Vendas
        'Clientes',

        // Relatorios
        'AnimaisAtivosReport',
        'PesagensReport',
        'TransferenciasReport',
        'ComprasReport'
    ],

});