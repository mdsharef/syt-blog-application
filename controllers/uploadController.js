const fs = require('fs')
const User = require('../models/User')
const Profile = require('../models/Profile')

exports.uploadProfilePicController = async (req, res, next) => {
    if (req.file) {
        try {
            let oldProfilePic = req.user.profilePic
            let profile = await Profile.findOne({ user: req.user._id })
            let profilePic = `/uploads/${req.file.filename}`

            if (profile) {
                await Profile.findOneAndUpdate(
                    {user: req.user._id},
                    {
                        $set: {
                            profilePic
                        }
                    }
                )
            }
            await User.findOneAndUpdate(
                {_id: req.user._id},
                {
                    $set: {
                        profilePic
                    }
                }
            )

            if(oldProfilePic !== '/uploads/default.png') {
                fs.unlink(`public${oldProfilePic}`, err => {
                    if (err) console.log(err)
                })
            }
            res.status(200).json({
                profilePic
            })
        } catch (e) {
            res.status(500).json({
                profilePic: req.user.profilePic
            })
        }
        
    } else {
        res.status(500).json({
            profilePic: req.user.profilePic
        })
    }
}

exports.removeProfilePicController = (req, res, next) => {
    try {
        let defaultProfile = '/uploads/default.png'
        let currentProfilePic = req.user.profilePic

        fs.unlink(`public${currentProfilePic}`, async (err) => {
            let profile = await Profile.findOne({user: req.user._id})
            if (profile) {
                await Profile.findOneAndUpdate(
                    {user: req.user._id},
                    {$set: {profilePic: defaultProfile}}
                )
            }
            await User.findOneAndUpdate(
                {_id: req.user._id},
                {$set: {profilePic: defaultProfile}}
            )

        })
        
        res.status(200).json({
            profilePic: defaultProfile
        })
    } catch(e) {
        res.status(500).json({
            message: 'Can not Remove Profile Pic'
        })
    }
}

exports.postImageUploadController = (req, res, next) => {
    if(req.file) {
        return res.status(200).json({
            imgUrl: `/uploads/${req.file.filename}`
        })
    }

    return res.status(500).json({
        message: 'Server Error!'
    })
}