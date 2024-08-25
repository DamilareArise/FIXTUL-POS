const express = require("express")
const invoiceModel = require('../models/invoice.model')


const fixInvoice = (req, res) => {
    invoiceInfo = req.body;
    let form = new invoiceModel(invoiceInfo)
    form.save()
        .then(() => {
            console.log('Invoice saved')
            res.redirect('fixhistory')
        })
        .catch((err) => {
            console.log(err, 'Invoice not saved')
            res.render('fixinvo', { saved: false })
        })
}

const fixHistory = (req, res) => {
    invoiceModel.find().sort({ _id: -1 }) 
        .then((invoices) => {
            res.render('fixhistory', { invoices: invoices })
        })
}

const deleteFix = (req, res) => {
    let id = req.params.id;
    console.log(id);

    invoiceModel.deleteOne({ _id: id })
        .then((response) => {
            if (response.deletedCount === 0) {
                return res.status(404).json({ error: 'Invoice not found' });
            }
            res.status(200).json({ message: 'Invoice deleted successfully' });
        })
        .catch((err) => {
            console.error('Error deleting invoice:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
};

const invoicePage = (req, res) => {
    res.render('fixinvo', { saved: true })
}

const homePage = (req, res) => {
    res.render('invoice')
}

module.exports = { fixInvoice, fixHistory, invoicePage, homePage, deleteFix }