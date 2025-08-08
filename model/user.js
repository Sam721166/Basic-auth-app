const mongoose = require("mongoose")
const dotenv = require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI)

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String
})

module.exports = mongoose.model("user", userSchema)