Ext.define('Rebanho.view.layout.Appview', {
  extend        : 'Ext.panel.Panel',
  alias         : 'widget.layoutappview',
  layout : 'border',
  id : 'layoutappview',
  items:[
    {xtype:'layoutheader'},
    {xtype:'layoutfooter'},
    {xtype:'layoutmiddle'}
  ]

});
