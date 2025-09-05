export async function verifyTurnstile(responseToken, ip) {
  if (!responseToken)
    return { success: false, "error-codes": ["missing-input"] };

  const form = new URLSearchParams();
  form.append("secret", process.env.TURNSTILE_SECRET);
  form.append("response", responseToken);
  if (ip) form.append("remoteip", ip);

  const resp = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form,
    }
  );

  return resp.json();
}
