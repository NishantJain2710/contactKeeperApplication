import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import bcrypt from 'bcryptjs'
import pool from "../config/db.js"

const registerUser = asyncHandler(async(req,res)=>{
    const {name , username, email, phoneNumber, password, confirmPassword} = req.body
    const userExist = await pool.query("SELECT * FROM client WHERE username = $1",[username])
    if(userExist.rows[0]){
        res.status(400)
        throw new Error('user already exist')
    }else if(name===''){
        res.status(401)
        throw new Error('Name field is empty')
    }else if(email===''){
        res.status(401)
        throw new Error('Email field is empty')
    }else if(phoneNumber===''){
        res.status(401)
        throw new Error('Phone Number field is empty')
    }else if(password===''){
        res.status(401)
        throw new Error('Password field is empty')
    }else if(password!==confirmPassword){
        res.status(401)
        throw new Error('password do not match')
    }else{
        let imageUri
        if(!req.file){
            imageUri = 'uploads\default.jpg'
        }else{
            imageUri = req.file.path
        }        
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt)
        const user = await pool.query("INSERT INTO client(name, username, email, phone_no, password,profileimage) VALUES($1, $2 , $3 , $4 , $5 , $6) RETURNING *",
        [name, username,email,phoneNumber, hashPassword, imageUri]);
        if(user.rows[0]){
            res.status(201).json({
                id:user.rows[0].client_id,
                name: user.rows[0].name,
                username: user.rows[0].username,
                email: user.rows[0].email,
                phoneNumber: user.rows[0].phone_no,
                profileimage: user.rows[0].profileimage,
                token: generateToken(user.rows[0].client_id)
            })
        }else{
            res.status(400)
            throw new Error('Invalid user Data')
        }
    }
    
})


const login = asyncHandler(async(req,res)=>{
    const {username,password}= req.body
    const user = await pool.query("SELECT * FROM client WHERE username = $1",[username])

    const isPasswordMatch = await bcrypt.compare(password,user.rows[0].password)

    if(user.rows[0] && isPasswordMatch){
        res.json({
            id:user.rows[0].client_id,
            name: user.rows[0].name,
            username: user.rows[0].username,
            email: user.rows[0].email,
            phoneNumber: user.rows[0].phone_no,
            profileimage: user.rows[0].profileimage,
            token: generateToken(user.rows[0].client_id)
        })
    }else{
        res.status(401)
        throw new Error ('Incorrect username or Password')
    }

})

const getUserProfile = asyncHandler(async(req,res)=>{
    
    const user = await pool.query("SELECT client_id, name, username,email,phone_no, profileimage FROM client WHERE client_id = $1",
    [req.user.client_id])
    
    if(user.rows[0]){
        res.json({
            id:user.rows[0].client_id,
            name: user.rows[0].name,
            username: user.rows[0].username,
            email: user.rows[0].email,
            phoneNumber: user.rows[0].phone_no,
            profileimage: user.rows[0].profileimage
        })
    }else{
        res.status(404)
        throw new Error('User not found')
    }
})

//FOR UPDATE NAME
const updateClientName = asyncHandler(async(req,res)=>{
    const {name} = req.body
    const user = await pool.query("SELECT client_id, name, username, email, phone_no FROM client WHERE client_id = $1",
    [req.user.client_id])
    if(user.rows[0]){
        if(name){
            if((name === user.rows[0].name)){
                res.status(400)
                throw new Error(`you already have Name as \"${name}\"`)
            }else{
                const updateUser = await pool.query("UPDATE client SET name = $1 WHERE client_id = $2 RETURNING *",
                [name,user.rows[0].client_id ])
                res.status(200).json({
                    id:updateUser.rows[0].client_id,
                    name: updateUser.rows[0].name,
                    username: updateUser.rows[0].username,
                    email: updateUser.rows[0].email,
                    profileimage: updateUser.rows[0].profileimage,
                    phoneNumber: updateUser.rows[0].phone_no,
                    token: generateToken(updateUser.rows[0].client_id)
                })
            }
        }else{
            res.status(400)
            throw new Error(`Name filed can not be empty`)
        }
    }else{
        res.status(404)
        throw new Error('user not found..')
    }
})



//FOR UPDATE USERNAME
const updateClientUserName = asyncHandler(async(req,res)=>{
    const {username} = req.body
    const user = await pool.query("SELECT client_id, name, username, email, phone_no FROM client WHERE client_id = $1",
    [req.user.client_id])
    if(user.rows[0]){
        if(username){
            const userExist = await pool.query("SELECT * FROM client WHERE username = $1",[username])
            if(userExist.rows[0]){
                res.status(400)
                throw new Error('username already exist, try some thing new')
            }else{
                const updateUser = await pool.query("UPDATE client SET username = $1 WHERE client_id = $2 RETURNING *",
                [username,user.rows[0].client_id ])
                res.status(200).json({
                    id:updateUser.rows[0].client_id,
                    name: updateUser.rows[0].name,
                    username: updateUser.rows[0].username,
                    email: updateUser.rows[0].email,
                    phoneNumber: updateUser.rows[0].phone_no,
                    profileimage: updateUser.rows[0].profileimage,
                    token: generateToken(updateUser.rows[0].client_id)
                })
            }
        }else{
            res.status(400)
            throw new Error('Username field can not be empty')
        }
    }else{
        res.status(404)
        throw new Error('user not found..')
    }
})

