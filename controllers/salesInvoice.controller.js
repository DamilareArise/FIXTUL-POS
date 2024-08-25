const express = require('express')
const salesInvoiceModel = require('../models/salesInvoice.model')



const salesin = (req, res) => {
    if (!req.session.products) {
        req.session.products = [];
    }

    const productCount = req.session.products.length;
    res.render('salesin', { p_length: productCount });
};


const addProduct = (req, res) => {
    const product = req.body
    if (!req.session.products) {
        req.session.products = [];
    }
    req.session.products.push(product);
    res.redirect('salesin')

}

const removeProduct = (req, res) => {
    let id = req.params.id
    if (req.session.products && id >= 0 && id < req.session.products.length) {
        req.session.products.splice(id, 1);
    }
    res.render('productHistory', { products: req.session.products })
}

const viewProducts = (req, res) => {
    res.render('productHistory', { products: req.session.products || [] })
}

const addSalesInvoice = (req, res) => {
    const invoice = req.body
    const products = req.session.products || []
    const newInvoice = new salesInvoiceModel({
        customer_name: invoice.customer_name,
        customer_number: invoice.customer_number,
        attendant_name: invoice.attendant_name,
        products,
    })

    newInvoice.total_price = newInvoice.products.reduce((total, product) => {
        return total + (product.quantity * product.price);
    }, 0);
    newInvoice.save()
        .then(invoice => {
            console.log('Invoice saved:', invoice);
            req.session.products = [];
            res.redirect('saleshistory')

        })
        .catch(err => {
            console.error('Error saving invoice:', err);
            res.status(500).send('Error saving invoice');
        });
}

const salesHistory = (req, res) => {
    salesInvoiceModel.find().sort({ _id: -1 }) 
        .then((invoices) => {
            res.render('saleshistory', { invoices: invoices })
        })
}

const invoiceDetails = (req, res) => {
    const id = req.params.id;
    salesInvoiceModel.findById(id)
        .then(invoice => {
            if (invoice) {
                console.log('Customer Name:', invoice.customer_name);
                res.render('invoice_detail', { invoice: invoice })
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

const deleteSalesInvoice = (req, res) => {
    const id = req.params.id;
    console.log(id);
    
    salesInvoiceModel.deleteOne({ _id: id })
        .then((response) => {
            if (response.deletedCount === 0) {
                return res.status(404).json({ error: 'Invoice not found' });
            }
            res.status(200).json({ message: 'Invoice deleted successfully' });
        })
        .catch((err) => {
            console.error('Error deleting invoice:', err);
            res.status(500).json({ error: 'Internal server error'});
        });

}

module.exports = { addProduct, addSalesInvoice, salesin, salesHistory, invoiceDetails, viewProducts, removeProduct, deleteSalesInvoice }

