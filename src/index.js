import dotenv from 'dotenv'
dotenv.config(
{    path:'./.env'
}) 
import colors from 'colors'
import express from 'express'
import cors from 'cors'
import { connectDB } from './db/db.js'
import {app} from './app.js'
import multer from './middlewares/multer.middleware.js'

connectDB()
.then(()=>{
    app.listen(process.env.PORT, () => {
        console.log('-----------------------------');
        console.log('-----------------------------');
        console.log(`server running on port `.bgBrightBlue+process.env.PORT.bgBrightBlue );
    });
    
})
.catch((err)=>{
    console.log('mongodb connection failed !!',err )
})


 

  