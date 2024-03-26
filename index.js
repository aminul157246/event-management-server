const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 3000

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6v8amsy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        await client.connect();

        const VenuesCollection = client.db("eventDB").collection("venues");
        const dressCollection = client.db("eventDB").collection("dress");


        // venues 
        app.post('/venues', async (req, res) => {
            const event = req.body
            const result = await VenuesCollection.insertOne(event)
            res.send(result)
        })

        app.get('/venues', async (req, res) => {
            const result = await VenuesCollection.find().toArray()
            res.send(result)
        })
        // dress
        app.get('/dress', async (req, res) => {
            const result = await dressCollection.find().toArray()
            res.send(result)
        })





        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {


    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('CRUD  is running ......!')
})

app.listen(port, () => {
    console.log(`App is  listening on port ${port}`)
})