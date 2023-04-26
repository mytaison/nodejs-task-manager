const User = require('../models/user')
const jwt = require('jsonwebtoken')
const respond = require('../helpers/responseHelper')

const auth = async(req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'HackmeSecret321')
        const user = await User.findOne({
            _id: decoded._id, 
            'tokens.token': token
        })
        if(!user){
            throw new Error('Auth Error')
        }
        // console.log("Token: ",token)
        req.token = token
        req.user = user
        next()
        
    }catch(err){
        if(err.message === 'Auth Error')
            respond.Unauthorized(res, err)
        else
            respond.Error(res, err)
    }
}

module.exports = auth