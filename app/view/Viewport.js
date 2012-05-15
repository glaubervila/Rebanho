Ext.define('Rebanho.view.Viewport', {
    extend: 'Ext.container.Viewport',

    requires: [
        'Rebanho.view.Header',
        'Rebanho.view.Tabpanel',
        //'Rebanho.view.Teste',
        //'Rebanho.view.usuarios.UsuariosForm',
        //'Rebanho.model.Teste',
    ],  

    layout: {
        type: 'border'
    },

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'pageHeader',
                    region: 'north',
                },
                {
                    xtype: 'pageTab',
                    region: 'center',
                    id: 'mainTabpanel',
                },
                {
                    xtype: 'pageTab',
                    region: 'south',
                }
            ]
        });
        
        this.callParent();
    },



});