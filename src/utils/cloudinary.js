import {v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

console.log(process.env.CLOUDINARY_API_KEY)
console.log(process.env.CLOUDINARY_API_SECRET)
console.log(process.env.CLOUDINARY_CLOUD_NAME)

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

 

const uploadOnCloudinary = async (localFilePath) => {

    try {
        if(!localFilePath) return null;
        //upload file to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto'
        })
        console.log('file uploaded successfully',response.url)
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath); //removes locally saved temporary file when upload fails
        return null;
    }
}

// Upload an image
const uploadResult = await cloudinary.uploader
.upload(
    'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
        public_id: 'shoes',
    }
)
.catch((error) => {
    console.log(error);
});

console.log(uploadResult);

export {uploadOnCloudinary}