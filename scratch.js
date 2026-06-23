const http = require('http');

const data = JSON.stringify({
  phone: "01335106726", // The vendor's phone from the JSON
  otpCode: "1234" // Wait, I don't know the OTP. But I can just check the DB directly to see if the vendor query works!
});
