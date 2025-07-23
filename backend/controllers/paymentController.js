import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10",
});

export const createCheckoutSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: req.body.items,
      mode: "payment",
      success_url: "http://localhost:1234/checkout?success=true",
      cancel_url: "http://localhost:1234/checkout?success=false",
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe Error", err);
    res.status(500).json({ error: "Stripe session creation failed." });
  }
};
