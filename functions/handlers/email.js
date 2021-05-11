const { admin, db } = require('../util/admin');
const nodemailer = require('nodemailer');
const { emailConfig } = require('../emailConfig');
const verifyEmailUrl = '/verify-email?oobCode='

exports.sendVerificationEmail = (email, oobCode, loc) => {
    if (loc === 'localhost' ) {
        loc = 'localhost:4200'
    }
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport(emailConfig);
        transporter.sendMail({
            from: '"PawPals!" <admin@vastdime.com>',
            to: email,
            subject: 'Please Confirm Your Email',
            html: `<p>Woof Woof! Thank you for creating an account. Click http://${ loc }${ verifyEmailUrl + oobCode } to use your account</p>`,
        }).then(info => {
            return resolve(info)
        }).catch(err => {
            return reject(err)
        })
    })
}

exports.sendPasswordResetEmail = (email, oobCode, loc) => {
    if (loc === 'localhost' ) {
        loc = 'localhost:4200'
    }
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport(emailConfig);
        transporter.sendMail({
            from: '"PawPals!" <admin@vastdime.com>',
            to: email,
            subject: 'Reset Your Password',
            html: `<p>To reset your Code-Tutor account please click here http://${ loc }${ verifyEmailUrl + oobCode }</p>`,
        }).then(info => {
            return resolve(info)
        }).catch(err => {
            return reject(err)
        })
    })
}
