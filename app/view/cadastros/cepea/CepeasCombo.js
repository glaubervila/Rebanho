Ext.define('Rebanho.view.cadastros.cepea.CepeasCombo', {

    extend    : 'Ext.form.field.ComboBox',

    alias     : 'widget.cmbcepeas',

    name      : 'cepea',

    typeAhead : true,

    triggerAction: 'all',

    valueField: 'valor',

    displayField: 'data_valor',

    initComponent: function() {

        this.store = 'Cepeas';

        this.callParent(arguments);

    },

});