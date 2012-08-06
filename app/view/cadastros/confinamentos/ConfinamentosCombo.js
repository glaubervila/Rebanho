Ext.define('Rebanho.view.cadastros.confinamentos.ConfinamentosCombo', {

    extend    : 'Ext.form.field.ComboBox',

    alias     : 'widget.cmbconfinamento',

    name      : 'confinamento',

    typeAhead : true,

    triggerAction: 'all',

    valueField: 'id',

    mode: 'local',

    queryMode: 'local',

    displayField: 'confinamento',

    value: 0,

    width: 200,

    emptyText: 'Selecione um Confinamento',
    submitEmptyText: false,

    initComponent: function() {

        this.store = 'Confinamentos',

        this.callParent(arguments);

    },


});