const express = require('express')
const process = require('process')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path');

require('dotenv').config()
require('./db')

const colors = require('colors')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: 'F1 News API is running!' })
})

const articlesRoutes = require('./routes/articlesRoutes')
const commentsRoutes = require('./routes/commentsRoutes')
const driversRoutes = require('./routes/driversRoutes')
const teamsRoutes = require('./routes/teamsRoutes')
const racesRoutes = require('./routes/racesRoutes')
const usersRoutes = require('./routes/usersRoutes')
const standingsRoutes = require('./routes/standingsRoutes')
const authRoutes = require('./routes/authRoutes')
const uploadRoutes = require('./routes/uploadRoutes');

app.use('/articles', articlesRoutes)
app.use('/comments', commentsRoutes)
app.use('/drivers', driversRoutes)
app.use('/teams', teamsRoutes)
app.use('/races', racesRoutes)
app.use('/users', usersRoutes)
app.use('/standings', standingsRoutes)
app.use('/auth', authRoutes)
app.use('/', uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5001
app.listen(PORT, () => console.log('Server is running on port: '.italic.brightMagenta + `${PORT}`.italic.yellow))
