const express = require('express')
const app = express()
const cors = require('cors');
const port =  process.env.PORT || 5000
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, UnorderedBulkOperation, ObjectId } = require('mongodb');
require('dotenv').config()

// middlewire 
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.rat3bcl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try{
    const database = client.db('kowshikPhotography').collection('services')
    const serviceReview = client.db('kowshikPhotography').collection('review')
    app.get('/services' , async(req , res) => {
    const query = {}
     const cursor = database.find(query)
     const services = await cursor.toArray()
      res.send(services)
   
  })

  app.get('/home/services' , async(req , res) => {
    const query = {}
     const cursor = database.find(query)
     const services = await cursor.limit(3).toArray()
      res.send(services) 

  }) 
  // get reviews
  app.get('/allreviews/:id' , async (req,res) => {
    const id = req.params.id
 
    const query = {id : {$eq : id}}
    
    
    const cursor = serviceReview.find(query)
    const result = await cursor.toArray()
    res.send(result)
    
  })
 
  app.get('/service/:id' , async(req , res ) => {
    const id = req.params.id;
   
   const query = {_id : ObjectId(id)}
    const result = await database.findOne(query)
    res.send(result)
  })


  app.post('/service/:id' , async(req , res) => {
    const id = req.params.id
    const info = req.body
    console.log(info)
   
    const result = await serviceReview.insertOne(info)
    
    res.send(result)
  })

  app.post('/jwt', (req,res) => {
    const user = req.body;
 
    var token = jwt.sign(user , process.env.SECRET_KEY)
    res.send({token})
    console.log({token})
})
}
  catch{
    console.error(err)
  }
}
run().catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Kowsik Photograper\'s backend server Backend')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})