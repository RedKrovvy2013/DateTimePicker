const express = require('express')
const path = require('path')

var app = express()

app.use(express.static(path.join(__dirname, '../public')))

const server = app.listen(3000, function() {})
