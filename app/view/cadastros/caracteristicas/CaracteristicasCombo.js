Ext.define('Rebanho.view.cadastros.caracteristicas.CaracteristicasCombo', {

    extend    : 'Ext.form.field.ComboBox',

    alias     : 'widget.cmbcaracteristicas',

    name      : 'caracteristica',

    typeAhead : true,

    triggerAction: 'all',

    valueField: 'id',

    displayField: 'cod_desc',

    initComponent: function() {

        this.store = 'Caracteristicas';

        this.callParent(arguments);

    },

});