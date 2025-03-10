import nodemailer from "nodemailer"

const transport = nodemailer.createTransport({
    host : 'localhost',
    port : 25,
    secure : false,
    /*auth : {
        user : process.env.SMTP_USER,
        pass : process.env.SMTP_PASS
    },*/
    tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
    },
    /*debug: true, // Enable SMTP debug output
    logger: true // Log SMTP transactions*/
})

export default transport;