const express= require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const { request } = require('express');
const { ObjectID } = require('bson');
const port =process.env.PORT ||5000;
const ObjectId = require('mongodb').ObjectId
// user:dbuser1
// password:GSDQ27sgiU4PELAX



const uri = "mongodb+srv://dbuser1:GSDQ27sgiU4PELAX@cluster0.fxp4k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
  try{
    await client.connect()
    const userCollection = client.db("TheCollection").collection("user")
    // const user ={name:'mahi', email:'mahi@gmail.com'}
    // const result =await userCollection.insertOne(user)
    // console.log(`user insterted with id:${result.insertedId}`)
    app.get('/user', async(req,res)=>{
      const query ={}
      const cursor =userCollection.find(query);
      const users = await cursor.toArray()
      res.send(users)
    })
    
    app.get('/user/:id', async(req,res)=>{
      const id = req.params.id 
      const query = {_id: ObjectId(id)}
      const result = await userCollection.findOne(query);
      res.send(result)

    })
    app.put('/user/:id',async(req,res)=>{
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = {_id:ObjectID(id)}
      const Options = { upsert:true}
      const updatedDoc = {
        $set: {
            name: updatedUser.name,
            email: updatedUser.email
        }
    };
    const result = await userCollection.updateOne(filter, updatedDoc, Options);
    res.send(result);
    })


    app.post('/user', async(req,res)=>{
      const newUser= req.body;
      console.log("collecd te user", newUser)
      const result = await userCollection.insertOne(newUser)
      res.send(result)

      
    })
    app.delete('/user/:id', async(req,res)=>{
      const id = req.params.id
      console.log(id)
      const query = {_id: ObjectId(id)}
      const result = await userCollection.deleteOne(query);
      res.send(result)
    })
  }
  finally{
    // await client.close
  }
}


run().catch(console.dir)

app.use(cors())
app.use(express.json())
app.get('/', (req,res)=>{
    res.send('Running MY Node Crud server')
})
app.listen(port,()=>{
    console.log('CRUD server is running')
})