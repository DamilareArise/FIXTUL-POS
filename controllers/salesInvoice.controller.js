const express = require('express')
const salesInvoiceModel = require('../models/salesInvoice.model')


let allProduct = []

const salesin = (req, res) => {
    if (allProduct.length > 0) {
        res.render('salesin', { p_length: allProduct.length })
    }
    else {
        res.render('salesin', { p_length: 0 })
    }
}


const addProduct = (req, res) => {
    const product = req.body
    allProduct.push(product)
    res.redirect('salesin')
    console.log(allProduct);
}

const addSalesInvoice = (req, res) => {
    const invoice = req.body
    const newInvoice = new salesInvoiceModel({
        customer_name: invoice.customer_name,
        customer_number: invoice.customer_number,
        attendant_name: invoice.attendant_name,
        products: allProduct,
    })

    newInvoice.total_price = newInvoice.products.reduce((total, product) => {
        return total + (product.quantity * product.price);
    }, 0);
    newInvoice.save()
        .then(invoice => {
            console.log('Invoice saved:', invoice);
            allProduct = []
            res.redirect('saleshistory')

        })
        .catch(err => {
            console.error('Error saving invoice:', err);
            res.status(500).send('Error saving invoice');
        });
}

const salesHistory = (req, res)=>{
    salesInvoiceModel.find()
    .then((invoices)=>{
        console.log(invoices);
        res.render('saleshistory',{invoices:invoices})
    })
}

const invoiceDetails = (req, res) => {
    const invoiceId = req.params.invoiceId;
    salesInvoiceModel.findById(invoiceId)
        .then(invoice => {
            if (invoice) {
                console.log('Customer Name:', invoice.customer_name);
                res.render('invoicedetail', {invoice:invoice})
            } else {
                console.log('Invoice not found');
                res.status(404).send('Invoice not found');
            }
        })
        .catch(err => {
            console.error('Error retrieving invoice:', err);
            res.status(500).send('Error retrieving invoice');
        });
}


module.exports = { addProduct, addSalesInvoice, salesin, salesHistory, invoiceDetails}

