const { admin, db } = require('../util/admin');
const nodemailer = require('nodemailer');
const { emailConfig } = require('../emailConfig');
const verifyEmailUrl = 'https://code-tutor.beholddevelopment.com/verify-email?oobCode='

exports.sendVerificationEmail = (email, oobCode) => {
    return new Promise((resolve, reject) => {
        console.log('here')
        const transporter = nodemailer.createTransport(emailConfig);
        transporter.sendMail({
            from: '"PawPals!" <admin@vastdime.com>',
            to: email,
            subject: 'Please Confirm Your Email',
            html: `<p>Woof Woof! Thank you for creating an account. Click ${ verifyEmailUrl + oobCode } to use your account, oobCode: ${ oobCode }</p>`,
        }).then(info => {
            return resolve(info)
        }).catch(err => {
            return reject(err)
        })
    })
}

exports.sendPasswordResetEmail = (email, oobCode) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport(emailConfig);
        transporter.sendMail({
            from: '"PawPals!" <admin@vastdime.com>',
            to: email,
            subject: 'Reset Your Password',
            html: `<p>To reset your Code-Tutor account please click here ${ verifyEmailUrl + oobCode }</p>`,
        }).then(info => {
            return resolve(info)
        }).catch(err => {
            return reject(err)
        })
    })
}
