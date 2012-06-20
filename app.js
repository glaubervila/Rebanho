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
//   paths              : {'Ext.ux': 'app/ux'},
    paths: {
        'Ext' : 'extjs/src',
        'Ext.ux' : 'extjs/ux',
    },
    requires           : ['Rebanho.Initialization'],
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
        Ext.get('loading').remove();
        Ext.fly('loading-mask').animate({
            opacity : 0,
            remove  : true
        });
        };
        Ext.defer(hideMask, 250);
    },

    controllers: [
        'Viewport',
        // Compras
        'CompraAnimais',
        // Fornecedores
        'Fornecedores',

        // Cadastros
        'Usuarios',
        'Caracteristicas',
        'Confinamentos',
        'Cepeas',
        'Quadras',
    ],

});