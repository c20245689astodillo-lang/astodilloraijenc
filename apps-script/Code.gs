// Change this to the Gmail inbox where you want to receive contact messages.
const RECIPIENT_EMAIL = "c20245689.astodillo@csav.edu.ph";

function doPost(event) {
  const fields = event && event.parameter ? event.parameter : {};
  const honeypot = cleanSingleLine_(fields.company, 120);

  // Ignore bots that fill the hidden field, while keeping the response generic.
  if (honeypot) return contactResponse_(true);

  const name = cleanSingleLine_(fields.name, 100);
  const email = cleanSingleLine_(fields.email, 254);
  const message = String(fields.message || "").replace(/\r/g, "").trim().slice(0, 5000);

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) {
    return contactResponse_(false);
  }

  try {
    MailApp.sendEmail({
      to: RECIPIENT_EMAIL,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      body: `You received a new message from your portfolio.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    return contactResponse_(true);
  } catch (error) {
    console.error(error);
    return contactResponse_(false);
  }
}

function cleanSingleLine_(value, maxLength) {
  return String(value || "")
    .replace(/[\r\n\u0000-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, maxLength);
}

function contactResponse_(success) {
  const result = JSON.stringify({ type: "portfolio-contact-result", success: Boolean(success) });
  const html = `<!doctype html><html><head><meta charset="utf-8"></head><body><script>window.parent.postMessage(${result}, "*");</script></body></html>`;

  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
