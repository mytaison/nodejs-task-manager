const mongodb = require('mongodb')

const connection_url = 'mongodb://127.0.0.1:27017'
const database_name = 'task-manager'
const mongodb_api_version = mongodb.ServerApiVersion.v1
const MongoClient = new mongodb.MongoClient(connection_url, {
    serverApi : {
        version : mongodb_api_version,
        strict : true,
        deprecationErrors : true 
    }
})

const MongoObjectId = mongodb.ObjectId

async function connect() {
    try{
        const connectionRes = await MongoClient.connect()
        console.log("Connection created Successfully")
        // console.log(connectionRes)
        // Send a ping to confirm a successful connection
        // await MongoClient.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const db = await MongoClient.db(database_name)
        // console.log("DB::",db)
        
        // Creating Collection / Table
        // await db.createCollection('users')
        
        // Inserting only one document / row
        // const result = await db.collection('users').insertOne(
        //     {
        //         name : "Rashjid Mazid",
        //         age : 22
        //     }
        // )
        // Results::  {
        //     acknowledged: true,
        //     insertedId: new ObjectId("641b8a682d541c44e204335b")
        // }

        // Inserting multiple documents
        // const result = await db.collection('users').insertMany(
        //     [
        //         {
        //             name : "Sabrina Hossain",
        //             age : 34
        //         },
        //         {
        //             name : "Lubna Hossain",
        //             age : 39
        //         }
        //     ]
        // )
        // Results::  
        // {
        //     acknowledged: true,
        //     insertedCount: 2,
        //     insertedIds: {
        //       '0': new ObjectId("641b8c16792e16ae65376ed6"),
        //       '1': new ObjectId("641b8c16792e16ae65376ed7")
        //     }
        // } 

        // Challenge
        // const result = await db.createCollection("task_collection")
        // const result2 = await db.collection("task_collection").insertMany(
        //     [
        //         {
        //             description : "Description A",
        //             completed : true
        //         },
        //         {
        //             description : "Description B",
        //             completed : false
        //         },
        //         {
        //             description : "Description C",
        //             completed : true
        //         },
        //     ]
        // )
        // console.log("Results:: ", result)
        // console.log("Results 2:: ", result2)
        // Results::  Collection {
        //     s: {
        //       db: Db { s: [Object] },
        //       options: {
        //         raw: false,
        //         useBigInt64: false,
        //         promoteLongs: true,
        //         promoteValues: true,
        //         promoteBuffers: false,
        //         ignoreUndefined: false,
        //         bsonRegExp: false,
        //         serializeFunctions: false,
        //         fieldsAsRaw: {},
        //         enableUtf8Validation: true,
        //         readPreference: [ReadPreference]
        //       },
        //       namespace: MongoDBNamespace {
        //         db: 'task-manager',
        //         collection: 'task_collection'
        //       },
        //       pkFactory: { createPk: [Function: createPk] },
        //       readPreference: ReadPreference {
        //         mode: 'primary',
        //         tags: undefined,
        //         hedge: undefined,
        //         maxStalenessSeconds: undefined,
        //         minWireVersion: undefined
        //       },
        //       bsonOptions: {
        //         raw: false,
        //         useBigInt64: false,
        //         promoteLongs: true,
        //         promoteValues: true,
        //         promoteBuffers: false,
        //         ignoreUndefined: false,
        //         bsonRegExp: false,
        //         serializeFunctions: false,
        //         fieldsAsRaw: {},
        //         enableUtf8Validation: true
        //       },
        //       readConcern: undefined,
        //       writeConcern: undefined
        //     }
        //   }
        //   Results 2::  {
        //     acknowledged: true,
        //     insertedCount: 3,
        //     insertedIds: {
        //       '0': new ObjectId("641b8dda390cb465ceb4955c"),
        //       '1': new ObjectId("641b8dda390cb465ceb4955d"),
        //       '2': new ObjectId("641b8dda390cb465ceb4955e")
        //     }
        //   }

        // Manually creating objectID
        // const id = new MongoObjectId()
        // console.log("id:: ", id.id)
        // console.log("id:: ", id.id.length)
        // console.log("id:: ", id.toString())
        // console.log("id:: ", id.valueOf())
        // console.log("id:: ", id.getTimestamp())
        // id::  <Buffer 64 1b 92 b4 cf b7 43 f0 9f 60 db fe>
        // id::  12
        // id::  641b90dae0a0636700fb04ba
        // id::  new ObjectId("641b90dae0a0636700fb04ba")
        // id::  2023-03-22T23:35:54.000Z

        // Reading Data
        // const result = await db.collection('task_collection').findOne({
        //     description : 'Description A',
        // })
        // Result:: 
        // {
        //     _id: new ObjectId("641b8dda390cb465ceb4955c"),
        //     description: 'Description A',
        //     completed: true
        // }
        // const result = await db.collection('task_collection').findOne({
        //     description : 'Description A',
        //     completed : false
        // })
        // Result:: null
        // const result = await db.collection('task_collection').findOne({
        //     _id : '641b8dda390cb465ceb4955c',
        // })
        // Result:: null
        // const result = await db.collection('task_collection').findOne({
        //     _id : new MongoObjectId('641b8dda390cb465ceb4955c'),
        // })
        // Result:: {
        //     _id: new ObjectId("641b8dda390cb465ceb4955c"),
        //     description: 'Description A',
        //     completed: true
        //   }

        // It returns a cursor
        // const result = await db.collection('task_collection').find({
        //     completed : true,
        // })
        // console.log("Result::", result)

        // We iterating the result using foreach
        // await result.forEach(element => {
        //     console.log(element)
        //     console.log(JSON.stringify(element))
        // });

        // Alternatively we can get all data in array
        // const returns = await result.toArray()
        // console.log(returns)
        // const returnsLength = await result.count()
        // console.log(returnsLength)

        // Updating 
        // result = await db.collection('users').updateOne(
        //     {
        //         _id: new MongoObjectId("641d870835fd695933f6b5d5")
        //     },
        //     {
        //         // $set: {
        //         //     name: "Adnan Kamal",
        //         //     age: 31
        //         // },
        //         // $inc: {
        //         //     age: 5
        //         // },
        //         $mul: {
        //             age: 5
        //         }
        //     }
        // )
        // console.log(result)
        // {
        // acknowledged: true,
        // modifiedCount: 1,
        // upsertedId: null,
        // upsertedCount: 0,
        // matchedCount: 1
        // }
        // result = await db.collection('task_collection').updateMany(
        //     {
        //         completed: true
        //     },
        //     {
        //         $set: {
        //             completed: false
        //         }
        //     }
        // )
        // console.log(result)
        // {
        //     acknowledged: true,
        //     modifiedCount: 3,
        //     upsertedId: null,
        //     upsertedCount: 0,
        //     matchedCount: 3
        // }
        // const result = await db.collection('users').deleteMany(
        //     {
        //         age: { $gt: 100}
        //     }
        // )
        // console.log(result)
        // { acknowledged: true, deletedCount: 1 }
        
    }catch(error){
        console.log("Errors:: ", error)
    }finally {
        // Ensures that the client will close when you finish/error
        console.log("Connection is closed.")
        await MongoClient.close();
    }
}

connect().catch(console.dir)