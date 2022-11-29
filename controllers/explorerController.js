const moment = require('moment');
const Flash = require('../utils/Flash')
const Post = require('../models/Post')
const Profile = require('../models/Profile')

function genDate(days) {
    let date = moment().subtract(days, 'days')
    return date.toDate()
}

function genFilterObj(filter) {
    let filterObj = {}
    let order = 1

    switch(filter) {
        case 'week': {
            filterObj: {
                createdAt: {
                    $gt: genDate(7)
                }
            }
            order = -1
            break
        }
        case 'month': {
            filterObj: {
                createdAt: {
                    $gt: genDate(30)
                }
            }
            order = -1 
        }
        case 'all': {
            order = -1
        }
    }

    return {
        filterObj,
        order
    }
}

exports.explorerGetController = async (req, res, next) => {

    let filter = req.query.filter || 'latest'
    let currentPage = parseInt(req.query.page) || 1
    let postPerPage = 15
    let { order, filterObj } = genFilterObj(filter.toLowerCase())

    try {
        let posts = await Post.find(filterObj)
            .populate({
                path: 'author',
                populate: {
                    path: 'profile',
                    select: 'name'
                } 
            })
            .sort(order == 1 ? '-createdAt' : 'createdAt')
            .skip((postPerPage * currentPage) - postPerPage)
            .limit(postPerPage)

        let totalPost = await Post.countDocuments();
        let totalPage = totalPost / postPerPage

        let bookmarks = []
        if (req.user) {
            let profile = await Profile.findOne({user: req.user._id})
            if (profile) {
                bookmarks = profile.bookmarks
            }
        }

        res.render('pages/explorer/explorer', {
            title: 'Explorer Page',
            filter,
            flashMessage: Flash.getMessage(req),
            posts,
            postPerPage,
            currentPage,
            totalPage,
            bookmarks
        })
   } catch(e) {
        next(e)
   }
}

exports.singlePostGetController = async (req, res, next) => {
    let { postId } = req.params

    try {
        let post = await Post.findById(postId)
            .populate({
                path: 'author',
                populate: {
                    path: 'profile',
                    select: 'name'
                }
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username profilePic'
                }
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'replies',
                    populate: {
                        path: 'user',
                        select: 'username profilePic'
                    }
                }
            })


        if(!post) {
            let error = new Error('404 Page Not Found!')
            error.status = 404
            throw error
        }

        let bookmarks = []
        if(req.user) {
            let profile = await Profile.findOne({ user: req.user.id })
            if(profile) {
                bookmarks = profile.bookmarks
            }
        }

        res.render('pages/explorer/singlePageView.ejs', {
            title: post.title,
            flashMessage: Flash.getMessage(req),
            post,
            bookmarks
        })

    } catch(e) {
        next(e)
    }
}