const cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_USER_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const cloudinaryUploadImg = async(fileToUpload)=>{
    return new Promise((resolve)=>{
        cloudinary.uploader.upload(fileToUpload, (result)=>{
            resolve(
                {
                    url : result.secure_url
                },
                {
                    resource_type : 'auto'
                }
            )
        })
    })
}

modules.exports = cloudinaryUploadImg