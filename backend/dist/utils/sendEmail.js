const nodemailer = require('nodemailer');

const sendEmail = async(options)=>{
    const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth:{
            user: process.env.NODEMAILER_EMAIL,
            pass:process.env.NODEMAILER_PASS,
        }
    });

    const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: options.email,
        subject : options.subject,
        text : options.message,
    }

    await transporter.sendMail(mailOptions);
}
module.exports = sendEmail;