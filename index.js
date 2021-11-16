const express = require('express');
const { MongoClient } = require('mongodb');

const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ggtng.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('tourism');
        const servicesCollection = database.collection('services');

        const bookingsCollection = database.collection('booking');



        // GET Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting this service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })


        //GET API

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //GET ALL BOOKINGS
        app.get('/bookings', async (req, res) => {
            const cursor = bookingsCollection.find({});
            const bookings = await cursor.toArray();
            res.send(bookings);
        })

        //GET Booking
        app.get('/booking/:email', async (req, res) => {
            const cursor = bookingsCollection.find({ email: req.params.email });
            const bookings = await cursor.toArray();

            res.send(bookings);
        })
        //POST booking
        app.post('/booking', async (req, res) => {
            const newBooking = req.body;
            const result = await bookingsCollection.insertOne(newBooking);
            console.log('hitting', req.body);
            res.json(result);
        })

        //POST API

        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });
        //DELETE MY ORDER API
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingsCollection.deleteOne(query);
            console.log('deleting user with id', result);
            res.json(result);
        })
    }
    finally {

    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running...');
})

app.listen(port, () => {
    console.log('Running on port ', port);
})

