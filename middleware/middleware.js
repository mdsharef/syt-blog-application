const express = require('express')
const morgan = require('morgan');
const session = require('express-session')
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);
const config = require('config')

const { bindUserWithRequest } = require('./authMiddleware')
const setLocals = require('./setLocals')

const MONGODB_URI = `mongodb+srv://${config.get('db-admin')}:${config.get('db-password')}@blogapp.ool50gr.mongodb.net/?retryWrites=true&w=majority`

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
    expires: 1000 * 3600 * 24 * 7
  });

const middleware = [
    morgan('dev'),
    express.static('public'),
    express.urlencoded({ extended: true }),
    express.json(),
    session({
        secret: config.get('secret-key'),
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 3600 * 24 * 7
        },
        store: store
    }),
    flash(),
    bindUserWithRequest(),
    setLocals(),
]

module.exports = app => {
    middleware.forEach(m => {
        app.use(m)
    })
}