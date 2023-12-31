const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Toy Car Store is Running');
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.d8lmf1g.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyCarCollection = client.db('ToyCarStore').collection('ToyGallery');
    const addToyCollection = client.db('ToyCarStore').collection('AddToy');

    app.get('/toyGallery', async (req, res) => {
      const result = await toyCarCollection.find().toArray();
      res.send(result);
    })

    app.post('/addToys', async (req, res) => {
      const body = req.body;
      const result = await addToyCollection.insertOne(body);
      res.send(result);
    })

    app.get('/allToys', async (req, res) => {
      const result = await addToyCollection.find({}).toArray();
      res.send(result);
    })

    app.delete('/allToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addToyCollection.deleteOne(query);
      res.send(result);
    })

    app.get('/allToys/:email', async (req, res) => {
      const result = await addToyCollection.find({ postedBy: req.params.email }).toArray();
      res.send(result);
      console.log(req.params.email);
    })

    app.get('/allToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addToyCollection.findOne(query);
      // console.log(result);
      res.send(result);
    })

    app.put('/allToys/:id', async (req, res) => {
      const id = req.params.id;
      const updateToy = req.body;
      console.log(updateToy);

      const query = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedToyCar = {
        $set: {
          name,
          category,
          price,
          quantity
        }
      }
      const result = await addToyCollection.updateOne(query, updatedToyCar, options);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.listen(port, () => {
  console.log(`Toy Car Store Server is running on port: ${port}`);
})