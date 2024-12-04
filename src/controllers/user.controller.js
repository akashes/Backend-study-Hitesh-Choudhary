import {asyncHandler} from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import {ApiError} from '../utils/apiError.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'
 import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

 const generateAccessAndRefreshToken=async(id)=>{
   try {
    console.log('inside generate function')
    console.log(id)

    const user = await User.findById(id); 
    console.log(user)
    const accessToken = await user.generateAccessToken()
    const refreshToken=await user.generateRefreshToken()
    console.log({accessToken,refreshToken})
    user.refreshToken=refreshToken
    await user.save({validateBeforeSave:false})
    return {accessToken,refreshToken}

   } catch (error) {
    console.log(error)
    throw new ApiError(500, "Something went wrong while generating refresh and access token")
    
   }
 } 

const registerUser=asyncHandler( async (req,res)=>{
    const{username,email,password,fullName}=req.body
    console.log(username,email,password,fullName)


   if(
    [username,fullName,email,password].some( (field) => field === null || field === undefined || field?.trim() === "")
   ){
    throw new ApiError(400,"All fields are required")
   }

    const existingUser = await User.findOne({
        $or: [{username}, {email}]
    })
    if(existingUser){
        throw new ApiError(409,"User with email or username already exists")
    }
    if(req.files && req.files.length>1){
        throw new ApiError('400','only one image is allowed')
    }
    console.log(req.files)

    const avatarLocalPath=req.files?.avatar[0]?.path
    const coverImage = req.files?.coverImage[0]?.path
    // console.log(avatarLocalPath)
    // console.log(coverImage)
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required")
    } 
   const avatar =await uploadOnCloudinary(avatarLocalPath)
   console.log(avatar)
   const coverImageUpload =await uploadOnCloudinary(coverImage)
   console.log(coverImageUpload)

   if(!avatar){
    throw new ApiError(400,"Avatar file is required")
   }

const user = await User.create({
    username,
    email,
    password,
    fullName,
    avatar:avatar.url,
    coverImage:coverImageUpload?.url || ""
})
const createdUser = await User.findById(user._id).select("-password -refreshToken")

   if(!createdUser){
    throw new ApiError(500,'Something went wrong while registering user')

   }

   return res.status(201).json(
    new ApiResponse(200,createdUser,'User Registered Successfully')
   )
  
  res.status(200).send('user created successfully')
})  

const loginUser = asyncHandler(async(req,res)=>{

    const {email,username,password}=req.body

    if(!email.trim() && !username.trim()){
        throw new ApiError(400,'Email and Username is required')
    }else{
    

    const existingUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(!existingUser) throw new ApiError(404,'User does not exist')

        
        const isMatch = await existingUser.isPasswordCorrect(password)
        console.log(isMatch)
    
        if(!isMatch) throw new ApiError(404,'incorrect password')

         const {accessToken,refreshToken}=await   generateAccessAndRefreshToken(existingUser._id)

         const loggedInUser = await User.findById(existingUser._id).select("-password -refreshToken")
         const options={
            httpOnly:true,
            secure:true,
            

         }
         res
         .status(200)
         .cookie("accessToken",accessToken,options)
         .cookie("refreshToken",refreshToken,options)
         .json(
            new ApiResponse(
                200,
                {
                    user:loggedInUser,accessToken,refreshToken
                },
                "User logged in successfully"
            )
         )
            
    }

  
    //send acess tokn back
}) 

const logoutUser =asyncHandler(async(req,res)=>{

   await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{refreshToken:undefined}
       },
       {
        new :true
       }
    )
    const options={
        httpOnly:true,
        secure:true,
        

     }

     res.status(200)
     .clearCookie("accessToken",options)
     .clearCookie("refreshToken",options)
     .json(new ApiResponse(200,{},"User logged out "))
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken) throw new ApiError(400,'unauthorized request')

        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)


     const user = await User.findById(decodedToken?._id)
     if(!user) throw new ApiError(401,'Invalid refresh token')

    if(incomingRefreshToken !== user?.refreshToken) throw new ApiError(401,"Refresh token is expired or used")



     const {accessToken,refreshToken}=await   generateAccessAndRefreshToken(user._id)



    const options = {
        httpOnly:true,
        secure:true
    }
    res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,
            {
                accessToken,refreshToken
            },
            "Access token refreshed"
        )
    )

        
})

export {registerUser,loginUser,logoutUser,refreshAccessToken}      