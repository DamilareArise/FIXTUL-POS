const express = require("express")
const app = express()
const port = 3000
const ejs = require("ejs")
const invoiceRouter = require('./routes/invoice.route')

app.set("view engine", "ejs")
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))

app.use('/', invoiceRouter)


app.listen(port, (err)=>{
    if(err) {
        console.log('Error: ',err)
    }else{
        console.log(`Server is running on port ${port}`)
    }    
})