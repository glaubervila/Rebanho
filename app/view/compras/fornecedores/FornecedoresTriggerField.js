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

        // Zerar os filtros na Store
        // Limpando o Filtro
        store.clearFilter(true);

        // Setando o Atributo Confinamento
        this.confinamento = Ext.getCmp('main_viewport').getConfinamentoId();

        store.filter([
            {property: "confinamento_id", value: this.confinamento},
        ]);

        this.callParent(arguments);

    },

//     onTriggerClick : function(e) {
//         var me = this;
//         if (!me.hideTrigger) {
//                 me.fireEvent("fornecedorestriggerclick", me, e);
//         }
//     },

});