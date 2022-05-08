const express = require('express');
const cors= require('cors');
const port = process.env.PORT || 5000;
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion , ObjectId} = require('mongodb');
// const ObjectId = require('mongodb').ObjectId

// middleware'

app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.auxit.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try{
        await client.connect();
        const itemsCollection = client.db('spicewarehouse').collection('item')
        //auth
        // app.post('/login', async(req, res)=>{
        //     const user = req.body;
        //     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{
        //         expireIn: '1d'
        //     });
            
        // })
        // read items
        app.get('/item', async(req, res)=> {
            const query = {}
            const cursor = itemsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items)
        })
        
        app.get('/item/:id', async(req, res)=> {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const item = await itemsCollection.findOne(query);
            res.send(item);
        })

        // app.get('/items', async(req, res)=>{
        //     const email = req.query.email;
        //     const query = {email: email}
        //     const cursor = addItemCollection.find(query);
        //     const item = await cursor.toArray();
        //     res.send(item)
        // })

        app.post('/item', async(req, res)=>{
            const item = req.body;
            const result = await itemsCollection.insertOne(item);
            console.log (`user insert ${result.insertedId} `)
            res.send(result)
            console.log (result)
          })


       
        app.put('/item/:id', async(req, res)=> {
            const id = req.params.id;
            const updatedItem = req.body;
            const filter = {_id : ObjectId(id)};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    img: updatedItem.img,
                    name: updatedItem.name,
                    Price: updatedItem.Price,
                    quentity: updatedItem.quentity
                }
            };
            const result = await itemsCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })    

        // delete a item 
       
        app.delete('/item/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await itemsCollection.deleteOne(query);
            res.send(result);
        })
       
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