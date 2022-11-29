const { validationResult } = require('express-validator')
const readingTime = require('reading-time')

const Flash = require('../utils/Flash')
const errorFormattor = require('../utils/validationErrorFormatter')

const Post = require('../models/Post')
const Profile = require('../models/Profile')


exports.createPostGetController = (req, res, next) => {
    res.render('pages/dashboard/post/createPost.ejs', {
        title: 'Create Post',
        error: {},
        flashMessage: Flash.getMessage(req),
        value: {}
    })
}

exports.createPostPostController = async (req, res, next) => {
    let { title, body, tags } = req.body
    let errors = validationResult(req).formatWith(errorFormattor)
    
    if (!errors.isEmpty()) {
        return res.render('pages/dashboard/post/createPost.ejs', {
            title: 'Create Post',
            error: errors.mapped(),
            flashMessage: Flash.getMessage(req),
            value: {
                title,
                body,
                tags
            }
        })
    } 

    if (tags) {
        tags = tags.replace(/\s+/g, '')
        tags = tags.split(',')
    }

    let readTime = readingTime(body).text

    let post = new Post({
        title,
        body,
        author: req.user._id,
        tags,
        thumbnail: '',
        readTime,
        likes: [],
        dislikes: [],
        comments: []
    })

    if (req.file) {
        post.thumbnail = `/uploads/${req.file.filename}`
    }
        
    try {
        let createdPost = await post.save()
        await Profile.findOneAndUpdate(
            { user: req.user._id},
            {$push: {'posts': createdPost._id}}
        )
        req.flash('success', 'Post Created Succcessfully!')
        return res.redirect('/posts')

    }catch (e) {
        next(e)
    }
}

exports.editPostGetController = async (req, res, next) => {
    let postId = req.params.postId
    
    try{
        let post = await Post.findOne({ author: req.user._id, _id: postId })

        if(!post) {
            let error = '404 Page Not Found'
            error.status = 404
            throw error
        }
        res.render('pages/dashboard/post/editPost.ejs', {
            title: 'Edit Your Post',
            error: {},
            flashMessage: Flash.getMessage(req),
            post
        })
    }catch(e) {
        next(e)
    }
}

exports.editPostPostController = async (req, res, next) => {
    let { title, body, tags } = req.body
    let postId = req.params.postId
    let errors = validationResult(req).formatWith(errorFormattor)

    try {
        let post = await Post.findOne({ author: req.user._id, _id: postId })

        if(!post) {
            let error = '404 Page Not Found'
            error.status = 404
            throw error
        }  

        if (!errors.isEmpty()) {
            return res.render('pages/dashboard/post/editPost.ejs', {
                title: 'Edit Your Post',
                error: errors.mapped(),
                flashMessage: Flash.getMessage(req),
                post
            })
        } 

        if (tags) {
            tags = tags.replace(/\s+/g, '')
            tags = tags.split(',')
        }

        let readTime = readingTime(body).text
        let thumbnail = post.thumbnail
        if(req.file) {
            thumbnail = req.file.filename
        }

        await Post.findOneAndUpdate(
            {_id: post._id},
            {$set: { title, body, tags, readTime, thumbnail }},
            {new: true}
        )
        req.flash('success', 'Post Updated Successfully!')
        res.redirect('/posts')
    }catch (e) {
        next(e)
    }  
}

exports.deletePostGetController = async (req, res, next) => {
    let { postId } = req.params
    
    try{
        let post = await Post.findOne({ author: req.user._id, _id: postId })

        if(!post) {
            let error = new Error('404 Page Not Found')
            error.status = 404
            throw error
        }

        await Post.findOneAndDelete({ _id: postId })
        await Profile.findOneAndUpdate(
            {user: req.user._id},
            {$pull: { 'posts': postId }},
            {new: true}
        )
        req.flash('success', 'Post Deleted Successfully!')
        res.redirect('/posts')
    } catch(e) {
        next(e)
    }
}

exports.allPostsGetController = async (req, res, next) => {
    try {
        let posts = await Post.find({ author: req.user._id})

        res.render('pages/dashboard/post/posts', {
            title: 'My Created Posts',
            flashMessage: Flash.getMessage(req),
            posts
        })
    }catch(e) {
        next(e)
    }
}