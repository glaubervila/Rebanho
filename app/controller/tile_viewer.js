Ext.Loader.setConfig({enabled: true});

Ext.Loader.setPath('Ext.ux.DataView', '/static/javascript/ext/ux/DataView/');

Ext.require([
    'Ext.data.*',
    'Ext.util.*',
    'Ext.view.View',
    'Ext.ux.PreviewPlugin',
]);

Ext.onReady(function(){

     Ext.tip.QuickTipManager.init();
    
    // Recuperar os parametros pela url
    var urlOriginal = window.location;
    var urlString = urlOriginal.toString();
    var urlArray = urlString.split("?");
    var parametros = urlArray[1];
    //console.log("Parametros = "+parametros);
    //console.log( "TESTE SE ESTA ATUALIZANDO ");
    //var defaultBandFilter = 'RGB';
    
    ImageModel = Ext.define('ImageModel', {
        extend: 'Ext.data.Model',
        fields: ['tag_id','name','version','release_date','description','doc_url','field_id','field_name','display_name','tiletag_id','tile_id','tilename', 'ra','dec','g','r','i','z','y','gri','riz','izy','rgb','zoom','comments',
        {
            name:'last_comment',
            type:'string',
            convert: function(value, record){
                return value.replace("\n<br>"," "); 
            }
        },
        {
            name:'flag_reject',
            type:'boolean'},
        {
            // cada registro da store, vai receber um atributo default_img que vai ser usado pelo template
            name: 'default_img',
            convert: function(value, record) {
                // Recuperar o filtro/band padrao ou selecionado.
                filter = getDefaultFilter();
                // retorna para o atributo novo o valor do atributo referente ao filtro
                return record.get(filter);
            }
        }]
    });

    var store = Ext.create('Ext.data.Store', {
        model: 'ImageModel',
        pageSize: 100,
        proxy: {
            type: 'ajax',
            url: '/DVIEW/view_tile_mosaic_json?'+parametros,
            reader: {
                type: 'json',
                root: 'tiles',
                totalProperty: 'totalCount'
            }
        },
        listeners: {
            load: function(store, eOpts){
                //console.log(store);
                setDataViewTitle(store.getAt(0));
            }
        }
    });
    store.load();


    function setDataViewTitle(record){
        //console.log("setDataViewTitle(%o)",record);
        title = Ext.util.Format.format("{0} ( {1} ) - {2} ( {3} Tiles)", record.get('version'),record.get('name'),record.get('display_name'), store.getTotalCount( ));
        Ext.getCmp('tileTabPanel').setTitle(title);
    }
    
    ProcessesModel = Ext.define('ProcessesModel', {
        extend: 'Ext.data.Model',
        fields: ['process_id', 'start_time', 'readme', 'hid', 'tiletag_id']
    });
    var storeProcesses = Ext.create('Ext.data.Store', {
        model: 'ProcessesModel',
        remoteFilter: true,
        proxy: {
            type: 'ajax',
            url: '/DVIEW/getProcessesByTile',
            reader: {
                type: 'json',
                root: 'processes'
            }
        }
    });
    //storeProcesses.load();

    var dataView = Ext.define('TileMosaic' ,{
        extend: 'Ext.Panel',
        alias : 'widget.tilemosaic',
        id: 'images-view',
        itemId: 'images-view',
        layout: 'fit',
        autoScroll: true,
        title: '',
        titleAlign:'center',
        items: Ext.create('Ext.view.View', {
            itemId:'dataview',
            store: store,
            tpl: [
                '<tpl for=".">',
                    '<div class="thumb-wrap" id="{tilename:stripTags}">',
                        '<div class="thumb"><img src="{default_img}" title="{tilename:htmlEncode}"></div>',
                        '<span class="x-editable">{tilename:htmlEncode}</span>',
                    '</div>',
                '</tpl>',
                '<div class="x-clear"></div>'
            ],
            multiSelect: false,
            trackOver: true,
            overItemCls: 'x-item-over',
            itemSelector: 'div.thumb-wrap',
            emptyText: 'No images to display',
            height: '90%',
            prepareData: function(data) {
                Ext.apply(data, {
                    ra: Ext.util.Format.number(data.ra, '0.00'),
                    dec: Ext.util.Format.number(data.dec, '0.00'),
                });
                return data;
            },
            listeners: {
                selectionchange: function(dv, nodes ){
                    showTileDetail(nodes[0]);
                }
            }
        }),
        // paging bar on the bottom
        bbar: Ext.create('Ext.PagingToolbar', {
            store: store,
            displayInfo: true,
            displayMsg: 'Displaying tiles {0} - {1} of {2}',
            emptyMsg: "No tiles to display",
        }),
        dockedItems: [{
            itemId: 'dataViewToolBar',
            xtype: 'toolbar',
            dock: 'top',
            items:[{
                xtype: 'buttongroup',
                id:'dataViewBtnGrpBands',
                itemId:'dataViewBtnGrpBands',
                defaults: {
                    allowDepress:false,
                    toggleGroup: "bands",
                    toggleHandler: function(btn) {
                        if(btn.pressed){
                            filter = btn.value;
                            filterMosaic(filter);
                        }
                    }
                },
                items: [
                    { xtype: 'button', text: 'g', value:'g'},
                    { xtype: 'button', text: 'r', value:'r'},
                    { xtype: 'button', text: 'i', value:'i'},
                    { xtype: 'button', text: 'z', value:'z'},
                    { xtype: 'button', text: 'Y', value:'y'},
                    { xtype: 'button', text: 'gri', value:'gri'},
                    { xtype: 'button', text: 'riz', value:'riz'},
                    { xtype: 'button', text: 'izY', value:'izy'},
                    { xtype: 'button', text: 'RGB', value:'rgb', pressed:true}
                ]
            }]
        }]
    });


    var formDetail = Ext.widget({
        xtype: 'form',
        id: 'formDetail',
        itemId: 'formDetail',
        bodyStyle:'padding:10px',
        defaultType: 'textfield',
        width:380,
        items: [{
            xtype:'fieldset',
            defaultType: 'textfield',
                border: false,
            fieldDefaults: {
                labelWidth: 80,
            },
            items: [{
                fieldLabel: 'Release',
                name: 'name',
            },{
                fieldLabel: 'Field Name',
                name: 'display_name',
            },{
                fieldLabel: 'Tile Name',
                name: 'tilename',
            },{
                fieldLabel: 'RA (deg)',
                name: 'ra',
            },{
                fieldLabel: 'Dec (deg)',
                name: 'dec',
            },{
                //xtype: 'checkbox',
                xtype: 'checkboxfield',
                name:'flag_reject',
                boxLabel:'Add to blacklist',
                handler:function ( checkbox, checked){
                    AceptRejectTile(checkbox,checked);
                }
            },{
                xtype:'textarea',
                itemId: 'ratingComment',
                fieldLabel: 'Comment',
                labelAlign:'top',
                name: 'comment',
                readOnly:false,
                anchor:'100%',
            },{
                xtype:'button',
                text:'Submit',
                handler: function(btn) {
                    setTileComments(btn);
                }
            }]
        }]
    });


    var processesGrid = Ext.create('Ext.grid.Panel', {
        store: storeProcesses,
        region: 'south',
        layout: 'fit',
        columns: [{
            text: 'Process ID',
            dataIndex: 'process_id',
            flex:1,
            renderer: function(value,obj) {
                return Ext.String.format('<a href="#">{0}</a>', value);
            } 
        },
        { text: 'Date', dataIndex: 'start_time', width:120},
        { 
            text: 'Readme',
            dataIndex: 'readme',
            width:60,
            renderer: function(value,obj) {
                if (value){
                    return '<a href="#" ><img border="0" style="width: 12px; height: 15px;" src="/static/images/notepad_icon.png"></a>'
                }
            } 
        },{ 
            text: 'Comments',
            dataIndex: 'data',
            width:70,
            renderer: function(value,obj) {
                return '<a href="#" ><img border="0" style="width: 12px; height: 15px;" src="/static/images/notepad_icon.png"></a>'
            } 
        }
        ],
        height: 200,
        listeners: {
            cellclick: function(grid,td,cellIndex,record){
                // ao clicar em uma celula 
                if (cellIndex == 0) {
                    // Process Id - Abre o ProductLog
                    url = Ext.String.format("/showFile/{0}/productLog_{1}.xml",record.get('process_id'),record.get('hid'));
                    view_qa_product_log(url);
                }
                if (cellIndex == 2){
                    // Readme Abre o PopupMsg do readme
                    showProcessReadme(record);
                }
                if (cellIndex == 3){
                    // Readme Abre o PopupMsg do readme
                    getProcessComments(record.get('process_id'));
                }
            }
        }

    });

    // ===============================< Exposures COMPONENTS >===============================
    ExposuresModel = Ext.define('ExposuresModel',{
        extend: 'Ext.data.Model',
        fields: [
        {name:'expnum', type:'string', mapping:'EXPNUM'},
        {name:'date_obs', type:'date', mapping:'DATE_OBS'},
        {name:'object', type:'string', mapping:'OBJECT'},
        {name:'band', type:'string', mapping:'BAND'},
        {name:'exptime', type:'float', mapping:'EXPTIME'},
        {name:'airmass', type:'float', mapping:'AIRMASS'}
        ]
    });
    
    ExposuresStore = Ext.create('Ext.data.Store', {
        extend: 'Ext.data.Store',
        model:  'ExposuresModel',
        remoteFilter: true,
        proxy: {
            type: 'ajax',
            url: '/DVIEW/getTileExposures',
            reader: {
                type: 'json',
                root: 'data',
            }
        }
    });

    Ext.define('ExposuresGrid',{
        extend: 'Ext.grid.Panel',
        alias : 'widget.exposuresgrid',
        store: ExposuresStore,
        layout: 'fit',
        title: 'Exposures',
        autoScroll:true,
        columns: [{
            text: 'Exposure ID',
            dataIndex: 'expnum',
        },{
            xtype: 'datecolumn',
            text: 'Date',
            dataIndex: 'date_obs',
            format:'Y-m-d H:m:s',
            width:120
        },{
            text: 'Object Name',
            dataIndex: 'object',
            flex:1
        },{
            text: 'Filter',
            dataIndex: 'band',
        },{
            text: 'ExpTime (s)',
            dataIndex: 'exptime',
        },{
            text: 'Airmass',
            dataIndex: 'airmass',
            renderer: Ext.util.Format.numberRenderer('0.00')
        }],
    })

    // ===============================< FITS IMAGES COMPONENTS >===============================
    FitsImagesModel = Ext.define('FitsImagesModel',{
        extend: 'Ext.data.Model',
        fields: [
        {name:'band', type:'string', mapping:'BAND'},
        {name:'run',  type:'string', mapping:'RUN'},
        {name:'path', type:'string', mapping:'PATH'},
        {name:'url', type:'string'},
        ]
    });

    FitsImagesStore = Ext.create('Ext.data.Store', {
        extend: 'Ext.data.Store',
        model:  'FitsImagesModel',
        remoteFilter: true,
        proxy: {
            type: 'ajax',
            url: '/DVIEW/getFitsImage',
            reader: {
                type: 'json',
                root: 'data',
            }
        }
    });

    Ext.define('FitsImagesGrid',{
        extend: 'Ext.grid.Panel',
        alias : 'widget.fitsimagesgrid',
        store: FitsImagesStore,
        layout: 'fit',
        title: 'FITS Images',
        autoScroll:true,
        columns: [{
            text: 'Run Id',
            dataIndex: 'run',
            flex:1
        },{
            text: 'Filter',
            dataIndex: 'band',
            width:60,
            align:'center'
        },{
            text: 'Download',
            dataIndex: 'url',
            width:60,
            align:'center',
            renderer: function(value,obj) {
                if (value){
                    return Ext.util.Format.format("<a href=\"{0}\" ><img src=\"/static/images/picture_save.png\"></a>", value)
                }
            }
        }],
        bbar:['Right click "Save link as" to download files']

    })

    var TileList = Ext.define('TileList',{
        extend: 'Ext.grid.Panel',
        alias : 'widget.tilelist',
        store: store,
        layout: 'fit',
        columns: [{
            text: 'Tile Name',
            dataIndex: 'tilename',
            renderer: function(value,obj) {
                return Ext.String.format('<a href="#" >{0}</a>', value);
            } 
        },{
            text: 'RA (deg)',
            dataIndex: 'ra'
        },{ 
            text: 'Dec (deg)',
            dataIndex: 'dec'
        },{ 
            text: 'Status',
            dataIndex: 'flag_reject',
            width:60,
            align: 'center',
            renderer: function(value,obj) {
                if (value){
                    return '<img src="/static/images/warning.gif" style="border-width:0px;" alt="Tile in Blacklist" title="Tile in Blacklist"/>';
                }
            } 
        },{
            text: 'Comments',
            dataIndex: 'comments',
            align: 'center',
            width:80,
            renderer: function(value,obj) {
                return '<a href="#" >'+value+'</a>'
            } 
        },{
            text: 'Last Comment',
            dataIndex: 'last_comment',
            flex:1
        }],
        tbar:[{
            xtype: 'button',
            text: 'Download',
            disabled:true
        }],
        bbar: Ext.create('Ext.PagingToolbar', {
            store: store,
            displayInfo: true,
            displayMsg: 'Displaying tiles {0} - {1} of {2}',
            emptyMsg: "No tiles to display",
        }),
        listeners: {
            cellclick: function(grid,td,cellIndex,record){
                // ao clicar em uma celula 
                // So exibe a janela de detalhe se clicar na cell com nome da tile
                if (cellIndex == 0) {
                    showTileDetail(record);
                }
                if (cellIndex == 4) {
                    // Comments
                    showTileComments(record);
                }
                if (cellIndex == 5) {
                    // Last Comments
                    showTileComments(record);
                }
            }
        }
    });

    // ===============================< BLACK LIST TILE COMPONENTS >===============================
    // BlacklistTileModel
    var blacklistTileModel = Ext.define('BlacklistTileModel',{
        extend: 'Ext.data.Model',
        fields: ['tag_id','name','version','release_date','description','doc_url','field_id','field_name','display_name','tiletag_id','tile_id','tilename', 'ra','dec','g','r','i','z','y','gri','riz','izy','rgb','comments','zoom',
        {name:'flag_reject',type:'boolean'},
        {
            // cada registro da store, vai receber um atributo default_img que vai ser usado pelo template
            name: 'default_img',
            convert: function(value, record) {
                // Recuperar o filtro/band padrao ou selecionado.
                filter = getDefaultFilter();
                // retorna para o atributo novo o valor do atributo referente ao filtro
                return record.get(filter);
            }
        }]
    });
    // BlacklistTileStore
    blacklistTileStore = Ext.create('Ext.data.Store', {
        extend: 'Ext.data.Store',
        model:  'BlacklistTileModel',
        pageSize: 100,
        autoSync: true,
        remoteFilter: true,
        filters:[{
            property: 'flag_reject',
            value   : true
        }],
        proxy: {
            type: 'ajax',
            url: '/DVIEW/view_tile_mosaic_json?'+parametros,
            reader: {
                type: 'json',
                root: 'tiles',
                totalProperty: 'totalCount'
            }
        }
    });
    // TODO: este load deveria ser no TabActive
    blacklistTileStore.load();
    
    // BlacklistTileGrid
    Ext.define('BlacklistTileGrid',{
        extend: 'Ext.grid.Panel',
        alias : 'widget.blacklisttilegrid',
        store: blacklistTileStore,
        layout: 'fit',
        title: 'Tiles added to the blacklist',
        titleAlign:'center',
        autoScroll:true,
        columns: [{
            text: 'Tile Name',
            dataIndex: 'tilename',
            renderer: function(value,obj) {
                return Ext.String.format('<a href="#" >{0}</a>', value);
            } 
        },{
            text: 'RA (deg)',
            dataIndex: 'ra'
        },{ text: 'Dec (deg)',
            dataIndex: 'dec'
        },{
            text: 'Comments',
            dataIndex: 'comments',
            align: 'center',
            flex:1,
            renderer: function(value,obj) {
                return '<a href="#" >'+value+'</a>'
            } 
        }],
        tbar:[{
            xtype: 'button',
            text: 'Download',
            disabled:true
        }],
        listeners: {
            cellclick: function(grid,td,cellIndex,record){
                // ao clicar em uma celula 
                // So exibe a janela de detalhe se clicar na cell com nome da tile
                if (cellIndex == 0) {
                    showTileDetail(record);
                }
                if (cellIndex == 3) {
                    showTileComments(record);
                }
            }
        }
    });
    
    Ext.define('BlacklistTileView',{
        extend: 'Ext.view.View',
        alias : 'widget.blacklisttileview',
        store: blacklistTileStore,
        layout: 'fit',
        autoScroll:true,
        tpl: [
            '<tpl for=".">',
                '<div class="thumb-wrap" id="blacklisttile_{tilename:stripTags}">',
                    '<div class="thumb"><img src="{default_img}" title="{tilename:htmlEncode}"></div>',
                    '<span class="x-editable">{tilename:htmlEncode}</span>',
                '</div>',
            '</tpl>',
            '<div class="x-clear"></div>'
        ],
        multiSelect: false,
        trackOver: true,
        overItemCls: 'x-item-over',
        itemSelector: 'div.thumb-wrap',
        emptyText: 'No images to display',
        prepareData: function(data) {
            Ext.apply(data, {
                ra: Ext.util.Format.number(data.ra, '0.00'),
                dec: Ext.util.Format.number(data.dec, '0.00'),
            });
            return data;
        },
        listeners: {
            selectionchange: function(dv, nodes ){
                showTileDetail(nodes[0]);
            }
        }
    });

    // BlacklistTilePanel
    Ext.define('BlacklistTilePanel',{
        extend: 'Ext.Panel',
        alias : 'widget.blacklisttilepanel',
        layout: 'border',
        title: 'Blacklist',
        items:[{
            xtype:'blacklisttilegrid',
            region:'west',
            width:410,
            collapsible:true,
            split: true,
        },{
            xtype:'blacklisttileview',
            region:'center'
        }],
        bbar: Ext.create('Ext.PagingToolbar', {
            store: blacklistTileStore,
            displayInfo: true,
            displayMsg: 'Displaying tiles {0} - {1} of {2}',
            emptyMsg: "No tiles to display",
        }),
    });
    
    
    // ===============================< Tile Comments  COMPONENTS >===============================
    TileComments = Ext.define('TileCommentModel',{
        extend: 'Ext.data.Model',
        fields: ['comments', 'date', 'user_id', 'tiletag_id','display_name'],
        proxy: {
            type: 'ajax',
            url: '/DVIEW/setTileComments',
            writer: {
                type: 'json',
                root: 'data',
                writeAllFields: true,
                encode: true,
                allowSingle: true,
            }
        }
    });

    var storeTileComments = Ext.create('Ext.data.Store', {
        model: 'TileCommentModel',
        pageSize: 100,
        autoSync: true,
        remoteFilter: true,
        proxy: {
            type: 'ajax',
            url: '/DVIEW/getTileComments',
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'totalCount'
            },
        }
    });
    
    Ext.define('TileCommentGrid',{
        extend: 'Ext.grid.Panel',
        alias : 'widget.tilecommentgrid',
        store: storeTileComments,
        layout: 'fit',
        itemId: 'tileCommentGrid',
        autoScroll:true,
        cls: 'comment-grid',
        viewConfig: {
            itemId: 'view',
            plugins: [{
                pluginId: 'preview',
                ptype: 'preview',
                bodyField: 'comments',
                expanded: true
            }],
        },
        columns: [{
            text: 'User',
            dataIndex: 'display_name',
            flex:1
        },{
            text: 'Date',
            dataIndex: 'date',
            width:120
        }]
    });
    Ext.define('TileCommentPanel',{
        extend: 'Ext.Panel',
        alias : 'widget.tilecommentpanel',
        layout: 'border',
        items:[{
            xtype: 'tilecommentgrid',
            region: 'center',
            split:true
        }/*,{
            xtype: 'panel',
            region: 'south'
        }*/],
    });
    
    // ===============================< Zoomify  COMPONENTS >===============================
    Ext.define('ZoomifyPanel', {
        extend: 'Ext.Panel',
        alias: 'widget.zoomifypanel',

        initComponent: function(){
            Ext.apply(this, {
                title:'Zoom',
                layout: 'fit',
                //html:'<div id="zoomify" class="zoomify_image"></div>',
                tbar:[{
                    xtype: 'button',
                    itemId:'btnLoad',
                    text: 'Load',
                    scale:'large',
                    scope:this,
                    iconCls:'icon-map-magnify',
                    handler: function(btn) {
                        this.loadImage();
                    }
                }]
            });
            this.callParent(arguments);
        },

        makeContainer: function(record){
            //console.log('ZoomifyPanel - makeContainer(%o)',record);
            
            this.record = record;
            // remover todos os item do painel principal
            this.removeAll();
            // criar um id para o painel que vai receber o zommify, usando o tilename
            this.identifier =  Ext.util.Format.format("zoomify_{0}", record.get('tilename'));
            // criar um painel que vai receber o zoomify
            var panel = Ext.create('Ext.Panel', {
                //title: this.identifier,
                layout: 'fit',
                //cls:'zoomify_image',
                id: this.identifier
            })
            // Adicionar o Painel no painel principal
            this.add(panel);

            this.down('#btnLoad').enable();
        },

        loadImage:function(){
            //console.log('ZoomifyPanel - loadImage()');

            // Criar uma instancia para o L.map usando o identifier igual do painel que vai receber
            // adicionar o -body que e a area utilizavel do painel
            this.map = L.map(this.identifier+'-body').setView(new L.LatLng(0,0), 0);

            // Instanciar o zoomify passando o path da imagem e as configuracoes iniciais
            // Obs: Concatenar uma barra no final do path por que a zoomify esperar que tenha barra no final
            L.tileLayer.zoomify(this.record.get('zoom')+"/", { 
                width: 10000, 
                height: 10000,
                tolerance: 0.8,
                //attribution: 'Teste'
            }).addTo(this.map);

            this.down('#btnLoad').disable();
        },

        resetContainer:function(){
            //console.log('ZoomifyPanel - resetContainer()');
            // TODO: resetar o painel para quando a imagem sai fora da area
        }
    });

    
    
    
    
    
    // ===============================< VIEWPORT >===============================
    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [{
            region: 'north',
            html: '<div align="center" id="tile_viewer_title" style="background:#E0E0E0;"><h2>Tile Viewer</h2><a href="#" style="top:0px" class="help_tool_pl" onclick="javascript:portalHelp(\'TileViewer\',\'Tile Viewer\',\'http://twiki.linea.gov.br/bin/view\');"><img src="/static/images/help_icon.png" style="border-width:0px;" alt="Help" title="Help"/></a></div>',
            border: false,
            margins: '15 0 15 0',
        },{
            region: 'center',
            xtype: 'tabpanel',
            itemId:'tileTabPanel',
            id:'tileTabPanel',
            title: ' ',
            titleAlign:'center',
            activeTab: 0,
            items:[{
                title: 'Mosaic',
                layout:'fit',
                items:[
                {
                    xtype: 'tilemosaic'
                }]
            },{
                title: 'List',
                layout:'fit',
                items:[{
                    xtype: 'tilelist'
                }]
            },{
                xtype: 'blacklisttilepanel'
            }]

        }]
    });

    function navigation(sentido){
        //console.log('navigation');
        pDataView = Ext.getCmp('images-view')
        view = pDataView.down('#dataview');
        selectModel = view.getSelectionModel();
        selected = selectModel.getSelection();
        atual = selected[0];
        index = store.indexOf(atual);

        if (sentido == 'prev'){
            if (index > 0){
                prev = store.getAt(index-1);
                selectModel.select(prev);
                loadDetails(prev);
            }
        }
        else {
           if (index < store.count()){
                next = store.getAt(index+1);
                selectModel.select(next);
                loadDetails(next);
            }
        }
    }

	
    // ---------------------------- WINDOW DETAIL -----------------------------
    function onClickTilename(index){
        //console.log('onClickTilename(%s)',index);
        // TODO: passar como parametro a store que esta sendo usada, por que pode ser a store da blacklist
        record = store.getAt(index);
        showTileDetail(record);
    }

    function loadDetails(record){
        console.log('loadDetails(%o)',record);

        // Recuperar a window
        var w = Ext.getCmp('windowDetail');
        // Recuperar o tabpanel
        var tabpanel = w.down('#windowDetailTabpanel');
        // Setar sempre a primeira aba como ativa
        tabpanel.setActiveTab(0);

        // Carregar o Form
        form = formDetail.getForm();
        form.loadRecord(record);

        // Coments
        storeTileComments.clearFilter(true);
        storeTileComments.filter('tiletag_id',record.get('tiletag_id'));

        // Carregar os Processos
        storeProcesses.clearFilter(true);
        storeProcesses.filter('tile_id',record.get('tile_id'));

        // ZOOM
        var zoomifyPanel = w.down('#zoomifyPanel');
        // verificar se a imagem tem zoom
        if (record.get('zoom') != ''){
            // Se tiver ativa a aba zoom
            zoomifyPanel.enable();
            // chamar o metodo makeContainer para criar o painel que vai receber o zoomify
            // passar o record como parametro para que o painel tenha o id referente ao record
            zoomifyPanel.makeContainer(record);
        }
        else {
            // se nao tiver desativa a aba zoom
            zoomifyPanel.disable();
        }

        // Exposures
        ExposuresStore.clearFilter(true);
        ExposuresStore.filter([
            Ext.create('Ext.util.Filter', {property: "name", value: record.get('name')}),
            Ext.create('Ext.util.Filter', {property: "tilename", value: record.get('tilename')}),
        ])

    }

    function showTileDetail(record){
        console.log('showTileDetail(%o)',record);

        var tile = record;

        var filter = getFilterOnImagePanel();
        if (filter==false){
            detailFilter = getDefaultFilter();
        }

        // TODO Melhorar esse if trocar o evento selectionchange por click talvez.
        if (tile) {

            var src = tile.get(detailFilter);

            var image = Ext.create('Ext.Component', {
                html: '',
                id: 'cmp_tile_img',
                itemId:'tag_img',
                autoEl: {
                    tag: 'img',
                    src: src
                },
                width: 500,
                height:500
            });

            var imagePanel = Ext.widget({
                xtype: 'panel',
                id: 'img-detail-panel',
                itemId: 'img-detail-panel',
                items:[image],
                dockedItems: [{
                    itemId: 'tbBands',
                    xtype: 'toolbar',
                    dock: 'top',
                    layout: {
                        type:'hbox',
                        align:'stretch'
                    },
                    items:[{
                        xtype: 'buttongroup',
                        id:'detailBtnGrpBands',
                        itemId:'detailBtnGrpBands',
                        border:false,
                        flex:1,
                        layout: {
                            type:'hbox',
                            align:'stretch'
                        },
                        defaults: {
                            enableToggle:true,
                            toggleGroup: "filter_imageDetail",
                            flex:1,
                            toggleHandler: function(btn) {
                                band = btn.getText();
                                changeImageBand(band);
                            }
                        },
                        items: [
                            { xtype: 'button', text: 'g', value:'g'},
                            { xtype: 'button', text: 'r', value:'r'},
                            { xtype: 'button', text: 'i', value:'i'},
                            { xtype: 'button', text: 'z', value:'z'},
                            { xtype: 'button', text: 'Y', value:'y'},
                            { xtype: 'button', text: 'gri', value:'gri'},
                            { xtype: 'button', text: 'riz', value:'riz'},
                            { xtype: 'button', text: 'izY', value:'izy'},
                            { xtype: 'button', text: 'RGB', value:'rgb'}
                        ]
                    },{
                        xtype: 'button',
                        text: 'FITS Image',
                        align:'stretch',
                        handler: function(){
                            getFitsImage();
                        }
                    }]
                },{
                    xtype: 'toolbar',
                    dock: 'left',
                    layout: {
                        type:'vbox',
                        pack:'center',
                        align:'center'
                    },
                    items: [{
                        xtype: 'button',
                        iconCls:'icon-left',
                        scale:'large',
                        handler: function(btn) {
                            navigation('prev');
                        }
                    }]
                },{
                    xtype: 'toolbar',
                    dock: 'right',
                    layout: {
                        type:'vbox',
                        pack:'center',
                        align:'center'
                    },
                    items: [{
                        xtype: 'button',
                        iconCls:'icon-right',
                        scale:'large',
                        handler: function(btn) {
                            navigation('next');
                        }
                    }]
                }]
            });


            if (w = Ext.getCmp('windowDetail')){

                p = w.down('#img-detail-panel');
                img = p.down('#tag_img');
                p.remove(img);
                p.add(image);
                w.setTitle(tile.get('tilename'));
                w.show();
                // Setando o Filtro Padrao
                //setFilterOnImagePanel(filter);
            }
            else {
                windowDetail = Ext.create('Ext.Window', {
                    id:'windowDetail',
                    title: tile.get('tilename'),
                    width: 980,
                    height: 600,
                    closeAction:'hide',
                    resizable:false,
                    maximizable:true,
                    constrainHeader:true,
                    autoShow: true,
                    modal: true,
                    layout:'fit',
                    items: [{
                        xtype: 'tabpanel',
                        itemId: 'windowDetailTabpanel',
                        activeTab: 0,
                        items:[{
                            xtype:'panel',
                            title:'Tile',
                            layout:'fit',
                            items:[{
                                xtype: 'panel',
                                layout:'border',
                                items:[{
                                    xtype:'panel',
                                    region:'center',
                                    items:[
                                        imagePanel
                                    ]
                                },{
                                    xtype:'panel',
                                    region:'east',
                                    width:380,
                                    items:[
                                        formDetail,
                                        processesGrid
                                    ]
                                }]
                            }]
                        },{
                            xtype:'zoomifypanel',
                            itemId: 'zoomifyPanel',
                        },{
                            xtype:'panel',
                            title: 'Objects',
                            disabled:true
                        },{
                            xtype:'exposuresgrid',
                            title:'Exposures',
                            autoScroll: true,
                        },{
                            xtype:'tilecommentpanel',
                            title:'Comments'
                        }]
                    }],
                });
            }

            // Carregando os dados para a window
            loadDetails(tile);
        }
    }

    function changeImageBand(band){
        //console.log("changeImageBand(%o)",band);

        b = Ext.util.Format.lowercase(band);

        w = Ext.getCmp('windowDetail');
        //p = Ext.getCmp('img-detail-panel');
        p = w.down('#img-detail-panel');
        img = p.down('#tag_img');
        p.remove(img);

        pDataView = Ext.getCmp('images-view')
        view = pDataView.down('#dataview');
        selectModel = view.getSelectionModel();
        selected = selectModel.getSelection();
        record = selected[0];

        src = record.get(b);

        var image = Ext.create('Ext.Component', {
            html: '',
            id: 'cmp_tile_img',
            itemId:'tag_img',
            autoEl: {
                tag: 'img',
                src: src
            },
            width: 500,
            height:500
        });

        p.add(image);
        w.show();
    }

    function getDefaultFilter(){
        //console.log('getDefaultFilter()');
        var filter = 'rgb';
        // Descobrir qual o filtro selecionado como Default
        // Recuperar o Buttongroup, para cada button no grupo verificar se ele esta pressionado
        var defaultFilter = Ext.getCmp('dataViewBtnGrpBands');
        defaultFilter.items.each(function( btn ) {
            if (btn.pressed){
                filter = btn.value;
            }
        });

        return filter;
    }

    function getFilterOnImagePanel(){
        //console.log('getFilterOnImagePanel()');
        // Descobrir qual o filtro selecionado na janela Detail
        var filter = false;
        var btnGrp = Ext.getCmp('detailBtnGrpBands');
        if (btnGrp){
            //console.log(btnGrp);
            btnGrp.items.each(function( btn ) {
                //console.log(btn.pressed);
                if (btn.pressed){
                    //console.log("BOTAO MARCADO %o",btn);
                    //console.log("retornando %s",btn.value);
                    filter = btn.value;
                }
            });
        }
        return filter;
    }

    function setFilterOnImagePanel(filter){
        //console.log('setFilterOnImagePanel()');
        // Descobrir qual o filtro selecionado como Default
        if (!filter){
            var filter = getDefaultFilter();
            //console.log('FILTER DEFAULT = %s',filter);
        }
        var btnGrp = Ext.getCmp('detailBtnGrpBands');
        btnGrp.items.each(function( btn ) {
            if (btn.value == filter){
                //console.log("BOTAO A SER MARCADO %o",btn);
                btn.toggle();
                return btn.value;
            }
        });
    }

   
    
    /**
     * filterMosaic
     * @param {String} [filter] Nome da banda/filtro que vai ser exibida na dataView principal.
     * Se nao tiver filtro, executa o metodo getDefaultFilter()
     * recupera a store e em cada registro seta um valor default que vai ser usado no template
     */
    function filterMosaic(filter){
        //console.log('filterMosaic(%s)',filter);    
        
        // Se nao tiver filtro como parametro
        if(!filter){
            // Recupera o value do botao pressionado
            filter = getDefaultFilter();
        }
        // Recupera o painel com a dataview (pelo id)   
        iv = Ext.getCmp('images-view');
        // Recupera a dataview (pelo itemId)
        dv = iv.down('#dataview');
        // Recupera a Store da dataview
        st = dv.getStore();
        // Para cada registro na Store setar um novo atributo, que vai ser usado no template
        // usando esse atributo como coringa, passando o valor do atributos com nomes diferentes para um unico atributo
        // para nao usar ifs no template
        st.each(function(record,idx){
            // recupero o valor do atributo indexado pelo filtro ex: record.get(rgb)
            // e seto no atributo default
            record.set('default_img',record.get(filter));
        }); 
        
        // Refresh a DataView - nao faz o get novamente apenas atualiza todos os templates da dataview
        // IMPORTANTE - nao atualiza a store, nao dispara o load(), nao faz o request de novo.
        dv.refresh();
    }


    /**
     * setTileComments
     * @param {Ext.button.Button} [btn]
     * Ao clicar no botao submit, recupera o form, se tiver comentario cria um 
     * record TileCommentModel, e faz o submit
     * em caso de sucesso, atualiza a store de comentarios, limpa os campos.
     * em caso de failure, exibe um msgBox com a mensagem de erro vinda do Model.py
     */    
    function setTileComments(btn){
        //console.log('setTileComments()');
        
        // Recuperar o Form Panel
        fp = btn.up('#formDetail');
        // Recuperar o BaseForm
        form = fp.getForm();
        // Verifica se os campos do formulario estao preenchidos corretamente
        if (form.isValid()){ 
            values = form.getValues();
            vComments = values.comment;
            record = form.getRecord();
            if (vComments) {
                // Se tiver um comentario criar um record comentario
                
                //recuperar a tiletag_id 
                rTiletag_id = record.get('tiletag_id');
                // Cria um record TileCommentModel
                commentRecord = Ext.create('TileCommentModel', {comments: vComments, tiletag_id: rTiletag_id});
                // Executa o metodo save para enviar o post
                commentRecord.save({ 
                    success: function(record, operation)
                    {
                        // Caso a resposta seja de sucesso recarregar a store de comentarios
                        storeTileComments.load();
                        // Recuperar o field de comentario
                        fcomment = form.findField('comment');
                        // Setar um value vazio
                        fcomment.setValue("");
                        // Exibir uma mensagem de sucesso
                        // TODO: USAR UM TOAST mensagem tem que desaparecer sozinha
                        Ext.Msg.alert('Status', 'Changes saved successfully.');
                    },
                    failure: function(record, operation)
                    {
                        // Recuperar a resposta e fazer o decode no json.
                        response = operation.request.proxy.reader.jsonData;
                        if (response) {
                            // Exibe a msgBox de erro
                            Ext.Msg.alert('Status', response.msg);
                        }
                        else {
                            // Se nao tiver mensagem de erro ou retorno e por que e um erro do servidor.
                            //console.log('server-side failure with status code ' + response.status);
                        }
                    }
                });
            }
        }
        else {
            // Formulario tem campos que nao estao preenchidos corretamente
        }
    }
    
    /**
     * AceptRejectTile
     * @param {Ext.form.field.Checkbox} [checkbox]
     * @param {boolean} [checked]
     * Ao clicar na checkbox de add tile to blacklist
     * mostra um prompt para confirmar, a inclusao da tile, o preenchimento do campo e opcional
     * se cancelar não faz nada, se der ok executa o metodo requestAcceptReject
     * que envia para o model.
     */
    function AceptRejectTile(checkbox,checked){
        //console.log('AceptRejectTile(%o,%o)',checkbox,checked);
    
        // Recuperar o Form Panel
        fp = checkbox.up('#formDetail');
        // Recuperar o BaseForm
        form = fp.getForm();
        // Recuperar o Model 
        record = form.getRecord();
        
        // Testa se o valor e diferente do que ta no registro para evitar que na navegacao dispare o evento
        // ao trocar de tile se o valor for diferente tava disparando o request, com esse if isso foi corrigido.
        if (record.get('flag_reject') != checked) {
            // Dependendo do valor da flag mostra titulo e mensagem diferente.
            if (checked) {
                title = "Adding to the blacklist";
                msg = "Please, make a statement saying why you are adding this tile to the blacklist.";
            }
            else {
                title = "Removing from the blacklist"
                msg = "Please, make a statement saying why you are removing this tile from the blacklist.";
            }
            // Antes de Gravar Mostar um popup pedindo para que o usuario entre com um comentario
            Ext.MessageBox.show({
               title: title,
               msg: msg,
               width:300,
               buttons: Ext.MessageBox.OKCANCEL,
               multiline: true,
               scope:this,
               fn: function (btn, text) {
                    if (btn == "ok") {
                        // Executa a funcao que vai postar o status da tile
                        requestAcceptReject(record,checked,text);
                    }
                    else {
                        // Nao faz nada e volta a checkbox para o estado que estava
                        checkbox.reset();
                    }
                }
           });
        }
    }
    
    /** 
     * requestAcceptReject
     * @param {Ext.data.Model} [record]
     * @param {boolean} [flag_reject]
     * @param {boolean} [comment] Comentario feito no prompt. 
     * Envia um Requisicao Ajax para o Controler.py -> Model.py
     * passando como parametros: tiletag_id, tilename, comment, flag_reject
     * em caso de sucesso, atualiza as stores relacionadas, atualiza o form
     * em caso de falha mostra uma mensagem.
     */
    function requestAcceptReject(record, flag_reject, comment){
        //console.log('requestAcceptReject(%o)',record);
        // Envia um Ajax Request com os paramtros
        Ext.Ajax.request({
            url: '/DVIEW/accept_reject_tile',
            params: {
                tiletag_id: record.get('tiletag_id'),
                tilename: record.get('tilename'),
                comment: comment,
                flag_reject: flag_reject
            },
            success: function(response, opts) {
                // OBS: Particularidade do Ajax.request e preciso tratar o valor de success
                // a failure so funciona para mensagens retornadas pelo servidor web

                // Recuperar a resposta e fazer o decode no json.
                var obj = Ext.decode(response.responseText);

                if (obj.success == "true") {
                    // Se o atributo success for verdadeiro atualiza a stora princial com as tiles
                    // isso vai fazer com que form atualize a flag marcada.
                    store.load();
                    // Atualizar tambem a store de comentarios
                    storeTileComments.load();
                    // Alterar o record acrescentando o valor alterado, nesse momento poderia pegar o mesmo record direto da store que ja esta atualizada, mas como e um campo so, foi mais facil.
                    record.set('flag_reject',flag_reject);
                    // Recuperar o Form
                    frm = Ext.getCmp('formDetail').getForm();
                    // Atualizar o record no form pelo record alterado
                    frm.loadRecord(record);
                    //TODO: Mostar um mensagem de sucesso
                    
                }
                else {
                    // Se Model.py retornar alguma falha exibe a mensagem
                    Ext.Msg.alert('Status', obj.msg);
                    // FIXME: em caso de falha deveria voltar a checkbox para o estado anterior
                }
            },
            failure: function(response, opts) {
                //console.log('server-side failure with status code ' + response.status);
            }
        });
    }
    

    function showProcessReadme(record){
        //console.log('showProcessReadme(%o)',record);

        Ext.create('Ext.window.Window', {
            title: Ext.String.format("Readme from process {0}",record.get('process_id')),
            height: 500,
            width: 400,
            modal: true,
            constrainHeader:true,
            layout: 'fit',
            autoScroll: true,
            html: record.get('readme')
        }).show();
    }

    function getProcessComments(process_id){
        //console.log('getProcessComments(%s)',process_id);

        Ext.Ajax.request({
            url: '/viewComments',
            params: {
                process_id: process_id,
            },
            success: function(response, opts) {
                // Esse request esta usando um metodoq que ja existia e que retorna um html ao invez de um json
                // O que dificulta a tratar os erros e a alterar o layout.
                // TODO: talvez fosse interessante fazer o metodo retornar alem de um um html um json

                // Recuperar a resposta e fazer o decode no json.
                var obj = Ext.decode(response.responseText);

                if (obj.html){
                    // Cria e exibe uma window com o conteudo
                    Ext.create('Ext.window.Window', {
                        title: Ext.String.format("Comments from process {0}",process_id),
                        height: 500,
                        width: 400,
                        modal: true,
                        constrainHeader:true,
                        layout: 'fit',
                        autoScroll: true,
                        html: obj.html
                    }).show();
                }
                else {
                    // TODO: tratar erros
                }
            },
            failure: function(response, opts) {
                //console.log('server-side failure with status code ' + response.status);
            }
        }); 
    }
    
    function showTileComments(record){
        //console.log('showTileComments(%o)',record);

        var wcomments = Ext.create('Ext.window.Window', {
            title: Ext.String.format("Comments from Tile {0}",record.get('tilename')),
            width: 600,
            height: 500,
            modal: true,
            constrainHeader:true,
            layout: 'fit',
            autoScroll: true,
            items:[{
                xtype:'tilecommentpanel'
            }]
        });

        var grid = wcomments.down('#tileCommentGrid');
        var store = grid.getStore();
        store.clearFilter(true);
        store.filter('tiletag_id',record.get('tiletag_id'));

        wcomments.show();
    }


    
    function getFitsImage(){
        console.log('getFitsImage()');

        // Recuperar a Window
        var w = Ext.getCmp('windowDetail');
        // Recuperar o Record
        var form = w.down('#formDetail').getForm();
        var record = form.getRecord();

        // Fazer o Filtro na Store FITS
        FitsImagesStore.clearFilter(true);
        FitsImagesStore.filter([
            Ext.create('Ext.util.Filter', {property: "name", value: record.get('name')}),
            Ext.create('Ext.util.Filter', {property: "tilename", value: record.get('tilename')}),
        ])

        var wFits =  Ext.create('Ext.window.Window', {
            title: Ext.String.format("FITS Images From Tile {0}",record.get('tilename')),
            width: 400,
            height: 300,
            modal: true,
            constrainHeader:true,
            layout: 'fit',
            autoScroll: true,
            items:[{
                xtype:'fitsimagesgrid',
                title:''
            }]
        });

        wFits.show();

    }

    function downloadFitsImage(record){
        console.log('downloadFitsImage(%o)',record);

        myWindow=window.open(record.get('url'),'_blank')
        myWindow.document.write(html);

    }
    
});





