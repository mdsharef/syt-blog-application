// post, user, body, replies

const { Schema, model } = require('mongoose')

const commentSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    body: {
        type: String,
        trim: true,
        required: true
    },
    replies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Reply'
        }
    ]
}, { timestamps: true })

const Comment = model('Comment', commentSchema)
module.exports = Comment