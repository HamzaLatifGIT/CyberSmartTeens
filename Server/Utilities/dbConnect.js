const mongoose = require("mongoose");
require("dotenv").config();



let MONGO_URL = process.env.NODE_ENV == "development" ? process.env.MONGO_DEV_URL : process.env.MONGO_PROD_URL

mongoose
    .connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
      console.log(
        `Database Connected`.white.bgGreen.bold
      )
        // mongoose.set("debug", true)
    })
    .catch((err) =>  console.log(`Database Connection error`.white.bgGreen.bold , err));
