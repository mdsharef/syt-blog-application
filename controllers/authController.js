const bcrypt = require('bcrypt');
const User = require('../models/User')
const { validationResult } = require('express-validator')
const errorFormatter = require('../utils/validationErrorFormatter')
const Flash = require('../utils/Flash')

exports.singupGetController = (req, res, next) => {
    res.render('pages/auth/signup', 
    {
        title: 'Create A New Account', 
        error: {},
        value: {},
        flashMessage: Flash.getMessage(req)
    })
}

exports.singupPostController = async (req, res, next) => {

    let { username, email, password } = req.body

    let errors = validationResult(req).formatWith(errorFormatter)

    if (!errors.isEmpty()) {
        req.flash('fail', 'Please Check Your Form')
        return res.render('pages/auth/signup', 
            {
                title: 'Create A New Account', 
                error: errors.mapped(),
                value: {
                    username, email, password
                },
                flashMessage: Flash.getMessage(req)

            })

    }

    try {
        let hashedpassword = await bcrypt.hash(password, 12)

        let user = new User({
            username,
            email,
            password: hashedpassword
        })

        await user.save()
        req.flash('success', 'User Created Successfully!')
        res.redirect('/auth/login')
    } catch (e) {
        next(e)
    }
}

exports.loginGetController = (req, res, next) => {
    res.render('pages/auth/login', 
    {
        title: 'Login To Your Account', 
        error: {},
        flashMessage: Flash.getMessage(req)
    })
}

exports.loginPostController = async (req, res, next) => {
    let { email, password } = req.body

    let errors = validationResult(req).formatWith(errorFormatter)

    if (!errors.isEmpty()) {
        req.flash('fail', 'Please Check Your Form')
        return res.render('pages/auth/login', 
        {
            title: 'Login To Your Account', 
            error: errors.mapped(),
            flashMessage: Flash.getMessage(req)
        })

    }

    try {
        let user = await User.findOne({email})

        if(!user) {
            req.flash('fail', 'Please Provide Valid Credentials')
            return res.render('pages/auth/login', 
                {
                    title: 'Login To Your Account', 
                    error: {},
                    flashMessage: Flash.getMessage(req)
                })
        }
        let match = await bcrypt.compare(password, user.password)
        if(!match) {
            req.flash('fail', 'Please Provide Valid Credentials')
            return res.render('pages/auth/login', 
                {
                    title: 'Login To Your Account', 
                    error: {},
                    flashMessage: Flash.getMessage(req)
                })
        }
        req.session.isLoggedIn = true
        req.session.user = user
        req.session.save(err => {
            if (err) {
                return next(err)
            }
            req.flash('success', 'Successfully Logged In')
            return res.redirect('/dashboard')
        })

    } catch (e) {
        next(e)
    }
}

exports.logoutController = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return next(err)
        }
        return res.redirect('/auth/login')
    })
}

exports.changePasswordGetController = (req, res, next) => {
    res.render('pages/auth/changePassword', 
    {
        title: 'Change Your Password', 
        error: {},
        flashMessage: Flash.getMessage(req)
    })
}

exports.changePasswordPostController = async (req, res, next) => {
    let { oldPassword, newPassword, confirmPassword } = req.body

    let errors = validationResult(req).formatWith(errorFormatter)

    if (!errors.isEmpty()) {
        req.flash('fail', 'Please Check Your Form')
        return res.render('pages/auth/changePassword', 
            {
                title: 'Change Your Password', 
                error: errors.mapped(),
                flashMessage: Flash.getMessage(req)
            })

    }

    try {

        let user = await User.findOne(req.user._id)

        if(!user) {
            req.flash('fail', 'Please Provide Valid Credentials')
            return res.render('pages/auth/changePassword', 
                {
                    title: 'Change Your Password', 
                    error: {},
                    flashMessage: Flash.getMessage(req)
                })
        }

        let match = await bcrypt.compare(oldPassword, user.password)
        if(!match) {
            req.flash('fail', 'Please Provide Valid Credentials')
            return res.render('pages/auth/changePassword', 
                {
                    title: 'Change Your Password', 
                    error: {},
                    flashMessage: Flash.getMessage(req)
                })
        }

        let samePassword = await bcrypt.compare(newPassword, user.password)
        if(samePassword) {
            req.flash('fail', 'Please Provide A Different Password. This Is Already In Used')
            return res.render('pages/auth/changePassword', 
                {
                    title: 'Change Your Password', 
                    error: {},
                    flashMessage: Flash.getMessage(req)
                })
        }

        let hashedpassword = await bcrypt.hash(newPassword, 12)

        await User.findOneAndUpdate(
            {_id: req.user._id},
            {$set: {'password': hashedpassword}},
            {new: true}
        )

        req.session.isLoggedIn = false
        req.session.save(err => {
            if (err) {
                return next(err)
            }
            req.flash('success', 'Password Changed Successfully!')
            res.redirect('/auth/login')
        })

        
    } catch (e) {
        next(e)
    }
}