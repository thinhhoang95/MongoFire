// firestore().collection('users').doc('alovelace').set({})
// firestore().collection('users').doc('aturing').get().then((doc) => {
//   if (doc.exists) {
//     console.log('Document data:', doc.data());
//   } else {
//     // doc.data() will be undefined in this case
//     console.log('No such document!');
//   }
// firestore().collection('users').get().then((snapshot) => {
    // if (snapshot.exists) {
    //     console.log('Document data:', snapshot.data());
    // if (snapshot.size > 0) {
    //     console.log('Document data:', snapshot.data());
    // if (snapshot.empty) {
    //     console.log('Document data:', snapshot.data());
//  
//   snapshot.forEach((doc) => {
//     console.log(doc.id, '=>', doc.data());
//   });
// });

const {MongoClient} = require('mongodb');
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

class FireMongo{
    constructor(){
        // Do nothing
    }

    collection(collectionName){
        this.collectionName = collectionName;
        return this;
    }

    doc(docName){
        this.docName = docName;
        return this;
    }

    async set(data){
        await client.connect();
        const db = client.db("firemongo");
        if (this.collectionName == undefined){
            throw new Error("Collection name is not defined");
        }
        if (this.docName == undefined){
            throw new Error("Document name is not defined");
        }
        // Find out if this docName exists
        const collection = db.collection(this.collectionName);
        let findResult = await collection.findOne({aid: this.docName});
        if (findResult == null){
            await collection.insertOne({...data, aid: this.docName});
        } else {
            await collection.updateOne({aid: this.docName}, {$set: data});
        }
        return new Promise((resolve, reject) => {
            resolve();
        })
    }

    reformatDoc(doc){
        let newDoc = {}
        // Date conversion
        for (const [key, value] of Object.entries(doc)) {
            if (Object.prototype.toString.call(value) === '[object Date]')
            {
                // This is a date field, we replace it with a fake timestamp
                newDoc[key] = {
                    toDate: function(){
                        return value;
                    }
                }
            } else {
                newDoc[key] = value;
            }
            // Rename field name aid to id
            if (key == "aid")
            {
                newDoc["id"] = value;
                delete newDoc["aid"];
            }
        }
        return newDoc;
    }

    async get(){
        if (this.collectionName == undefined){
            throw new Error("Collection name is not defined");
        }
        // TODO: If docName is not defined, we should return a snapshot of all documents
        if (this.docName == undefined){
            // The user wants to get all documents, and getMany will handle that for us!
            return this.getMany();
        }
        await client.connect();
        const db = client.db("firemongo");
        // But if it is set, then we should only return one document
        const collection = db.collection(this.collectionName);
        const result = await collection.findOne({aid: this.docName});

        // Return a fake snapshot object
        return new Promise((resolve, reject) => {
            resolve({
                exists: result != null,
                empty: result == null,
                data: () => {return this.reformatDoc(result)},
            });
        });
    }

    async getMany(){
        await client.connect();
        const db = client.db("firemongo");
        if (this.collectionName == undefined){
            throw new Error("Collection name is not defined");
        }
        const collection = db.collection(this.collectionName);
        const result = await collection.find({}).toArray();
        // Return a fake querySnapshots object
        return new Promise((resolve, reject) => {
            resolve({
                empty: result.length == 0,
                size: result.length,
                forEach: (callback) => {
                    result.forEach((doc) => {
                        callback({
                            id: doc.aid,
                            data: () => {return this.reformatDoc(doc)},
                        })
                    })
                }
            });
        })
    }
}

function firemongo(){
    return new FireMongo();
}

module.exports = firemongo;