const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const router = require('./router')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use('/img', express.static(__dirname + '/img'))

app.use(router)

const port = 7337
app.listen(port)
console.log(`Server listening on port ${port}`);
