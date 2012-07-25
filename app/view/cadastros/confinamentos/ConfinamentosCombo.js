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

    initComponent: function() {

        this.store = 'Confinamentos',

        this.callParent(arguments);

    },


});