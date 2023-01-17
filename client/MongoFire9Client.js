const reformatDoc = require('./ReformatDoc.js');
const fetch = require('node-fetch');

const apiHost = 'http://localhost:3000/api9/';

function collection(db, collectionName)
{
    // The first parameter actually does not matter, but we need to keep it for compatibility
    return {
        collectionName: collectionName
    }
}

function doc(collection, docName)
{
    collection.docName = docName;
    return collection;
}

function query(x, whereClause)
{
    if (whereClause == undefined){
        return x;
    } else {
        // throw new Error("Where clause is not supported yet");
        throw new Error("Where clause is not supported yet");
    }
}

async function setDoc(docRef, data)
{
    // Send a JSON object to the server
    let dataRef = {
        docRef: docRef,
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

async function getDoc(docRef)
{
    // Get JSON object from the server
    let response = await fetch(apiHost + 'getDoc', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(docRef)
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
    }
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

async function getDocs(queryRef)
{
    // Get JSON object from the server
    let response = await fetch(apiHost + 'getDocs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(queryRef)
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

module.exports = {
    collection,
    doc,
    query,
    setDoc,
    getDoc,
    getDocs
}