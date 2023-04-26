const express = require('express')
const UserRouter = require('./routers/user')
const TaskRouter = require('./routers/task')

require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

// Without middleware: new request -> run route handler
//
// With middleware : new request -> do something -> run route handler

// middlewares
// app.use((req, res, next) => {
//     console.log("Running Express Middleware::\t", req.method + "\t" + req.path)
//     if(req.method === "GET"){
//         res.send('GET requests are disabled.')
//     }else{
//         next()
//     }
// })

// Maintenance Middleware
// app.use((req, res, next) => {
//     res.status(503).send("Site is in maintenance, Please come back later.")
// })

// tools
app.use(express.json())


// routes
app.get('/', (req, res) => {
    res.send("Welcome to ExpressJS")
})
// User Routes
app.use(UserRouter)
// Task Routes
app.use(TaskRouter)

// Other routes to 404
app.get('/*', (req, res) => {
    res.send("404 not found")
})
app.post('/*', (req, res) => {
    res.send("404 not found")
})
app.listen( port, () => {
    console.log("Server is up on port " + port)
    // connect().catch(error => console.error(error))

})

