/**
 *
 * Modelo de Login usando MCV
 * Desenvolvido por Ricardo Hirashiki
 * Publicado em: http://www.sitedoricardo.com.br
 * Data: Ago/2011
 *
 * Baseado na extensao criada por Wemerson Januario
 * http://code.google.com/p/login-window/
 *
 */
 
Ext.define('Rebanho.view.authentication.Login', {
  extend      : 'Ext.window.Window',
  alias       : 'widget.authenticationlogin',
  layout      : 'fit',
  bodyStyle   : 'padding:10px;',
  title       : 'Autentica&#231;&#227;o',
  id          : 'authentication-login',
  autoShow    : true,
  labelAlign  : 'top',
  closable    : false,
  draggable   : false,
  constrain   : true,
  resizable   : false,

  initComponent: function() {
    this.items = [
      {
        xtype          : 'form',
        baseCls        : 'x-plain',
        border         : false,
        bodyStyle      : "padding: 10px;",
        waitMsgTarget  : true,
        labelAlign     : "top",
        items: [
          {
            xtype            : 'textfield',
            name             : 'login',
            id               : 'l',
            fieldLabel       : 'Usu&aacute;rio',
            allowBlank       : false,
            blankText        : 'Usu&aacute;rio Obrigat&oacute;rio',
            msgTarget        : 'side',
            selectOnFocus    : true,
            enableKeyEvents  : true
          },{
            xtype            : 'textfield',
            inputType        : 'password', 
            name             : 'senha',
            id               : 's',
            fieldLabel       : 'Senha',
            allowBlank       : false,
            blankText        : 'Senha Obrigat&oacute;ria',
            msgTarget        : 'side',
            selectOnFocus    : true,
            enableKeyEvents  : true
          }
        ]
      }
    ];
    this.buttons = [
      {
        xtype  : 'label',
        style  : {color:'#ff0000'} ,
        id     : 'msgField',
        width  :200
      },{
        text: '<b>Entrar</b>',
        action: 'trylogin'
      }
    ];
    this.callParent(arguments);
  }
});
