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
        const photographerCollection = client.db("eventDB").collection("photographer");
        const cateringCollection = client.db("eventDB").collection("catering");
        const entertainmentCollection = client.db("eventDB").collection("entertainment");

        const cartCollection = client.db("eventDB").collection('carts')




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


        // photographer
        app.get('/photographer', async (req, res) => {
            const result = await photographerCollection.find().toArray()
            res.send(result)
        })

        // catering
        app.get('/catering', async (req, res) => {
            const result = await cateringCollection.find().toArray()
            res.send(result)
        })

        // entertainment
        app.get('/entertainment', async (req, res) => {
            const result = await entertainmentCollection.find().toArray()
            res.send(result)
        })

        // cart 

        app.get('/carts', async (req, res) => {
            const email = req.query.email;
            console.log(email);
            const query = { 'cartItem.email' : email}
            const result = await cartCollection.find(query).toArray()
            console.log(result);
            res.send(result)

        })

        app.post('/carts', async (req, res) => {
            const item = req.body
            const result = await cartCollection.insertOne(item)
            res.send(result)
        })


        // estimated count 
        app.get('/count', async (req, res) => {
            const venues = await VenuesCollection.estimatedDocumentCount()
            const dress  = await dressCollection.estimatedDocumentCount()
            const  catering = await cateringCollection.estimatedDocumentCount()
            const entertainment = await entertainmentCollection.estimatedDocumentCount()
            const photographer = await photographerCollection.estimatedDocumentCount()
            res.send({ venues, dress, catering, entertainment, photographer })

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