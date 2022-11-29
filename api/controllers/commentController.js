const Post = require('../../models/Post')
const Comment = require('../../models/Comment')
const Reply = require('../../models/Reply')

exports.commentApiPostController = async (req, res, next) => {
    let { postId } = req.params
    let { body } = req.body

    if (!req.user) {
        return res.status(403).json({ 
            error: 'Your are not an authenticated user!'
        })
    }

    let comment = new Comment({
        post: postId,
        user: req.user._id,
        body,
        replies: []
    })
    
    try {
        let createdComment = await comment.save()
        await Post.findOneAndUpdate(
            { _id: postId },
            {$push: { 'comments': createdComment._id }}
        )

        let commentJSON = await Comment.findById(createdComment._id).populate({
            path: 'user',
            select: 'profilePic username'
        })

        return res.status(201).json(commentJSON)

    } catch(e) {
        return res.status(500).json({
            error: 'Server Error Occurred!'
        })
    }
}

exports.replyCommentApiPostController = async (req, res, next) => {
    let { commentId } = req.params
    let { body } = req.body

    if (!req.user) {
        return res.status(403).json({ 
            error: 'Your are not an authenticated user!'
        })
    }

    let reply = new Reply({
        comment: commentId,
        user: req.user._id,
        body
    })

    try {
        let createdReply = await reply.save()
        await Comment.findOneAndUpdate(
            { _id: commentId },
            {$push: { 'replies': createdReply._id }}
        )

        let replyJSON = await Reply.findById(createdReply._id).populate({
            path: 'user',
            select: 'profilePic username'
        })

        return res.status(201).json(replyJSON)

        // res.status(201).json({
        //     ...reply,
        //     profilePic: req.user.profilePic
        // })

    } catch(e) {
        return res.status(500).json({
            error: 'Server Error Occurred!'
        })
    }
}