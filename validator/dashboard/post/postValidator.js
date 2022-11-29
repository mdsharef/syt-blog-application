const { body } = require('express-validator')
const cheerio = require('cheerio')

module.exports = [
    body('title')
        .not().isEmpty().withMessage('Title Must Be Provided!')
        .isLength({max: 100}).withMessage('Title Can Not Be More Than 100 Chars!')
        .trim()
    ,
    body('body')
        .not().isEmpty().withMessage('Body Must Be Provided!')
        .custom(value => {
            let node = cheerio.load(value);
            let text = node.text();

            if (text.length > 8000) {
                throw new Error('Body Can Not Be More Than 8000 characters!')
            }
            return true
        })
    ,
    body('tags')
        .not().isEmpty().withMessage('Tag Must Be Provided!')
]