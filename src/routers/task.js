const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const respond = require('../helpers/responseHelper')
const authMiddleware = require('../middlewares/auth')

// Task Create
router.post('/tasks', authMiddleware, (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    
    //const task = new Task(req.body)
    console.log(req.body)
    task.save()
        .then( () => respond.Created(res, task))
        .catch(err => respond.BadRequest(res, err))
})
// Task Read
router.get('/tasks', authMiddleware, async (req, res) => {
    try{
        // way 1
        // const tasks = await Task.find({owner: req.user._id}) 
        // respond.Success(res, tasks)
        // way 2
        // await req.user.populate('tasks')
        const match = {}
        const sort = {}
        const completedFilter = req.query.completed
        if(completedFilter){
            match.completed = completedFilter === 'true'
        }
        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        await req.user.populate({
            path: 'tasks',
            match: match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: sort
            }
        })
        respond.Success(res, req.user.tasks)
    }catch(err){
        respond.Error(res, err)
    }
   
})
// Task Read (Specific)
router.get('/tasks/:id', authMiddleware, async (req, res) => {
    const _id = req.params.id
    // Task.findById(_id) // fetching specific document
    //     .then((user) => {
    //         if(!user) respond.NotFound(res, "Resource Not Found")
    //         else respond.Success(res, user) 
    //     })
    //     .catch(err => respond.Error(res, err)) 
    try{
        const task = await Task.findOne({ _id, owner: req.user._id})
        if(!task){
            respond.NotFound(res, new Error("resource not available"))
        }else 
            respond.Success(res, task)
    }catch(err){
        respond.Error(res, err)
    }
})
//Task Update
router.patch('/tasks/:id', authMiddleware, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["description", "completed"]
    const isValidOperation = updates.every(update => {
        return allowedUpdates.includes(update)
    })

    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if(!task){
            return respond.NotFound(res, "")
        }
        if(isValidOperation){
            updates.forEach(update => task[update] = req.body[update])
            await task.save()
            // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})    
            respond.Success(res, task) 
        }else{
            respond.BadRequest(res, {error: "Invalid Updates"})
        }
    }catch(err){
        console.log(err)
        respond.Error(res, err)
    }
})
// Task Delete
router.delete('/tasks/:id', async(req, res) => {
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            respond.NotFound(res, {error: "Invalid Id"})
        }
        respond.Success(res, task)
    }catch(err){
        respond.Error(res, err)
    }
})

module.exports = router