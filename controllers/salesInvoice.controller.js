const express = require('express')
const salesInvoiceModel = require('../models/salesInvoice.model')
const puppeteer = require("puppeteer");
const fs = require('fs');
const path = require('path');



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
            res.status(500).json({ error: 'Internal server error' });
        });

}

const printSalesInvoice = async (req, res) => {
    const id = req.params.id;
    const invoice = await salesInvoiceModel.findById(id);
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                }
                .invoice-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ccc;
                    background-color: #fff;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                .logo {
                    max-width: 150px;
                }
                .company-info {
                    margin-top: 20px;
                }
                .invoice-info {
                    margin-top: 30px;
                    text-align: right;
                }
                .customer-info {
                    margin-top: 30px;
                }
                .table-container {
                    margin-top: 30px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid #ccc;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
                .total {
                    margin-top: 20px;
                    text-align: right;
                }
            </style>
        </head>
        <body>
            <div class="invoice-container">
                <div class="logo">
                    <img src="https://res.cloudinary.com/dtmhv0qae/image/upload/v1724723865/FIXTUL-LOGO_p5k75k.png" alt="Company Logo" height="100">
                </div>
                <div class="company-info">
                    <p>Fixtul Nigeria</p>
                    <p>Alari Akata Complex, <br> Facebook, Under G, <br>210214, Lautech, Ogbomoso, Oyo State</p>
                </div>
                <div class="invoice-info">
                    <p><b>Invoice #:</b> ${invoice._id}</p>
                    <p><b>Date:</b> ${new Date(invoice.date).toLocaleString()}</p>
                </div>
                <div class="customer-info">
                    <p><b>Customer Name:</b> ${invoice.customer_name}</p>
                </div>
                <div class="table-container">
                    <table>
                        <tr>
                            <th scope="col">Product</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Quantity</th>
                        </tr>
                        ${
                            invoice.products.map((element)=>(
                            `
                            <tr>
                                <td>${element.name}</td>
                                <td>${element.price}</td>
                                <td>${element.quantity}</td>
                            </tr>
                            `
                            ))   
                        }
                    
                    </table>
                </div>
                <div class="total">
                    <p><b>Total:</b> #${invoice.total_price}</p>
                </div>
                <p>For enquiries and complaint contact us at Phone number: (+234) 8139654185, and Email address: Fixtulnigeria@gmail.com or visit our website at <b> www.fixtul.com.</b></p>
            </div>
        </body>
        </html>
    `
    // Launch Puppeteer
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Set the content
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Define the PDF path
    const pdfPath = path.join(__dirname, `${invoice.customer_name}_invoice.pdf`);
    console.log(pdfPath);

    // Generate PDF and save it to the filesystem
    await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });

    await browser.close();

    // Serve the PDF file to the client
    res.download(pdfPath, `${invoice.customer_name}_invoice.pdf`, (err) => {
        if (err) {
            console.error('Error sending PDF:', err);
            res.status(500).send('Failed to send PDF');
        }

        // Optionally, delete the file after sending
        fs.unlink(pdfPath, (err) => {
            if (err) console.error('Error deleting PDF:', err);
        });
    });

}

module.exports = { addProduct, addSalesInvoice, salesin, salesHistory, invoiceDetails, viewProducts, removeProduct, deleteSalesInvoice, printSalesInvoice }

