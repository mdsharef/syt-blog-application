const router = require('express').Router()
const { check, validationResult } = require('express-validator') 
const Flash = require('../utils/Flash')

const upload = require('../middleware/uploadMiddleware')

router.get('/play', (req, res, next) => {
    
    res.render('playground/play', {
        title: 'Upload Your File', 
        submitValue: 'Submit',
        flashMessage: {}
    })
})

router.post('/play', upload.single('my-file'), (req, res, next) => {
    
    if (req.file) {
        console.log(req.file)
        console.log(req.file.mimeType)
    }

    res.redirect('/playground/play')
})

module.exports = router