//UPDATE EMAIL
const updateClientEmail = asyncHandler(async(req,res)=>{
    const {email} = req.body
    const user = await pool.query("SELECT client_id, name, username, email, phone_no FROM client WHERE client_id = $1",
    [req.user.client_id])
    if(user.rows[0]){
        if(email){
            if((email === user.rows[0].email)){
                res.status(400)
                throw new Error(`you already have Email as \"${email}\"`)
            }else{
                const updateUser = await pool.query("UPDATE client SET email = $1 WHERE client_id = $2 RETURNING *",
                [email,user.rows[0].client_id ])
                res.status(200).json({
                    id:updateUser.rows[0].client_id,
                    name: updateUser.rows[0].name,
                    username: updateUser.rows[0].username,
                    email: updateUser.rows[0].email,
                    phoneNumber: updateUser.rows[0].phone_no,
                    profileimage: updateUser.rows[0].profileimage,
                    token: generateToken(updateUser.rows[0].client_id)
                })
            }
        }else{
            res.status(400)
            throw new Error(`Email field can not be empty`)
        }
    }else{
        res.status(404)
        throw new Error('user not found..')
    }
})



//UPDATE PHONE NUMBER
const updateClientPhoneNumber = asyncHandler(async(req,res)=>{
    const {phoneNumber} = req.body
    const user = await pool.query("SELECT client_id, name, username, email, phone_no FROM client WHERE client_id = $1",
    [req.user.client_id])
    if(user.rows[0]){
        if(phoneNumber){
            if((phoneNumber === user.rows[0].phoneNumber)){
                res.status(400)
                throw new Error(`you already have Phone Number as \"${phoneNumber}\"`)
            }else{
                const updateUser = await pool.query("UPDATE client SET phone_no = $1 WHERE client_id = $2 RETURNING *",
                [phoneNumber,user.rows[0].client_id ])
                res.status(200).json({
                    id:updateUser.rows[0].client_id,
                    name: updateUser.rows[0].name,
                    username: updateUser.rows[0].username,
                    email: updateUser.rows[0].email,
                    phoneNumber: updateUser.rows[0].phone_no,
                    profileimage: updateUser.rows[0].profileimage,
                    token: generateToken(updateUser.rows[0].client_id)
                })
            }
        }else{
            res.status(400)
            throw new Error(`Phone Number field can not be empty`)
        }
    }else{
        res.status(404)
        throw new Error('user not found..')
    }
})


//UPDATE PROFILE IMAGE
const updateClientProfileImage = asyncHandler(async(req,res)=>{
    const user = await pool.query("SELECT client_id, name, username, email, phone_no FROM client WHERE client_id = $1",
    [req.user.client_id])
    if(user.rows[0]){
        let imageUri 
        if(!req.file){
            imageUri = 'uploads\\default.jpg'
        }else{
            imageUri = req.file.path
        }  
        const updateUser = await pool.query("UPDATE client SET profileimage = $1 WHERE client_id = $2 RETURNING *",
        [imageUri,user.rows[0].client_id ])
        res.status(200).json({
            id:updateUser.rows[0].client_id,
            name: updateUser.rows[0].name,
            username: updateUser.rows[0].username,
            email: updateUser.rows[0].email,
            phoneNumber: updateUser.rows[0].phone_no,
            profileimage: updateUser.rows[0].profileimage,
            token: generateToken(updateUser.rows[0].client_id)
        })
    }else{
        res.status(404)
        throw new Error('user not found..')
    }
})





const forgetPassword = asyncHandler(async(req,res)=>{
    const {username,phoneNumber,newPassword, confirmNewPassword} = req.body;
    const userExist = await pool.query("SELECT * FROM client WHERE username = $1 AND phone_no = $2",[username,phoneNumber])
    if(userExist.rows[0]){
        if(newPassword === confirmNewPassword){
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(newPassword,salt)
            const user = await pool.query("UPDATE client SET password = $1 WHERE client_id = $2 RETURNING *",
            [hashPassword,userExist.rows[0].client_id])
            if(user.rows[0]){
                res.status(201).json({
                    id:user.rows[0].client_id,
                    name: user.rows[0].name,
                    username: user.rows[0].username,
                    email: user.rows[0].email,
                    phoneNumber: user.rows[0].phone_no,
                    profileimage: user.rows[0].profileimage,
                    token: generateToken(user.rows[0].client_id)
                })
            }else{
                res.status(400)
                throw new Error('Invalid user Data')
            }
        }else{
            res.status(400)
            throw new Error('Password do not match.')
        }
    }else{
        res.status(404)
        throw new Error('User Not Found')
    }
})


export{
    registerUser,
    login,
    getUserProfile,
    forgetPassword,
    updateClientName,
    updateClientUserName,
    updateClientPhoneNumber,
    updateClientEmail,
    updateClientProfileImage
}