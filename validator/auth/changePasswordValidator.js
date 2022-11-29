const { body } = require('express-validator')
const User = require('../../models/User')

module.exports = [
    body('newPassword')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ,
    body('confirmPassword')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .custom((confirmPassword, {req}) => {
            if (confirmPassword !== req.body.newPassword) {
                throw new Error('Password Does Not Match');
            }
            return true
        })
]