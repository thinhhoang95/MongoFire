const firemongo = require("./MongoFire")
firemongo().collection("paymemobile").doc("test2").set({test: "test3", sampleDate: new Date()}).then(() => {
    firemongo().collection("paymemobile").doc("test2").set({test: "test2", sampleDate: new Date()})
})

firemongo().collection("paymemobile").doc("test").get().then((snapshot) => {
    let data = snapshot.data();
    console.log(data.sampleDate.toDate())
})

firemongo().collection("paymemobile").get().then((snapshots) => {
    snapshots.forEach((snapshot) => {
        console.log(snapshot.data())
    })
})