const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }
})

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
        const types = /jpeg|jpg|png|gif|/
        const extName = types.test(path.extname(file.originalname).toLocaleLowerCase())
        const mimeType = types.test(file.mimetype)

        if (extName && mimeType) {
            cb(null, true)
        } else {
            cb(new Error('Only Image Format Is Supported'))
        }
    }
})

module.exports = upload

// exports.imageUpload = multer({
//     storage,
//     limits: {
//         fileSize: 1024 * 1024 * 5
//     },
//     fileFilter: (req, file, cb) => {
//         const types = /jpeg|jpg|png|gif|/
//         const extName = types.test(path.extname(file.originalname).toLocaleLowerCase())
//         const mimeType = types.test(file.mimetype)

//         if (extName && mimeType) {
//             cb(null, true)
//         } else {
//             cb(new Error('Only Image Format Is Supported'))
//         }
//     }
// })

// exports.videoUpload = multer({
//     storage,
//     limits: {
//         fileSize: 1024 * 1024 * 250,
//         files: 5
//     },
//     fileFilter: (req, file, cb) => {
//         const types = /mp4|mov|webm|wmv|ogg|/
//         const extName = types.test(path.extname(file.originalname).toLocaleLowerCase())
//         const mimeType = types.test(file.mimetype)

//         if (extName && mimeType) {
//             cb(null, true)
//         } else {
//             cb(new Error('Only video Format Is Supported'))
//         }
//     }
// })