import express from 'express'
import {connect} from 'mongoose'
import {config} from 'dotenv'
import cookieParser from 'cookie-parser'
import {userRoute} from './APIs/UserAPI.js'
import {adminRoute} from './APIs/AdminAPI.js'
import {authorRoute} from './APIs/AuthorAPI.js'
import { commonRouter } from './APIs/CommonAPI.js'
const app = express();

config() // process.env

// connect to db
const connectDB = async ()=>{
    try{
        await connect(process.env.MONGO_URL)
        console.log("DB connection success")
        app.listen(process.env.PORT,()=>{
            console.log("server Started Successfully")
        })
    }
    catch(err){
        console.log(err.message)
    }
}
// adding the body parser
app.use(express.json())
// adding the cookie parser middleware
app.use(cookieParser());
app.use('/user-api',userRoute);
app.use('/admin-api',adminRoute);
app.use('/author-api',authorRoute);
app.use('/common-api',commonRouter)

connectDB()

// dealing with invalid path
app.use((req,res,next)=>{
    console.log(req.url)
    res.status(404).json({message: `${req.url} is Invalid Path`});
})


// default error handler

app.use((err,req,res,next)=>{
    console.log("error",err.message);
    res.status(500).json({message:"Error",error: err.message});
})