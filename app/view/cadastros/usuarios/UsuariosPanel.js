Ext.define('Rebanho.view.cadastros.usuarios.UsuariosPanel' ,{
    extend: 'Ext.panel.Panel',

    alias : 'widget.usuariospanel',

    title: 'Usuários',

    layout: 'border',

    iconCls: 'icon-group_gear',

    initComponent: function() {

        var me = this;

        Ext.applyIf(me, {

            items: [
                {
                    xtype: 'usuariosgrid',
                    region: 'center',
                },
                {
                    xtype: 'usuariosform',
                    region: 'east',
                    collapsible: true,
                    width: 300,
                    collapsed: true,
                    split: true,
                }
            ]
        });

        this.callParent(arguments);
    }
 });