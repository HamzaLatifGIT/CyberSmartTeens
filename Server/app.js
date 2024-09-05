const express = require('express')
const cors = require('cors')
const path = require("path");
const app = express()
const PORT = process.env.PORT || 5000
const morgan = require("morgan");
const colors = require('colors')
const cron = require('node-cron')
require('dotenv').config()
const DB = require("./Utilities/dbConnect")

app.use(cors())
app.use(express.json())
app.use(morgan("dev"));

// DB()





// import routes
const usersRoute = require('./v1/Routes/users.route')

app.use("/static", express.static(path.join(__dirname, '/public')));



// declare routes
app.use('/api/v1/users', usersRoute)




app.all('*', (req, res) => {
  try {
    // res.send("No Routes Found");
    res.status(404).json({
      status: 'Failed',
      message: 'No Routes Found',
    })
  } catch (error) {
    console.log(error.message)
  }
})

app.listen(PORT, () => {
  try {
    console.log(`server is successfully running on port ${PORT}!`.red.bold)
  } catch (error) {
    console.log(error.message)
  }
})



exports = app
