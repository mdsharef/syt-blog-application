const router = require('express').Router()
const { isAuthenticated } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')
const { 
    uploadProfilePicController, 
    removeProfilePicController,
    postImageUploadController 
} = require('../controllers/uploadController')

router.post('/profile-pic', isAuthenticated, upload.single('profilePic'), uploadProfilePicController)
router.delete('/profile-pic', isAuthenticated, removeProfilePicController)
router.post('/postimage', isAuthenticated, upload.single('post-image'), postImageUploadController)

module.exports = router