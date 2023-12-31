const express = require('express');
const cors = require('cors');

require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 2000;

const Toys = require('./data/toys.json');


app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g2hlfdf.mongodb.net/?retryWrites=true&w=majority`;

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
     client.connect();

const toyCollection = client.db('toyDB').collection('toy');

app.get('/toy', async(req,res) =>{
    const cursor = toyCollection.find();
    const result = await cursor.toArray();
    res.send(result);
})

app.get('/toyByEmail', async (req, res) => {
  // console.log(req.query.email);
  let query = {};
  if (req.query?.email) {
    query = { email: req.query.email };
  }

  const sort = req.query?.sort === 'asc' ? 1 : -1; // Determine the sort order based on the 'sort' query parameter

  const result = await toyCollection
    .find(query)
    .sort({ price: sort }) // Sort based on the 'price' field (modify the field as per your requirement)
    .toArray();

  res.send(result);
});


app.get('/toy/:id', async(req,res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await toyCollection.findOne(query);
  res.send(result);
})

app.post('/toy', async(req,res) => {
    const newtoy = req.body;
    console.log(newtoy);
    const result = await toyCollection.insertOne(newtoy);
    res.send(result);
})


app.put('/toy/:id', async(req,res)=>{
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const options = {upsert:true};
  const updatedToy = req.body; 
  const toy = {
    $set: {
      photo:updatedToy.photo,
      toyname:updatedToy.toyname,
      sellername:updatedToy.sellername,
      email:updatedToy.email,
      category:updatedToy.category,
      price:updatedToy.price,
      rating:updatedToy.rating,
      quantity:updatedToy.quantity,
      details:updatedToy.details
    }
  }
  const result = await toyCollection.updateOne(filter,toy,options);
  res.send(result);
})

app.delete('/toy/:id', async(req,res) =>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await toyCollection.deleteOne(query);
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



app.get('/',(req,res) =>{
    res.send('Toy server side is running');
})

app.get('/toys',(req,res) =>{
    res.send(Toys);
})

app.listen(port, () =>{
    console.log(`Toy server side is running on port, ${port}`);
})