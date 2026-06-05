import { serve } from "https://deno.land/std/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }
  try {
    const {
      phone,
      name,
      referralCode,
      language,
    } = await req.json();

    const sid =
      Deno.env.get("TWILIO_ACCOUNT_SID")!;

    const token =
      Deno.env.get("TWILIO_AUTH_TOKEN")!;

    const from =
      Deno.env.get(
        "TWILIO_WHATSAPP_NUMBER"
      )!;

    const message =
      language === "hi"
        ? `नमस्ते ${name}!

आपका पंजीकरण सफल हुआ।

आपका रेफरल कोड:
${referralCode}

अपने दोस्तों के साथ साझा करें और पॉइंट्स कमाएँ।

Road Warrior 🚀`
        : `Welcome ${name}!

You are now registered.

Your referral code:
${referralCode}

Share it with fellow riders and earn rewards.

Road Warrior 🚀`;

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",

        headers: {
          Authorization:
            "Basic " +
            btoa(`${sid}:${token}`),

          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body: new URLSearchParams({
          From: from,
          To: `whatsapp:+91${phone}`,
          Body: message,
        }),
      }
    );

    const result =
      await response.json();

    return new Response(
  JSON.stringify(result),
  {
    headers: {
      ...corsHeaders,
      "Content-Type":
        "application/json",
    },
  }
);
  } catch (error) {
    return new Response(
  JSON.stringify(error),
  {
    status: 500,
    headers: corsHeaders,
  }
);
  }
});