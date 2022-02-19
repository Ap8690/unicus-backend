const sendEmail = require('./sendEmail')

const sendVerificationAdmin = async ({ email, verificationToken, token }) => {
    const verifyEmail = `http://localhost:3000/login/${verificationToken}/${email}/${token}`

    const message = `<p>Please reset password by clicking following link : 
  <a href="${verifyEmail}">Reset Password</a> to complete steps as Admin.</p>`

    return sendEmail({
        to: email,
        subject: 'Admin Acess',
        html: `<h4> Hello,</h4>
    ${message}
    `,
    })
}

module.exports = sendVerificationAdmin
