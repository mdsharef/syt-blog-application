// name, email, password, profile

const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        maxLength: 15
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },
    profilePic: {
        type: String,
        default: '/uploads/default.png'
    }
}, {
    timestamps: true
})

const User = model('User', userSchema)
module.exports = User