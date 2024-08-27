const express = require("express");
const puppeteer = require("puppeteer-core");
const fs = require('fs');
const path = require('path');
const invoiceModel = require("../models/invoice.model");

const fixInvoice = (req, res) => {
    invoiceInfo = req.body;
    let form = new invoiceModel(invoiceInfo);
    form
        .save()
        .then(() => {
            console.log("Invoice saved");
            res.redirect("fixhistory");
        })
        .catch((err) => {
            console.log(err, "Invoice not saved");
            res.render("fixinvo", { saved: false });
        });
};

const fixHistory = (req, res) => {
    invoiceModel
        .find()
        .sort({ _id: -1 })
        .then((invoices) => {
            res.render("fixhistory", { invoices: invoices });
        });
};

const deleteFix = (req, res) => {
    let id = req.params.id;
    console.log(id);

    invoiceModel
        .deleteOne({ _id: id })
        .then((response) => {
            if (response.deletedCount === 0) {
                return res.status(404).json({ error: "Invoice not found" });
            }
            res.status(200).json({ message: "Invoice deleted successfully" });
        })
        .catch((err) => {
            console.error("Error deleting invoice:", err);
            res.status(500).json({ error: "Internal server error" });
        });
};

const invoicePage = (req, res) => {
    res.render("fixinvo", { saved: true });
};

const homePage = (req, res) => {
    res.render("invoice");
};

const printInvoice = async (req, res) => {
    try {
        const invoiceId = req.params.id;
        const invoice = await invoiceModel.findById(invoiceId);

        if (!invoice) {
            return res.status(404).send('Invoice not found');
        }

        // Generate the HTML content dynamically
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
                                <th>Device</th>
                                <th>Description</th>
                                <th>Total</th>
                            </tr>
                            <tr>
                                <td>${invoice.device_name}</td>
                                <td>${invoice.description}</td>
                                <td>${invoice.amount_paid}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="total">
                        <p><b>Total:</b> #${invoice.amount_paid}</p>
                    </div>
                    <p>For enquiries and complaint contact us at Phone number: (+234) 8139654185, and Email address: Fixtulnigeria@gmail.com or visit our website at <b> www.fixtul.com.</b></p>
                </div>
            </body>
            </html>
        `;

        // Launch Puppeteer
        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium-browser',
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


    } catch (error) {
        console.error('Error generating invoice:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    fixInvoice,
    fixHistory,
    invoicePage,
    homePage,
    deleteFix,
    printInvoice,
};
