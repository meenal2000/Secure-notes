// CRUD operations Create , Read , Update , Delete 
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';
const id = new ObjectID();
console.log(id)
console.log(id.getTimestamp())

MongoClient.connect(connectionURL , {useNewUrlParser: true } , ( error , client ) => {
    if(error)
        return console.log('Unable to connect to the database !')
    const db = client.db(databaseName);
})
