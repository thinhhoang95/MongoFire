const reformatDoc = require('./ReformatDoc.js');
const fetch = require('node-fetch');

const apiHost = 'http://localhost:3000/api9/';

class FireMongo8
{
    constructor()
    {
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
        // Send a JSON object to the server
        let dataRef = {
            docRef: {
                collectionName: this.collectionName,
                docName: this.docName,
            },
            data: data
        }
        let response = await fetch(apiHost + 'setDoc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataRef)
        });
        let result = await response.json();
        return new Promise((resolve, reject) => {
            resolve(result);
        })
    }

    async get(){
        if (this.docName == undefined){
            return await this.getMany();
        } else {
            return await this.getOne();
        }
    }

    async getOne()
    {
        let response = await fetch(apiHost + 'getDoc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                collectionName: this.collectionName,
                docName: this.docName
            })
        });
        if (response.status == 404){
            // Document not found
            return new Promise((resolve, reject) => {
                resolve({
                    data: () => {
                        return null;
                    },
                    exists: false,
                    size: 0,
                    empty: true
                });
            })
        } else {
            let result = await response.json();
            return new Promise((resolve, reject) => {
                resolve({
                    data: () => {
                        return reformatDoc(result);
                    },
                    exists: true,
                    size: 1,
                    empty: false
                });
            })
        }
    }

    async getMany()
    {
        // Get JSON object from the server
        let response = await fetch(apiHost + 'getDocs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                collectionName: this.collectionName
            })
        });
        if (response.status == 404){
            // Document not found
            return new Promise((resolve, reject) => {
                resolve({
                    data: () => {
                        return null;
                    },
                    exists: false,
                    size: 0,
                    empty: true
                });
            })
        } else {
            let result = await response.json();
            let findResult = result;
            let querySnapshots = []
            findResult.map((fr) => {
                querySnapshots.push({
                    data: () => {
                        return reformatDoc(fr);
                    },
                    exists: true,
                    size: 1,
                    empty: false
                });
            })
            return new Promise((resolve, reject) => {
                resolve(
                    {
                        docs: querySnapshots,
                        size: querySnapshots.length,
                        empty: querySnapshots.length == 0,
                        forEach: (callback) => {
                            querySnapshots.forEach(callback);
                        },
                        map: (callback) => {
                            return querySnapshots.map(callback);
                        }
                    }
                );
            })
        }
    }
}

const firemongo = () => {
    return new FireMongo8();
}

module.exports = firemongo;