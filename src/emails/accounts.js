const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'fhabib4@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: 'fhabib4@gmail.com',
        from: 'fhabib4@gmail.com',
        subject: 'This is my first creation!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
} 

module.exports = {
    sendWelcomeEmail: sendWelcomeEmail
}