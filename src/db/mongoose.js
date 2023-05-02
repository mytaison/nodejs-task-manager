const mongoose = require('mongoose')

const db_name = 'task-manager-api'
var db_url = ""
if( process.env.MONGODB_USER === "" || process.env.MONGODB_PASS === "" ){
  // const db_url = `${process.env.MONGODB_URL}${db_name}`
  db_url = `${process.env.MONGODB_URL_PRE}${process.env.MONGODB_URL_POST}`

}else{
  db_url = `${process.env.MONGODB_URL_PRE}${encodeURIComponent(process.env.MONGODB_USER)}:${encodeURIComponent(process.env.MONGODB_PASS)}${process.env.MONGODB_URL_POST}`
}
const options = {
    autoIndex: true, // build indexes (by default true)
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };
//Connecting with database
async function connect(){
    await mongoose.connect(db_url, options)
    // console.log(db_url)
    // console.log("Mongoose Connected.")
}

connect().catch(error => console.error(error))

// const User = mongoose.model( 'User', {
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         validate(value){
//             if(!validator.isEmail(value)){
//                 throw new Error("Email is not valid.")
//             }
//         }
//     },
//     password: {
//         type: String,
//         required: true,
//         trim: true,
//         validate(value){
//             if(value.length >= 8){
//                 if(!value.toLowerCase().includes('password')){
//                     // continue
//                 }else{
//                     throw new Error("Password cannot contains \"password\"")
//                 }
//             }else{
//                 throw new Error("Password should be at least 8 characters long.")
//             } 

//         }
//     },
//     age: {
//         type: Number,
//         default: 0,
//         validate(value) {
//             if(value < 0){
//                 throw new Error("Age must be a positive number")
//             }
//         }
//     }
// })

// const mehedi = new User( { 
//     name: "Mehedi Hasan ",
//     email: "MYTAISON@AOL.COM ",
//     password: "   Password wer     ",
//     age: 29
// } )
// mehedi.save().then(
//     console.log(mehedi)
// ).catch(error => console.error(error))

// const me = new User( { 
//     name: "Mehedi Hasan",
//     age: 29
// } )

// const me_faulty = new User( { 
//     name: "Mehedi Hasan",
//     age: 'TwentyNine'
// } )

// me.save().then( () => {
//     console.log(me)
//     // {
//     //     name: 'Mehedi Hasan',
//     //     age: 29,
//     //     _id: new ObjectId("642254c49500f792bff577ab"),
//     //     __v: 0
//     // }
// } ).catch( error => {
//     console.error(error)
// } )

// me_faulty.save().then( () => {
//     console.log(me_faulty)
//     // stringValue: '"TwentyNine"',
//     //   messageFormat: undefined,
//     //   kind: 'Number',
//     //   value: 'TwentyNine',
//     //   path: 'age',
//     //   reason: AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value
//     //     generatedMessage: true,
//     //     code: 'ERR_ASSERTION',
//     //     actual: false,
//     //     expected: true,
//     //     operator: '=='
//     //   },
//     //   valueType: 'string'
//     // }
//     // },
//     // _message: 'User validation failed'
// } ).catch( error => {
//     console.error(error)
// } )

// const Task = mongoose.model( 'Task', {
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         required: false,
//         default: false
//     }
// })

// const task1 = new Task( { 
//     description: "  Setup Node & NPM ",
//     // completed: "false"
// } )

// task1.save().then(
//     console.log(task1)
// ).catch(error => console.error(error))

module.exports = connect