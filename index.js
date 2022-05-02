const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId

// middleware'

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.auxit.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try{
        await client.connect();
        // read items
        const itemsCollection = client.db('spicewarehouse').collection('items')
        app.get('/items', async(req, res)=> {
            const query = {}
            const cursor = itemsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items)
        })
      app.post('/items', async(req, res)=>{
        const item = req.body;
        const result = await itemsCollection.insertOne(item);
        console.log (`user insert ${result.insertedId} `)
        res.send(result)
      })
     
        // delete a item 
       /* 
        app.delete('/item/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await itemsCollection.deleteOne(query);
            res.send(result);
        }) */
       
    }
    finally{

    }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('welcome to our website')
})
app.listen(port, ()=>{
    console.log('check our website', port);
})