const express = require("express")
const invoiceModel = require('../models/invoice.model')


const fixInvoice = (req, res)=>{
    invoiceInfo = req.body;
    let form = new invoiceModel(invoiceInfo)
    form.save()
    .then(()=>{
        console.log('Invoice saved')
        res.redirect('fixhistory')
    })
    .catch((err)=>{
        console.log(err,'Invoice not saved')
        res.render('fixinvo', {saved: false})
    })
}

const fixHistory = (req, res)=>{
    invoiceModel.find()
    .then((invoices)=>{
        console.log(invoices);
        
        res.render('fixhistory',{invoices:invoices})
    })
}

const invoicePage = (req, res)=>{
    res.render('fixinvo',{saved:true})
}

const homePage = (req, res)=>{
    res.render('invoice')
}

module.exports = {fixInvoice, fixHistory, invoicePage, homePage}