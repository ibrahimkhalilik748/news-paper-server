const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Hello World! 12345')
  })

  const uri = `mongodb+srv://newspaper123:newspaper321@cluster0.em86h.mongodb.net/newspaper?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

  
  const paperCollection = client.db("newspaper").collection("paper");
  app.post('/addPaper', (req, res) => {
    const newPaper = req.body;
    console.log('adding new Paper:', newPaper)
    paperCollection.insertOne(newPaper)
      .then(result => {
        console.log('Paper', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })
  app.get('/paper', (req, res) => {
    paperCollection.find({}).toArray((err, result) => {
      res.send(result)
    })
  })
  app.get('/paper/:_id',(req, res) => {
    const _id = req.params._id
    paperCollection.find({_id:ObjectId(_id)}).toArray((err, result) => {
      res.send(result)
      // console.log(result)
    })
  })
  
  const AdminCollection = client.db("newspaper").collection("admin");
  app.post('/addAdmin', (req, res) => {
    const newAdmin = req.body;
    console.log('adding new Amin:', newAdmin)
    AdminCollection.insertOne(newAdmin)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })
  app.get('/admin', (req, res) => {
    AdminCollection.find({}).toArray((err, result) => {
      res.send(result)
    })
  })

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    AdminCollection.find({ email: email })
      .toArray((err, admin) => {
        res.send(admin.length > 0);
      })
  })

//   client.close();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
