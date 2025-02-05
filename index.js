// All Constants

const express = require('express');
const { resolve } = require('path');
const mongoose= require('mongoose');
require('dotenv').config();

const app = express();
const port = 3010;

app.use(express.json());
app.use(express.static('static'));
 
// Connecting to mongoose server
mongoose.connect(process.env.MONGO_URI).then(()=>console.log('Connected to database')).catch((err)=> console.log('Failed to connect: ', err));

// Setting up a schema 

const menuItem= new mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String},
  price: {type: Number, required: true}
})
const Menu= mongoose.model('Menu', menuItem);


// creating end-points

// GET
app.get('/menu', (req, res)=>{
  Menu.find()
  .then(menuItems=> res.status(200).json(menuItems))
  .catch(error=>res.status(500).json({message: "Failed to fetch items: ", error}))
})

//POST 

//validation of input 
app.post('/menu', (req, res)=>{
  const {name, description, price} = req.body;
  if (!name || price==null){
    return res.status(400).json({error: "Invalid Input"});
  }

  // new item creation

  const newMenuItem= new Menu({name, description, price});
  newMenuItem.save()
  .then(savedMenuItem=> res.status(201).json({message: "Item saved succesfully. Menu Item: ", savedMenuItem}))
  .catch((err)=>console.log({message: "Failed to save item: ", err}));
})


// pre-defined code
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
