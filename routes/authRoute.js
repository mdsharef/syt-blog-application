const router = require('express').Router()
const signupValidator = require('../validator/auth/signupValidator')
const loginValidator = require('../validator/auth/loginValidator')
const changePasswordValidator = require('../validator/auth/changePasswordValidator')
const { isUnAuthenticated, isAuthenticated } = require('../middleware/authMiddleware')

const {
    singupGetController,
    singupPostController,
    loginGetController,
    loginPostController,
    logoutController,
    changePasswordGetController,
    changePasswordPostController
} = require('../controllers/authController')

router.get('/signup', isUnAuthenticated, singupGetController)
router.post('/signup', isUnAuthenticated, signupValidator, singupPostController)

router.get('/login', isUnAuthenticated, loginGetController)
router.post('/login', isUnAuthenticated, loginValidator, loginPostController)

router.get('/changepassword', isAuthenticated, changePasswordGetController)
router.post('/changepassword', isAuthenticated, changePasswordValidator, changePasswordPostController)

router.get('/logout', logoutController)

module.exports = router