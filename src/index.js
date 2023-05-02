const app = require("./app")
const port = process.env.PORT

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

app.listen( port, () => {
    console.log("Server is up on port " + port)
})

