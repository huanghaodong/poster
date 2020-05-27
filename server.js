const express = require('express')
const path = require('path')
const app = express()

app.use(express.static(path.resolve(__dirname, '.')))

app.listen(8089, () => {
  console.log(`App listening at port 8088`)
})
