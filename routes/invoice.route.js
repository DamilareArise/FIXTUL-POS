const express = require('express')
const router = express.Router()
const invoiceModel = require('../models/invoice.model')
const { fixInvoice, fixHistory, invoicePage, homePage } = require('../controllers/invoice.controller')
const { addProduct, addSalesInvoice, salesin, salesHistory, invoiceDetails, viewProducts, removeProduct } = require('../controllers/salesInvoice.controller')


router.get('/fixinvo', invoicePage)
router.post('/fix-invoice', fixInvoice)
router.get('/fixhistory', fixHistory)
router.get('/', homePage)
router.post('/add-product', addProduct)
router.post('/add-sales-invoice', addSalesInvoice)
router.get('/salesin', salesin)
router.get('/saleshistory', salesHistory)
router.get('/invoicedetail/:invoiceId', invoiceDetails)
router.get('/products-history', viewProducts)
router.get('/remove-product/:id', removeProduct)


router.get('/reciept', (req, res) => {
    res.render('reciept')
})


module.exports = router