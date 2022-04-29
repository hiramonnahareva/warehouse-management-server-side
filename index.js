const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();

// middleware

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.auxit.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try{
        await client.connect();
        const itemsCollection = client.db('spicewarehouse').collection('items')
        app.get('/items', async(req, res)=> {
            const query = {}
            const cursor = itemsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items)

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