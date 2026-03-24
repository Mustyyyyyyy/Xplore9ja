const env = require("../config/env");

async function initializePaystackPayment({ email, amount, reference, callback_url }) {
  const response = await fetch(`${env.PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amount * 100),
      reference,
      callback_url,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.status) {
    throw new Error(data.message || "Failed to initialize payment");
  }

  return data.data;
}

async function verifyPaystackPayment(reference) {
  const response = await fetch(`${env.PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.status) {
    throw new Error(data.message || "Failed to verify payment");
  }

  return data.data;
}

module.exports = {
  initializePaystackPayment,
  verifyPaystackPayment,
};