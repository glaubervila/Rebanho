Ext.define('Rebanho.view.usuarios.UsuariosForm' ,{
    extend: 'Ext.form.Panel',

    alias : 'widget.usuariosform',

    title: 'Cadastro de Usuários',

    bodyStyle:'padding:10px;',

    iconCls: 'icon-application_form',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {

            fieldDefaults: {
                labelAlign: 'top',
            },
            items: [
            {
                xtype: 'fieldset',
                defaultType: 'textfield',
                defaults: {
                    anchor: '-5',
                },
                items: [
                {
                    fieldLabel: 'Código',
                    name: 'id',
                },
                {
                    fieldLabel: 'Nome Completo',
                    name: 'nome',
                    allowBlank: false
                },
                {
                    fieldLabel: 'Login',
                    name: 'login'
                },{
                    fieldLabel: 'E-mail',
                    name: 'email'
                }],
            }],
            // Barra e Menus
            tbar:{
                items:[{
                    xtype: 'button',
                    text: 'Novo',
                    action: 'action_novo',
                    iconCls: 'icon-add',
                },{
                    xtype: 'button',
                    text: 'Salvar',
                    action: 'action_salvar',
                    iconCls: 'icon-disk',
                    tooltip: 'Click para <font color="blue"><b>Salvar</b></font> as Informações.'
                },{
                    xtype: 'button',
                    text: 'Excluir',
                    action: 'action_excluir',
                    iconCls: 'icon-cross',
                },{
                    xtype: 'button',
                    text: 'Cancelar',
                    action: 'action_cancelar',
                    iconCls: 'icon-cancel',
                    tooltip: 'Click para <font color="red"><b>Abandonar</b></font> a Janela de Cadastro<br>Nenhuma informação será Gravada e o Cadastro será Fechado.'
                }]
            }

            , buttons:[
                {
                    text: 'Salvar',
                    action: 'action_salvar',
                    iconCls: 'icon-disk',
                },
                {
                    text: 'Cancelar',
                    action: 'action_cancelar',
                    iconCls: 'icon-cancel',
                }
            ]
        });

        this.callParent(arguments);

    }
 }); 