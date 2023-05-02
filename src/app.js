const express = require('express')
const UserRouter = require('./routers/user')
const TaskRouter = require('./routers/task')

require('./db/mongoose')

const app = express()

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

module.exports = app
