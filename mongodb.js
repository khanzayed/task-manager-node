// CRUD create read update delete

const {MongoClient, ObjectID} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// const id = new ObjectID()
// console.log(id.id)
// console.log(id.id.length)

// console.log(id.toHexString())
// console.log(id.toHexString().length)

// console.log(id.getTimestamp())


MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!')
    }

    const db = client.db(databaseName)

    db.collection('users').deleteOne({ _id: new ObjectID('5dabfaf01a8484336338db9f') }).then((result) => {
        console.log(result.deletedCount)
    }).catch((error) => {
        console.log(error)
    })

    // UPDATE

    // db.collection('users').updateOne({ 
    //     _id: new ObjectID('5dabfaf01a8484336338db9f') 
    // }, {
    //     $inc: {
    //         age: 1
    //     }
    // }).then((result) => {
    //     console.log(result.matchedCount)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('tasks').updateMany({ 
    //     isCompleted: false 
    // }, {
    //    $set: {
    //        isCompleted: true
    //    } 
    // }).then((result) => {
    //     console.log(result.matchedCount)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // READ

    // db.collection('users').findOne({ _id: new ObjectID('5dab378297f83930c1513e48') }, (error, result) => {
    //     if (error || !result) {
    //           return console.log('Unable to find document!')
    //     }

    //     console.log(result)
    // })

    // db.collection('users').findOne({ name: 'Jennifer' }, (error, result) => {
    //     if (error || !result) {
    //           return console.log('Unable to find document!')
    //     }

    //     console.log(result)
    // })

    // db.collection('tasks').find({ isCompleted: false }).toArray((error, result) => {
    //     if (error || !result) {
    //         return console.log('Unable to insert document!')
    //   }

    //   console.log(result)
    // })
    
    // INSERT

    // db.collection('users').insertOne({
    //     _id: new ObjectID(),
    //     name: 'Vikram',
    //     age: 28
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert document!')
    //     }

    //     console.log(result.ops)ß
    // })

    // db.collection('users').insertMany([
    //     {
    //         name: 'Jennifer',
    //         age: 28
    //     }, 
    //     {
    //         name: 'Gunter',
    //         age: 28
    //     }
    // ], (error, result) => {
        // if (error) {
        //     return console.log('Unable to insert documents!')
        // }

        // console.log(result.ops)
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Buy vegetables',
    //         isCompleted: true
    //     },
    //     {
    //         description: 'Study node',
    //         isCompleted: false
    //     }, 
    //     {
    //         description: 'Resolved bugs',
    //         isCompleted: true
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert tasks!')
    //     }

    //     console.log(result.ops)
    // })
})