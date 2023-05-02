const User = require('../models/user')
const jwt = require('jsonwebtoken')
const respond = require('../helpers/responseHelper')

const auth = async(req, res, next) => {
    try{
        console.log("Headers", req.header('Authorization'))
        if(!req.header('Authorization')){
                throw new Error('Auth Error')
        }
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({
            _id: decoded._id, 
            'tokens.token': token
        })
        if(!user){
            throw new Error('Auth Error')
        }
        req.token = token
        req.user = user
        next()
    }catch(err){
        // console.log(err)
        if(err.message === 'Auth Error')
            respond.Unauthorized(res, err)
        else
            respond.Error(res, err)
    }
}

module.exports = auth