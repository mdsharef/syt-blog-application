const router = require('express').Router()
const { isAuthenticated } = require('../../middleware/authMiddleware')

const {
    commentApiPostController,
    replyCommentApiPostController
} = require('../controllers/commentController')

const {
    likesGetController,
    dislikesGetController
} = require('../controllers/likeDislikeController')

const {
    bookmarksGetController,
} = require('../controllers/bookmarkController')

router.post('/comments/:postId', isAuthenticated, commentApiPostController)
router.post('/comments/replies/:commentId', isAuthenticated, replyCommentApiPostController)

router.get('/likes/:postId', isAuthenticated, likesGetController)
router.get('/dislikes/:postId', isAuthenticated, dislikesGetController)

router.get('/bookmarks/:postId', isAuthenticated, bookmarksGetController)

module.exports = router;