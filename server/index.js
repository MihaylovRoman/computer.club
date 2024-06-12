const express = require('express');
const cors = require('cors');
const router = require('./routes');
const path = require('path')
require('dotenv').config();

const PORT = 3000
const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api', router)

const server = app.listen(PORT, () => {
    console.log("SERVER OK")
})






