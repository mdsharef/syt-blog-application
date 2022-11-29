const { body } = require('express-validator')
const validator = require('validator')

//** not working for some issue so has been used another function.. this has been kept for next analysis*/

// const linkValidator = value => {
//     if(value) {
//         if(!validator.isURL(value)) {
//             throw new Error('Please Provide a Valid URL')
//         }
//     }
//     return true
// }

module.exports = [
    body('name')
        .not().isEmpty().withMessage('Name Can Not Be Empty')
        .isLength({max: 50}).withMessage('Name Can Not Be More Than 50 Chars')
        .trim()
    ,
    body('title')
        .not().isEmpty().withMessage('Title Can Not Be Empty')
        .isLength({max: 100}).withMessage('Title Can Not Be More Than 100 Chars')
        .trim()
    ,
    body('bio')
        .not().isEmpty().withMessage('Bio Can Not Be Empty')
        .isLength({max: 500}).withMessage('Bio Can Not Be More Than 500 Chars')
        .trim()
    ,
    body('website')
        .custom(website => {
            if(website) {
                let r = new RegExp(/((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi
                )
                let result = r.test(website)
                if (!result) {
                    throw new Error('Please Provide A Valid Url!')
                } 
            }
            return true
        })
    ,
    body('facebook')
        .custom(facebook => {
            if(facebook) {
                let r = new RegExp(/((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi
                )
                let result = r.test(facebook)
                if (!result) {
                    throw new Error('Please Provide A Valid Url!')
                } 
            }
            return true
        })
    ,
    body('twitter')
        .custom(twitter => {
            if(twitter) {
                let r = new RegExp(/((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi
                )
                let result = r.test(twitter)
                if (!result) {
                    throw new Error('Please Provide A Valid Url!')
                } 
            }
            return true
        })
    ,
    body('github') 
        .custom(github => {
            if(github) {
                let r = new RegExp(/((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi
                )
                let result = r.test(github)
                if (!result) {
                    throw new Error('Please Provide A Valid Url!')
                } 
            }
            return true
    })
]