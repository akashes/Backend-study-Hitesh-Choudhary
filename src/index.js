import dotenv from 'dotenv'
dotenv.config() 
import express from 'express'
import cors from 'cors'
import { connectDB } from './db/db.js'
connectDB()


const app = express()
app.use(cors())
const PORT = process.env.PORT || 8080

app.get('/',(req,res)=>{
    res.send('backend is working fine!!')
})

 
app.listen(PORT, () => {
    console.log('-----------------------------');
    console.log('-----------------------------');
    console.log(`server running on port `+PORT);
});

 