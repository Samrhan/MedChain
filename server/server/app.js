const express = require('express')
const session = require('express-session')
const logger = require('morgan')
const dotenv = require('dotenv')
const cors = require('cors')
const helmet = require('helmet')
const mysql = require('mysql2/promise');

dotenv.config()

const apiRouter = require('./routes/api.js')

const app = express()

const corsOptions = {
    origin: process.env.CORS_URL,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true,
};

app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']); // Trust Nginx proxy

app.use(helmet());
app.use(cors(corsOptions))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: process.env.SECRET,
    name: 'sessionId',
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true,
        maxAge: 30*24*60*60*1000, // Un mois
    },
}))



// Configuration des routes
app.use('/pictures', express.static(__dirname.slice(0,-7) + '/uploads')); // Chemin absolu vers ce fichier, moins le /server, plus le /uploads
app.use('/api/', apiRouter)

module.exports = app
