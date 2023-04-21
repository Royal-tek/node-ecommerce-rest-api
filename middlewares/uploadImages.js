const multer = require('multer')
const sharp = require('sharp')
const path = require('path')

const multerStorage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, path.join(__dirname, '../public/images'))
    },
    filename : (req, file, cb)=>{
        const uniqueSuffix = Date.now() + '-' + Math.random(Math.random() * 1e9)
        cb(null, file.fieldname + '-' + uniqueSuffix + ".jpeg")
    }
})

const multerFilter = (req, file, cb)=>{
    if(file.mimetype.startswith('image')){
        cb(null, true)
    }else{
        cb({
            message:"Unsupported file format"
        }, false)
    }
}




const uploadPhoto = multer({
    storage : multerStorage,
    fileFilter : multerFilter,
    limits : { fieldSize : 2000000}
})

const productImgResize = async(req, res, next)=>{
    if(!req.files) return next()
    await Promise.all(req.files.map(async (file)=>{
        await sharp(file.path).resize(300,300).toFormat('jpeg').jpeg({quality:90}).toFile(`public/images/products/${file.filename}`)
    }))
    next()
}


module.exports = {uploadPhoto, productImgResize }