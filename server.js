// Import dependencies modules:
const express = require('express')
// const bodyParser = require('body-parser')


// Create an Express.js instance:
const app = express()

// config Express.js
app.use(express.json())
app.set('port', 3000)
app.use ((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})

// connect to MongoDB
const MongoClient = require('mongodb').MongoClient;
let db;
MongoClient.connect('mongodb+srv://pelumiola1:olaayanfe123@cluster0.j0gma.mongodb.net/?retryWrites=true&w=majority', (err, client) => {
    db = client.db('webstore')
})


// dispaly a message for root path to show that API is working
app.get('/', (req, res, next) => {
    res.send('Select a collection, e.g., /collection/messages')
})

// get the collection name
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    // console.log('collection name:', req.collection)
    return next()
})

// retrieve all the objects from an collection
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})

//adding post
app.post('/collection/:collectionName', (req, res, next) => {
req.collection.insertOne(req.body, (e, results) => {
if (e) return next(e)
res.send(results.ops)
})
})

// return with object id 

const ObjectId = require('mongodb').ObjectId;
app.get('/collection/:collectionName/:id'
, (req, res, next) => {
    
req.collection.findOne({ _id: new ObjectId(req.params.id) }, (e, result) => {
if (e) return next(e)
res.send(result)
})
})


//update an object 

app.put('/collection/:collectionName/:id', (req, res, next) => {
req.collection.updateOne(
{_id: new ObjectId(req.params.id)},
{$set: req.body},
{safe: true, multi: false},
(e, result) => {
if (e) return next(e)
res.send((result.result === 1) ? {msg: 'error'} : {msg: 'success'})
})
})





app.delete('/collection/:collectionName/:id', (req, res, next) => {
req.collection.deleteOne(
{ _id: ObjectId(req.params.id) },(e, result) => {
if (e) return next(e)
res.send((result.result === 1) ?
{msg: 'error'} : {msg: 'success'})
})
})


app.listen(3000, () => {
    console.log('Express.js server running at localhost:3000')
})
app.use(function (req, res) {
    // Sets the status code to 404
    res.status(404);
    // Sends the error "File not found!”
    res.send("File not found!");
});

const port = process.env.PORT || 3000
app.listen(port)