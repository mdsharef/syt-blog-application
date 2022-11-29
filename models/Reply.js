const { Schema, model } = require('mongoose')

const replySchema = new Schema({
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    body: {
        type: String,
        required: true
    }

}, { timestamps: true })

const Reply = model('Reply', replySchema)
module.exports = Reply