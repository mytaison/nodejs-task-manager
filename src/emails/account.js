const sgMail = require('@sendgrid/mail')
const sendgridAPIKey = process.env.SENDGRID_KEY

sgMail.setApiKey(sendgridAPIKey)

// Welcome Mail
const sendWelcomeEmail = (email, name) => {
    const sendObj = {
        to : email,
        from : 'connect@mehedihasan.pro',
        subject: "Welcome to the app!",
        text: `Hi ${name}! Thanks for joining in. I hope you will find this application in your daily life.`
    }
    sgMail.send(sendObj)
}

// Goodbye Mail
const sendGoodbyeEmail = (email, name) => {
    const sendObj = {
        to : email,
        from : 'connect@mehedihasan.pro',
        subject: "Farewell my friend!",
        text: `${name}, We are sorry to see you leaving the app. I hope it served well according to your expectation. If not, please send us some feedback so that we can improve the experience and get you back.`
    }
    sgMail.send(sendObj)
}

module.exports= {
    sendWelcomeEmail,
    sendGoodbyeEmail
}