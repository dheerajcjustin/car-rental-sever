const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_AUTH_SERVICE_SID;
const client = require("twilio")(accountSid, authToken);

const sendOtp = async (mobile) => {
  try {
    mobile = Number(mobile);
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: `+91${mobile}`, channel: "sms" });
    return { status: true, verification };
  } catch (error) {
    return { status: false, error };
  }
};
exports.sendOtp = sendOtp;

const otpVerifyFunction = async (otp, mobile) => {
  mobile = Number(mobile);
  const verification_check = await client.verify.v2
    .services(serviceSid)
    .verificationChecks.create({ to: `+91${mobile}`, code: otp });
  console.log("verifcation ckeck otp  ", verification_check.status);
  console.log(verification_check);
  if (verification_check.status == "approved") {
    return { status: true };
  } else {
    return { status: false };
  }
};
exports.otpVerifyFunction = otpVerifyFunction;
