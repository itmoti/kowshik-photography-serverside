const express = require('express')
const app = express()
const cors = require('cors');
const port =  process.env.PORT || 5000
const data = require('./data.json')
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
 
  app.get('/service/:id' , async(req , res ) => {
    const id = req.params.id;
    console.log(id)
   const query = {_id : ObjectId(id)}
    const result = await database.findOne(query)
    console.log(result)
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