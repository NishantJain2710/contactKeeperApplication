import jwt from 'jsonwebtoken'

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: 21600 //6 hours = 21600 sec
    })
}

export default generateToken