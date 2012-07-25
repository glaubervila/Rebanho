/**
 *
 * Modelo de Login usando MCV
 * Desenvolvido por Ricardo Hirashiki
 * Publicado em: http://www.sitedoricardo.com.br
 * Data: Ago/2011
 *
 * Baseado nos exemplos disponibilizados em
 * https://github.com/brunotavares/Ext.ux.Router
 * 
 */
 
Ext.define('Rebanho.Initialization', {requires: ['Ext.ux.Router']},
  (function()
  {
// 	  console.log('Ext.ux.Initialization - begin');
  /* 
   * Override Ext.app.Controller to provide render capability. I believe each application
   * will handle rendering task different (some will render into a viewport, some in tabs, etc...), 
   * so I didn't put this role into Ext.ux.Route responsability.
   */
  Ext.override(Ext.app.Controller, {
      render: function(view)
      {
      	if (!view){
      		view="home.Home";
        }
        Ext.Ajax.request({
          //url : 'data/islogged.json',   //Simula ERRO
            url : 'php/main.php',
            method : 'POST',
            params: {
                classe: 'Usuarios'
                ,action: 'isLogged'
            },
            scope:this,
            success: function ( result, request ) {
                var retorno = Ext.decode(result.responseText);
                if (retorno.success)
                {
                    var viewport_main = Ext.getCmp('viewport_default');
                    var viewport_layoutappview = Ext.getCmp('layoutappview');
                    if (!viewport_layoutappview){
                        viewport_main.removeAll();
                        viewport_main.add(Ext.widget('layoutappview'));
                        viewport_main.doLayout();
                    }
                    var middle = Ext.getCmp('layoutmiddle');
                    if (middle){
                        middle.removeAll();
                        //console.log(middle);
                        //load view
                        if (Ext.isString(view)) {
                        view = this.getView(view);
                        }

                        //if it already exists, remove
                        element = middle.child(view.xtype);
                        if(element){
                        middle.remove(element);
                        }
                        middle.setActive(true,middle.add(view));
                        middle.doLayout();
                    }

                    // Setando Os Atributos de Usuario
                    var main = Ext.getCmp('main_viewport');
                    if (main){
                        main.usuario = retorno.data.user_id;
                        main.confinamento_id = retorno.data.user_confinamento;
                        main.confinamento    = retorno.data.confinamento;
                    }

                }else{
                Ext.ux.Router.redirect('login');
                }
          },
          failure: function ( result, request) { 
            //console.log(result);
            //console.log(request);
            switch (result.failureType) {
              case Ext.form.action.Action.CLIENT_INVALID:
                Ext.MessageBox.alert('Erro', "Campos inv&#225;lidos"); 
                break;
              case Ext.form.action.Action.CONNECT_FAILURE:
                Ext.MessageBox.alert('Erro', "Falha ao conectar no servidor"); 
                break;
              case Ext.form.action.Action.SERVER_INVALID:
                this.onAuthenticationFail(sender);
            }
          } 
        });
    }
  });
  
  /* 
   * Ext.ux.Router provides some events for better controlling
   * dispatch flow
   */
  Ext.ux.Router.on({
        routemissed: function(uri)
        {
            Ext.Msg.show({
                title:'Error 404',
                msg: 'Route not found: ' + uri,
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR
            });
        },
        beforedispatch: function(uri, match, params)
        {
            console.log('beforedispatch ' + uri);
        },
        dispatch: function(uri, match, params, controller)
        {
            console.log('dispatch ' + uri);
            //TIP: you could automize rendering task here, inside dispatch event

        }
  });
    console.log('Ext.ux.Initialization - end');

  })
);