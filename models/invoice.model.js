const mongoose = require('mongoose')

const invoiceSchema = mongoose.Schema({
    customer_name:{type: String, required: true},
    customer_number:{type: Number, required: true},
    attendant_name:{type: String, required: true},
    engineer_name:{type: String, required: false},
    device:{type: String, required: true},
    device_name:{type: String, required: true},
    amount_paid:{type:Number,  required: true},
    description:{type:String,  required: true},
    date: {type:Date, default:Date.now}

})


let invoiceModel = mongoose.model('Invoice_collection', invoiceSchema)
module.exports = invoiceModel