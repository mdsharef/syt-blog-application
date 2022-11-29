require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose')
const config = require('config')
const chalk = require('chalk')

// import middleware
const setMiddleware = require('./middleware/middleware')

//Import Routes
const setRoutes = require('./routes/routes')


const MONGODB_URI = `mongodb+srv://${config.get('db-admin')}:${config.get('db-password')}@blogapp.ool50gr.mongodb.net/?retryWrites=true&w=majority`

const app = express();

// Setup View Engine
app.set('view engine', 'ejs')
app.set('views', 'views')

// Using Middleware from Middleware Directory
setMiddleware(app)

// Using Routes from Route Directory
setRoutes(app)

//** // alternative way */
// app.get('/*', (req, res) => {
//     res.render('pages/error/404', {flashMessage: {}})          
// })

// ** middleware to handle 404 and 500. We can also use above function. But here I have used this method * //
app.use((req, res, next) => {
    let error = new Error('404 Page Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    if(error.status === 404) {
        return res.render('pages/error/404', {flashMessage: {}})
    }
    res.render('pages/error/500', {flashMessage: {}})
})
// *** //

const PORT = process.env.PORT || 8080;
mongoose.connect(MONGODB_URI, 
{useNewUrlParser: true})
.then(() => {
    console.log(chalk.green.bold('Database connected!'))
    app.listen(PORT, () => {
        console.log(chalk.green.italic(`App is running on PORT ${PORT}`));
    });
})
.catch(e => {
    return console.log(e)
})