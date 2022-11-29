const Profile = require('../../models/Profile')

exports.bookmarksGetController = async (req, res, next) => {
    let { postId } = req.params

    if(!req.user) {
        return res.status(403).json({
            error: 'Your are not an authenticated user!'
        })
    }

    let userId = req.user._id
    let bookmarked = null

    try {
        let profile = await Profile.findOne({user: userId})

        if(profile.bookmarks.includes(postId)) {
            await Profile.findOneAndUpdate(
                { user: userId },
                {$pull: {'bookmarks': postId}}
            )
            bookmarked = false
        } else {
            await Profile.findOneAndUpdate(
                { user: userId },
                {$push: {'bookmarks': postId}}
            )
            bookmarked = true
        }

        res.status(200).json({
            bookmarked
        })

    } catch(e) {
        return res.status(500).json({
            error: 'Server Error Occurred!'
        })
    }
}