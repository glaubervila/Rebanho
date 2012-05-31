Ext.define('Rebanho.view.Teste' ,{
    extend: 'Ext.form.Panel',

    alias : 'widget.panelteste',

    require:['Rebanho.store.Teste'],
    
    title: 'Painel DE TESTE',
    
    initComponent: function() {

        this.items = [
            {
                xtype:'combobox',
                store: {
                    fields: ['text'],
                    data: [
                        {text: 'Red'},
                        {text: 'Yellow'},
                        {text: 'Green'},
                    ]
                }
            },
            {
                xtype:'meucombo',
                id: 'teste',
            }

        ]
        var store = Ext.create('Rebanho.store.Fornecedores',{});
        
        store.load();
//         //console.log(this.store.data);
//         this.columns = [
//             {
//                 header: "Coluna1",
//                 dataIndex: 'id',
//             },{
//                 header: "Coluna2",
//                 dataIndex: 'descricao',
//             }
//         ]
        

        this.callParent(arguments);
    }
 }); 