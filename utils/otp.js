const speakeasy = require('speakeasy');

const generateOtp = () => {
    let token = speakeasy.totp({
        secret:process.env.OTP_KEY,
        encoding: 'base32',
        digits:4,
        step: 60,
        window:1
    });
    return token;
}


const verifyOtp = (token) => {
    var expiry = speakeasy.totp.verifyDelta({
        secret: process.env.OTP_KEY,
        encoding: 'base32',
        token: '123456',
        window: 2,
        step: 60
      });

    return expiry;
}

module.exports = {generateOtp, verifyOtp};