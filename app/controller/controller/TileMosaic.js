Ext.define('TileViewer.controller.TileMosaic', {
    extend: 'Ext.app.Controller',

    stores: [
        'Tiles',
    ],

    models: [
        'TileModel'
    ],

    views: [
        'tile_mosaic.TileMosaicPanel',
        'TileViewer.view.tile_mosaic.TileMosaicView',
        'TileViewer.view.tile_mosaic.BandFilter'
    ],

    refs: [{
        ref: 'MosaicPanel',
        selector: 'tilemosaic'
    },{
        ref: 'MosaicView',
        selector: 'tilemosaicview'
    }],

    init: function() {
        console.log("TileMosaic - init()");


        // Load da Store
        this.getTilesStore().addListener('load',this.onTileStoreLoad, this);

        this.control({
            'buttongroup': {
                onfilter: function(){
                    console.log('onFilter');
                }
            }
        })

    },

    /**
     * onTileStoreLoad
     * Executado quando a Store Tiles e carregada
     * 
     */
    onTileStoreLoad: function(){
        console.log("onTileStoreLoad()");

        this.filterMosaic();
    },

    /**
     * filterMosaic
     * @param {String} [filter] Nome da banda/filtro que vai ser exibida na dataView principal.
     * Se nao tiver filtro, executa o metodo getDefaultFilter()
     * recupera a store e em cada registro seta um valor default que vai ser usado no template
     */
    filterMosaic: function(){
        console.log("filterMosaic()");

        var view = this.getMosaicView();
        var store = view.getStore();

        var filter = 'rgb';

        store.each(function(record,idx){
            // recupero o valor do atributo indexado pelo filtro ex: record.get(rgb)
            // e seto no atributo default_img
            console.log(record.get(filter));
            record.set('default_img',record.get(filter));
            console.log(record);
        });

        // Atualiza a view
        view.refresh();
    }
});


