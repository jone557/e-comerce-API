const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config({path:'../config.env'});

const { google } = require("googleapis");

const CLIENT_ID = "445553443970-tfvjbkt2ecka6kruvn3him8d3spihc2m.apps.googleusercontent.com";
const CLIENT_SECRET = "9cNie1EzSER1aFM1L761aYsE" ;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04iF96HVxZ0y4CgYIARAAGAQSNwF-L9IrmzcQnJv4EHklisd25NnQFCBouIV7UK8xL67ya6LDwfaAp2d6vZgu5zRNgpOhTirQFHM";

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const sendEmail = async options => {

    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAUTH2",
            user: "segniworku1992@gmail.com",
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken
        }
    })

    const mailOptions = {
        from: 'JSF online shopping <segniworku1992@gmail.com>',
        to: 'segni.guta108421@marwadiuniversity.ac.in',
        subject: options.subject,
        // text: options.message,
        html: `${options.message}`
    }
    const result = await transporter.sendMail(mailOptions);
    console.log(options.subject);
    return result;
}

module.exports = sendEmail;