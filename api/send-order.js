export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    orderId,
    hebBody,
    arBody,
    customer,
    totalItems,
    cart,
    notes
  } = req.body || {};

  if (!orderId || !hebBody || !arBody) {
    return res.status(400).json({ error: "Missing data" });
  }

  const to = process.env.ORDER_RECEIVER_EMAIL;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!to || !resendApiKey) {
    return res
      .status(500)
      .json({ error: "Missing ORDER_RECEIVER_EMAIL or RESEND_API_KEY" });
  }

  const fullText =
    hebBody + "\n\n---------------------\n\n" + arBody;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Aluminum Zemer <no-reply@aluminum-zemer.com>",
        to: [to],
        subject: `Order ${orderId}`,
        text: fullText
      })
    });

    if (!response.ok) {
      const txt = await response.text();
      console.error("Resend error:", txt);
      return res.status(500).json({ error: "Failed to send email" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
