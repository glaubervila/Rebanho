Ext.define('Rebanho.view.cadastros.confinamentos.ConfinamentosCmb' ,{
    require: 'Ext.form.ComboBox',

    xtype: 'confinamentoscmb',

    fieldLabel: 'Confinamento',
    store: 'Confinamentos',
    queryMode: 'remote',
    displayField: 'confinamento',
    valueField: 'id',

});