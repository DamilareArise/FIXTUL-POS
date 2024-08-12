const mongoose = require('mongoose')


const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
})

const salesInvoiceSchema = mongoose.Schema({
    customer_name:{type: String, required: true},
    customer_number:{type: Number, required: true},
    attendant_name:{type: String, required: true},
    products:[productSchema],
    total_price:{type: Number, required: true},
    date: {type:Date, default:Date.now}
})

let salesInvoiceModel = mongoose.model('salesInvoice_collection', salesInvoiceSchema)
module.exports = salesInvoiceModel