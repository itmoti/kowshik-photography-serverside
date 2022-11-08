const express = require('express')
const app = express()
const cors = require('cors');
const port =  process.env.PORT || 5000
const data = require('./data.json')
import { MongoClient } from "mongodb";
// middlewire 
app.use(cors())

const uri = 

app.get('/services' , (req , res) => {
    res.send(data)
})


app.get('/', (req, res) => {
  res.send('Kowsik Photograper\'s backend server Backend')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})