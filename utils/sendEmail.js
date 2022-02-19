const nodemailer = require('nodemailer')
const nodemailerConfig = require('./nodemailerConfig')

const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport(nodemailerConfig)
    console.log('sendEmail')
    return transporter.sendMail({
        from: '"UNICUS" <noreply@unicus.com>', // sender address
        to,
        subject,
        html,
    })
}

module.exports = sendEmail
