const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const respond = require('../helpers/responseHelper')
const authMiddleware = require('../middlewares/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendGoodbyeEmail } = require("../emails/account")

// User Create (implementing async / await)
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    console.log(req.body)
    // user.save()
    //     .then( () => respond.Created(res, user))
    //     .catch(err => respond.BadRequest(res, err))
    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        respond.Created(res, {user, token})
    }catch(err){
        respond.BadRequest(res, err)
    }

})
// User Read
router.get('/users', authMiddleware, (req, res) => {
    User.find({}) // fetching all documents
        .then((users) => respond.Success(res, users)) 
        .catch(err => respond.Error(res, err)) 
})

// User Read (Self)
router.get('/users/me', authMiddleware, (req, res) => {
    respond.Success(res, req.user) 
})

// User Read Avatar
router.get('/users/:id/avatar', async(req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error("Image not available.")
        }
        res.set('Content-Type', 'image/jpg')
        respond.Success(res, user.avatar)
    }catch(err){
        respond.NotFound(res, err)
    }
})

// User Read Avatar (Self)
router.get('/users/me/avatar', authMiddleware, async(req, res) => {
    try{
        if(!req.user.avatar){
            throw new Error("Image not available.")
        }
        res.set('Content-Type', 'image/jpg')
        respond.Success(res, req.user.avatar)
    }catch(err){
        respond.NotFound(res, err)
    }
})

// User Read (Specific)
// router.get('/users/:id', (req, res) => {
//     const _id = req.params.id
//     User.findById(_id) // fetching specific document
//         .then((user) => {
//             if(!user) respond.NotFound(res, "Resource Not Found")
//             else respond.Success(res, user) 
//         })
//         .catch(err => respond.Error(res, err)) 
// })

// User Update
// router.patch('/users/:id', async(req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//     try{
//         const user = await User.findById(req.params.id)
//         updates.forEach(update => user[update] = req.body[update])
//         await user.save()
//         if(!isValidOperation){
//             return respond.BadRequest(res, {error: "Invalid Updates"})
//         }
//         // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
//         if(!user){
//             return respond.NotFound(res, "")
//         }
//         respond.Success(res, user)
//     }catch(err){
//         respond.Error(res, err)
//     }
// })

// User Update (Self)
router.patch('/users/me', authMiddleware, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    try{
        const user = req.user
        updates.forEach(update => user[update] = req.body[update])
        await user.save()
        if(!isValidOperation){
            return respond.BadRequest(res, {error: "Invalid Updates"})
        }
        respond.Success(res, user)
    }catch(err){
        respond.Error(res, err)
    }
})

// User Picture Update
// Multer Config for AvatarUpload
const upload = multer({
    // dest: 'images/avatars',
    limits: {
        fileSize: 1000000,//number in bytes
    },
    fileFilter(req, file, callback) {
        // callback(new Error('File must be JPG/jpeg'))
        // callback(undefined, false)
        // if(!file.originalname.endsWith('.jpeg')){
        if(!file.originalname.match(/\.(jpeg|jpg|png)$/)){
            console.log(file)
            return callback(new Error('File must be in JPG/jpeg/PNG format'))
        }
        callback(undefined, true)

    }
})
router.post('/users/me/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
    const bufferData = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    // req.user.avatar = req.file.buffer
    req.user.avatar = bufferData
    await req.user.save()
    respond.Success(res, 'Avatar uploaded.')
}, (error, req, res, next) => {
    respond.BadRequest(res, error)
})


// User Delete
// router.delete('/users/:id', async(req, res) => {
//     try{
//         const user = await User.findByIdAndDelete(req.params.id)
//         if(!user){
//             respond.NotFound(res, {error: "Invalid Id"})
//         }
//         respond.Success(res, user)
//     }catch(err){
//         respond.Error(res, err)
//     }
// })

// User Delete (Self)
router.delete('/users/me', authMiddleware, async(req, res) => {
    try{
        //await req.user.remove() // not available after mongoose 5.5
        await req.user.deleteOne()
        sendGoodbyeEmail(req.user.email, req.user.name)
        respond.Success(res, req.user)
    }catch(err){
        respond.Error(res, err)
    }
})

// User Avatar Delete
router.delete('/users/me/avatar', authMiddleware, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    respond.Success(res, 'Avatar removed.')
}, (error, req, res, next) => {
    respond.BadRequest(res, error)
})


router.post('/users/login', async(req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        respond.Success(res, {user: user.getPublicProfile(), token})
    }catch(err){
        console.log(err)
        respond.BadRequest(res, err)
    }
})
router.post('/users/logout', authMiddleware, async(req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save()
        respond.Success(res, {})
    }catch(err){
        respond.Error(res, err)
    }
})
router.post('/users/logoutall', authMiddleware, async(req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        respond.Success(res, {})
    }catch(err){
        respond.Error(res, err)
    }
})

module.exports = router