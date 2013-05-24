Ext.define('Rebanho.view.animais.AnimaisAtivosReportWindow' ,{
    extend: 'Ext.window.Window',

    alias : 'widget.animaisativosreportwindow',

    title: 'Relatórios de Animais Ativos',

    layout: 'fit',

    autoShow: true,

    width: 230,

    height: 250,

    //iconCls: 'icon-',

    initComponent: function() {

        var me = this;

        Ext.applyIf(me, {

            items: [
                Ext.create('Ext.form.Panel',{
                    itemId:'formAnimaisAtivosReport',
                    fieldDefaults: {
                        labelAlign: 'top',
                        labelWidth: 100
                    },
                    layout:'form',
                    bodyStyle:'padding:10px',
                    items:[{
                        xtype:'cmbconfinamento',
                        itemId:'cmbConfinamento',
                        fieldLabel:'Confinamento',
                        name: 'confinamento_id'
                    },{
                        xtype:'cmbquadras',
                        itemId:'cmbQuadra',
                        fieldLabel:'Quadra',
                        name: 'quadra_id',
                        disabled: true
                    }]
                })
            ],
            // Barra e Menus
            bbar:{
                items:['->',{
                    xtype: 'button',
                    text: 'Gerar Relatorio',
                    action: 'action_report',
                    iconCls: 'icon-report_32x32',
                    scale: 'large'
                }]
            }

        });
        this.callParent(arguments);
    }
 });