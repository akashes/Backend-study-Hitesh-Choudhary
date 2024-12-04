 import express from 'express';
 import cors from 'cors'
 import cookieParser from 'cookie-parser';
 import userRouter from './routes/user.router.js';
import multer from 'multer';
import {ApiError} from './utils/apiError.js'
 const app = express()
 app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,

 }))
 app.use(express.json({limit:'16kb'}))
 app.use(cookieParser())
 app.use(express.urlencoded({extended:true,limit:'16kb'}))
 app.use(express.static('public'))



 //routes

 app.use('/api/v1/users',userRouter)


 //error handling middleware
 app.use((err, req, res, next) => {
   console.log('inside eror handing middlewarre')
   if (err instanceof ApiError) {
       return res.status(err.statusCode).json({ error: err.message });
   }
   res.status(500).json({ error: 'Internal Server Error' });
}); 
 export {app}