const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

// middlewire 
app.use(cors())
app.use(express.json())

// verify jwt token 
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorizaton
  if (!authHeader) {
    return res.status(401).send({ message: 'Unauthorized access in first' })
  }
  const token = authHeader.split(' ')[1]
  jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: 'Forbidden Access' })
    }
    req.decoded = decoded

  })
  next()
}


const uri = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.rat3bcl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    // services database 
    const database = client.db('kowshikPhotography').collection('services')
    // reviews database
    const serviceReview = client.db('kowshikPhotography').collection('review')
    app.get('/services', async (req, res) => {
      const query = {}
      const cursor = database.find(query)
      const services = await cursor.toArray()
      res.send(services)

    })

    app.get('/home/services', async (req, res) => {
      const query = {}
      const cursor = database.find(query)
      const services = await cursor.limit(3).toArray()
      res.send(services)

    })
    // add service 
    app.post('/services', async (req, res) => {
      const info = req.body
      const doc = {
        name: info.name,
        price: parseFloat(info.price),
        img: info.imgurl,
        description: info.description
      }
      const result = await database.insertOne(doc)
      res.send(result)
    })
    // my reviews 
    app.get('/myreviews/:id', verifyJWT, async (req, res) => {

      const decoded = req.decoded.email
      const email = req.params.id
      if (decoded !== email) {
        return res.status(403).send({ message: 'unauthorized access' })
      }

      const query = { email: { $eq: email } }
      const cursor = serviceReview.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

    // get all reviews
    app.get('/allreviews/:id', async (req, res) => {
      const id = req.params.id

      const query = { id: { $eq: id } }


      const cursor = serviceReview.find(query)
      const result = await cursor.toArray()
      res.send(result)

    })

    app.get('/service/:id', async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) }
      const result = await database.findOne(query)
      res.send(result)
    })


    app.post('/service/:id', async (req, res) => {
      const id = req.params.id
      const info = req.body


      const result = await serviceReview.insertOne(info)

      res.send(result)
    })

    // delete reviews
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }


      const result = await serviceReview.deleteOne(query)
      res.send(result)


    });

    // edit reviews 
    app.patch("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const newReview = req.body.review

      const filter = {_id : ObjectId(id)}
      const updatedDoc = {
        $set: {
          review : newReview
        }
      }
      const result = await serviceReview.updateOne(filter , updatedDoc)
      console.log(result)
      res.send({ message: 'fetched' })
    })

   


  }
  catch {
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