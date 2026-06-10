import axios from "axios";

export default async function handler(
  req,
  res
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  const { phone, otp } = req.body;

  console.log("PHONE:", phone);
console.log("OTP:", otp);
console.log(
  "API KEY EXISTS:",
  !!process.env.FAST2SMS_API_KEY
);
console.log("KEY:", process.env.FAST2SMS_API_KEY);


  try {
    const response = await axios.get(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        headers: {
          authorization:
            process.env.FAST2SMS_API_KEY,
        },
        params: {
          route: "otp",
          variables_values: otp,
          numbers: phone,
        },
      }
    );

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
  console.log("FULL ERROR:");

  if (error.response) {
    console.log(error.response.data);
  } else {
    console.log(error);
  }

  return res.status(500).json({
    success: false,
    error:
      error.response?.data ||
      error.message,
  });
}
}