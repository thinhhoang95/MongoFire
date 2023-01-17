const { setDoc, getDoc, getDocs, doc, collection } = require('./MongoFire9Client.js')

// ------------------------------
// API V9
// ------------------------------

subtasksRef = collection('firemongo', 'subtasks')

setDoc(doc(subtasksRef, 'subtask12'), {
    'name': 'subtask12',
    'datex': new Date()
}).then((result) => {
    console.log('Set subtask12 with APIv9')
    console.log(result)
})

// getDoc(doc(subtasksRef, 'subtask12')).then((doc) => {
//     console.log('Get subtask12 with APIv9')
//     console.log(doc.data())
// })

// getDocs(subtasksRef).then((docs) => {
//     docs.forEach((doc) => {
//         console.log('Get subtasks with APIv9')
//         console.log(doc.data())
//     })
// })

// ------------------------------
// API V8
// ------------------------------

// const firemongo = require('./MongoFire8Client.js')
// firemongo().collection('subtasks').doc('subtask12').get().then((doc) => {
//     console.log('---')
//     console.log('Get subtask12 with APIv8')
//     console.log(doc.data())
//     console.log('---')
// })
