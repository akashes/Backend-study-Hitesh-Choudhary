import express from 'express'
import { registerUser ,loginUser,logoutUser,refreshAccessToken} from '../controllers/user.controller.js'
const router = express.Router();
import {verifyJWT} from '../middlewares/auth.middleware.js'
import upload from '../middlewares/multer.middleware.js'

router.post('/register',
    upload.fields(
        [
            {name:"avatar",maxCount:1},
            {name:"coverImage",maxCount:1}
        ]
    )
    ,registerUser)


export default router 

router.post('/login',loginUser)

router.post('/logout',verifyJWT,logoutUser) 
router.post('/refresh-token',refreshAccessToken)