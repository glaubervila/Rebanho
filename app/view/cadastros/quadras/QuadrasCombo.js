Ext.define('Rebanho.view.cadastros.quadras.QuadrasCombo', {

    extend    : 'Ext.form.field.ComboBox',

    alias     : 'widget.cmbquadras',

    name      : 'quadra_id',

    typeAhead : true,

    triggerAction: 'all',

    valueField: 'id',

    displayField: 'quadra',

    initComponent: function() {

        this.store = 'Quadras';

        this.callParent(arguments);

    },

});