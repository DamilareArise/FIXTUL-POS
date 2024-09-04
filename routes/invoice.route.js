const express = require('express')
const router = express.Router()
const invoiceModel = require('../models/invoice.model')
const { fixInvoice, fixHistory, invoicePage, homePage, deleteFix, printInvoice } = require('../controllers/invoice.controller')
const { addProduct, addSalesInvoice, salesin, salesHistory, invoiceDetails, viewProducts, removeProduct, deleteSalesInvoice, printSalesInvoice } = require('../controllers/salesInvoice.controller')
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    if (!req.session.token) {
      return res.redirect('/user');
    }
    
    jwt.verify(req.session.token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.render('signin', { status: false, message: 'Session expired' });
      }
      
      req.user = decoded;
      next();
    });
  };
  

router.get('/fixinvo',verifyToken, invoicePage)
router.post('/fix-invoice',verifyToken, fixInvoice)
router.get('/fixhistory', verifyToken, fixHistory)
router.get('/',verifyToken, homePage)
router.post('/add-product', verifyToken, addProduct)
router.post('/add-sales-invoice', verifyToken, addSalesInvoice)
router.get('/salesin',verifyToken, salesin)
router.get('/saleshistory',verifyToken, salesHistory)
router.get('/invoicedetail/:id',verifyToken, invoiceDetails)
router.get('/products-history',verifyToken, viewProducts)
router.get('/remove-product/:id',verifyToken, removeProduct)
router.delete('/delete-fix/:id',verifyToken, deleteFix)
router.delete('/delete-salesInv/:id',verifyToken, deleteSalesInvoice)
router.get('/print-invoice/:id',verifyToken, printInvoice )
router.get('/print-salesInv/:id',verifyToken, printSalesInvoice)


router.get('/reciept', (req, res) => {
    res.render('reciept')
})


module.exports = router