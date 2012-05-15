Ext.define('Rebanho.view.Teste' ,{
    extend: 'Ext.grid.Panel',

    alias : 'widget.testegrid',

    require:['Rebanho.store.Teste'],
//     store:'Teste',
    
    title: 'GRID DE TESTE',
    
    initComponent: function() {

        this.store = 'Teste';
        //console.log(this.store.data);
        this.columns = [
            {
                header: "Coluna1",
                dataIndex: 'id',
            },{
                header: "Coluna2",
                dataIndex: 'descricao',
            }
        ]
        this.callParent(arguments);
    }
 }); 