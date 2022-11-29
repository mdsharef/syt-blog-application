const { body } = require('express-validator')
const User = require('../../models/User')

module.exports = [
    body('username')
        .isLength({min: 2, max: 15}).withMessage(`Username must be between 2 and 15 chars`)
        .custom(async username => {
            let user = await User.findOne({ username })
            if (user) {
                return Promise.reject('Username Already existed!')
            }
        })
        .trim()
    ,
    body('email')
        .isEmail().withMessage(`Please Provide A Valid Email Account`)
        .custom(async email => {
            let user = await User.findOne({ email })
            if (user) {
                return Promise.reject('This Email has already been Used!')
            }
        })
        .normalizeEmail()
    ,
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ,
    body('confirmPassword')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .custom((confirmPassword, {req}) => {
            if (confirmPassword !== req.body.password) {
                throw new Error('Password Does Not Match');
            }
            return true
        })
]