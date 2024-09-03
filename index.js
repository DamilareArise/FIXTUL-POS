const express = require("express")
const session = require('express-session');
const app = express()
const port = 3000
const ejs = require("ejs")
const invoiceRouter = require('./routes/invoice.route')
const userRouter = require('./routes/user.route')
const mongoose = require("mongoose")
require('dotenv').config()


app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.set("view engine", "ejs")
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use('/inv', invoiceRouter)
app.use('/', userRouter)

let URI = process.env.MONGO_DB_URI
mongoose.connect(URI)
.then(()=>{
    console.log('mongoDB connected')
})
.catch(()=>{
    console.log('mongoDB connection failed')
})

app.listen(port, (err)=>{
    if(err) {
        console.log('Error: ',err)
    }else{
        console.log(`Server is running on port ${port}`)
    }    
})