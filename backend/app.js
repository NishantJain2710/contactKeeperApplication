import express from "express"
import cors from "cors"
import path from 'path'
import dotenv from 'dotenv'
import {notFound,errorHandler} from './middleware/errorMiddleware.js'
import userRoutes from './routes/userRoutes.js'
import contactRoutes from './routes/contactRoutes.js'



const app = express();
dotenv.config()

//middleware
app.use(cors());
app.use(express.json())

app.get('/',(req,res)=>{
    res.send(`APIs ARE RUNNING ON PORT ${process.env.PORT || 3000}`)
})

//ROUTES
app.use('/api/users',userRoutes)
app.use('/api/contacts',contactRoutes)

const __dirname = path.resolve()
app.use('/uploads',express.static(path.join(__dirname,'/uploads')))


app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})