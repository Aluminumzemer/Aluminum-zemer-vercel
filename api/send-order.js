import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderId, hebrewBody, arabicBody } = req.body;

  if (!orderId || !hebrewBody || !arabicBody) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Aluminum Zemer <orders@aluminum-zemer.com>",
      to: "aluminumzemer408@gmail.com",
      subject: `طلب جديد #${orderId}`,
      text: hebrewBody + "\n\n-----------------\n\n" + arabicBody
    });

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Email failed", details: err });
  }
}
