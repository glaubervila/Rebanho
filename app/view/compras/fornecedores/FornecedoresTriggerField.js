Ext.define('Rebanho.view.compras.fornecedores.FornecedoresTriggerField', {
    extend : "Ext.form.field.ComboBox",

    alias : "widget.triggerfieldfornecedores",

    fieldLabel:'Forncedor',

    triggerCls: 'icon-search-trigger',

    typeAhead : true,

    triggerAction: 'all',

    valueField: 'id',

    displayField: 'nome',

    initComponent: function() {

        this.store = 'Fornecedores';

        this.callParent(arguments);

    },

//     onTriggerClick : function(e) {
//         var me = this;
//         if (!me.hideTrigger) {
//                 me.fireEvent("fornecedorestriggerclick", me, e);
//         }
//     },

});