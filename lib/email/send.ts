import "server-only";

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

const isProduction = process.env.NODE_ENV === "production";

type Transport = (message: EmailMessage) => Promise<void>;

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/** Resend's built-in test sender. Only delivers to the Resend account's own
 *  address, which is exactly what we want outside production. */
const RESEND_TEST_FROM = "Vio <onboarding@resend.dev>";

const sendViaResend: Transport = async (message) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");

  const from = process.env.EMAIL_FROM?.trim();
  if (!from && isProduction) {
    throw new Error(
      "EMAIL_FROM is not set — Resend needs a verified sender in production, e.g. Vio <no-reply@yourdomain.com>"
    );
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: from || RESEND_TEST_FROM,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Resend responded ${response.status} ${response.statusText}: ${detail.slice(0, 300)}`
    );
  }
};

const sendViaWebhook: Transport = async (message) => {
  const webhookUrl = process.env.EMAIL_WEBHOOK_URL?.trim();
  if (!webhookUrl) throw new Error("EMAIL_WEBHOOK_URL is not set");

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Email transport responded ${response.status} ${response.statusText}`
    );
  }
};

/**
 * Development transport: prints the message so signup, verification and reset
 * flows can be exercised without a mail provider.
 */
const sendToConsole: Transport = async (message) => {
  console.info(
    `[email] to=${message.to} subject=${JSON.stringify(message.subject)}\n${message.text}`
  );
};

function resolveTransport(): Transport {
  if (process.env.RESEND_API_KEY) return sendViaResend;
  if (process.env.EMAIL_WEBHOOK_URL) return sendViaWebhook;
  // Never silently swallow a verification or reset email in production — that
  // locks users out of their accounts with no recovery path.
  if (isProduction) {
    throw new Error(
      "No email transport configured. Set RESEND_API_KEY (plus EMAIL_FROM) or EMAIL_WEBHOOK_URL."
    );
  }
  return sendToConsole;
}

/**
 * Send a transactional email. Delivery problems are logged and re-thrown so
 * the caller (better-auth) surfaces a real error instead of reporting success
 * for a message that was never delivered.
 */
export async function sendEmail(message: EmailMessage): Promise<void> {
  const transport = resolveTransport();
  try {
    await transport(message);
  } catch (error) {
    console.error(
      `[email] failed to send "${message.subject}" to ${message.to}:`,
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}
