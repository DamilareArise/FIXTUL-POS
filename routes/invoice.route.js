const express = require('express')
const router = express.Router()
const invoiceModel = require('../models/invoice.model')
const { fixInvoice, fixHistory, invoicePage, homePage, deleteFix, printInvoice } = require('../controllers/invoice.controller')
const { addProduct, addSalesInvoice, salesin, salesHistory, invoiceDetails, viewProducts, removeProduct, deleteSalesInvoice, printSalesInvoice } = require('../controllers/salesInvoice.controller')


router.get('/fixinvo', invoicePage)
router.post('/fix-invoice', fixInvoice)
router.get('/fixhistory', fixHistory)
router.get('/', homePage)
router.post('/add-product', addProduct)
router.post('/add-sales-invoice', addSalesInvoice)
router.get('/salesin', salesin)
router.get('/saleshistory', salesHistory)
router.get('/invoicedetail/:id', invoiceDetails)
router.get('/products-history', viewProducts)
router.get('/remove-product/:id', removeProduct)
router.delete('/delete-fix/:id', deleteFix)
router.delete('/delete-salesInv/:id', deleteSalesInvoice)
router.get('/print-invoice/:id', printInvoice )
router.get('/print-salesInv/:id', printSalesInvoice)


router.get('/reciept', (req, res) => {
    res.render('reciept')
})


module.exports = router