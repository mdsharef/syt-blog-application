const Post = require('../models/Post')
const Profile = require('../models/Profile')
const Flash = require('../utils/Flash')

exports.searchResultGetController = async (req, res, next) => {
    let term = req.query.term;
    let currentPage = parseInt(req.query.page) || 1;
    let postPerPage = 15

    try {
        let posts = await Post.find({ 
                $text: { 
                    $search: term 
                }
            })
            .populate({
                path: 'author',
                populate: {
                    path: 'profile',
                    select: 'name'
                } 
            })
            .skip((postPerPage * currentPage) - postPerPage)
            .limit(postPerPage)

        let totalPost = await Post.countDocuments({ 
            $text: { 
                $search: term 
            }
        })
        let totalPage = totalPost / postPerPage

        let bookmarks = []
        if (req.user) {
            let profile = await Profile.findOne({user: req.user._id})
            if (profile) {
                bookmarks = profile.bookmarks
            }
        }

        res.render('pages/explorer/search.ejs', {
            title: `Result for - ${term}`,
            term,
            flashMessage: Flash.getMessage(req),
            posts,
            postPerPage,
            currentPage,
            totalPage,
            bookmarks
        })

    } catch(e) {
        next(e);
    }
}