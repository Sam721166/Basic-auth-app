const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
app.use(cookieParser())
const userModel = require("./model/user")
const path = require("path")
const { emit } = require("process")


app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "public")))



app.get("/", (req, res) => {
    res.render("index")
})

app.get("/read", async (req, res) => {
    let allUser = await userModel.find()
    res.render("read", {user: allUser})
})

app.post("/create", (req, res) => {
    let {username, email, password} = req.body

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let newUser = await userModel.create({
                username,
                email,
                password: hash
 
            })
            const token = jwt.sign({email}, "sam123")
            res.cookie("token", token)

            res.send(newUser)
        })
        
    })
})


app.get("/logout", (req, res) => {
    res.cookie("token", "")
    res.send("log out done")

    
})
app.get("/login", async (req, res) => {
    res.render("login")
})


app.post("/login", async (req, res) => {
    let user = await userModel.findOne({email: req.body.email})
    if(!user) return res.render("something")
    bcrypt.compare(req.body.password, user.password, (err, result) => {
        if(result){
            const token = jwt.sign({email: user.email}, "sam123")
            res.cookie("token", token)
            res.render("successfull");
        } 
        else res.render("nosuccess")
    })

})



app.listen(3000, () => {
    console.log("it's runing...");
    
})