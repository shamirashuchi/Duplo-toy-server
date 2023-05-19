const express =require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 2000;

const Toys = require('./data/toys.json');


app.use(cors());
app.use(express.json())

app.get('/',(req,res) =>{
    res.send('Toy server side is running');
})

app.get('/toys',(req,res) =>{
    res.send(Toys);
})

app.listen(port, () =>{
    console.log(`Toy server side is running on port, ${port}`);
})