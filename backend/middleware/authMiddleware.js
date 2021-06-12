import jwt from 'jsonwebtoken'
import pool from '../config/db.js'
import asyncHandler from 'express-async-handler'

const protect = asyncHandler(async(req,res,next)=>{
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await pool.query("SELECT client_id, name, username,email,phone_no FROM client WHERE client_id = $1",
            [decoded.id]);
            if(user.rows[0]){
                req.user = user.rows[0];
                next()
            }else{
                res.status(401)
                throw new Error('Not authorized, token failed...')
            }
        }catch(err){
            res.status(401)
            throw new Error('Not authorized, token failed...')
        }
    }
    if(!token){
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

export{
    protect
}