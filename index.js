const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const { db } = require('./MongoConnex.js');

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({
        "name": "PayMeAPI",
        "version": "1.0.0",
        "description": "PayMeAPI is the FireMongo Server API for PayMe, PayMeMobile, PayMePOS and PayMeTerminals",
        "author": "Hoang Dinh Thinh"
    })
})

// ----------------- API 9 -----------------

app.post('/api9/setDoc', async (req, res) => {
    try {
        const body = req.body;
        let docRef = body.docRef;
        let data = body.data;
        const collection = db.collection(docRef.collectionName);
        let findResult = await collection.findOne({aid: docRef.docName});
        if (findResult == null){
            await collection.insertOne({...data, aid: docRef.docName});
        } else {
            await collection.updateOne({aid: docRef.docName}, {$set: data});
        }
        res.status(200).json({
            "status": "success"
        })
    } catch (error) {
        res.status(500).json({
            "status": "error",
            "message": error.message
        })
    }
})

app.post('/api9/getDoc', async (req, res) => {
    try {
        const body = req.body;
        let docRef = body;
        const collection = db.collection(docRef.collectionName);
        let findResult = await collection.findOne({aid: docRef.docName});
        if (findResult == null){
            res.status(404).json({
                "status": "error",
                "message": "Document not found"
            })
        } else {
            res.status(200).json(findResult);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            "status": "error",
            "message": error.message
        })
    }
})

app.post('/api9/getDocs', async (req, res) => {
    try {
        const body = req.body;
        let queryRef = body;
        const collection = db.collection(queryRef.collectionName);
        let findResult = await collection.find({}).toArray();
        if (findResult == null){
            res.status(404).json({
                "status": "error",
                "message": "Document not found"
            })
        }
        res.status(200).json(findResult);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            "status": "error",
            "message": error.message
        })
    }
})

// ----------------- API 8 -----------------



app.listen(port, () => console.log(`PayMeAPI listening on port ${port}!`));