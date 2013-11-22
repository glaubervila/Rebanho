Ext.define('TileViewer.model.TileModel', {

    extend: 'Ext.data.Model',
    
    fields: [
        { name:'tag_id', type:'string' },
        { name:'name', type:'string' },
        { name:'version', type:'string' },
        { name:'release_date', type:'string' },
        { name:'description', type:'string' },
        { name:'doc_url', type:'string' },
        { name:'field_id', type:'string' },
        { name:'field_name', type:'string' },
        { name:'display_name', type:'string' },
        { name:'tiletag_id', type:'string' },
        { name:'tile_id', type:'string' },
        { name:'tilename', type:'string' },
        { name:'ra', type:'string' },
        { name:'dec', type:'string' },
        { name:'g', type:'string' },
        { name:'r', type:'string' },
        { name:'i', type:'string' },
        { name:'z', type:'string' },
        { name:'y', type:'string' },
        { name:'gri', type:'string' },
        { name:'riz', type:'string' },
        { name:'izy', type:'string' },
        { name:'rgb', type:'string' },
        { name:'zoom', type:'string' },
        { name:'comments', type:'string' },
        {
            name:'last_comment',
            type:'string',
            convert: function(value, record){
                return value.replace("\n<br>"," "); 
            }
        },
        {
            name:'flag_reject',
            type:'boolean'
        },
        {name: 'default_img', type: 'string'}
    ]
});
