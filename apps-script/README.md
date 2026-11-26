# Gmail contact form setup

The portfolio uses a Google Apps Script web app to send contact form messages to the Gmail inbox configured in `Code.gs`. The script runs as the account that deploys it. The browser never receives a Gmail password or API secret.

## 1. Create the Google endpoint

1. Open [script.google.com](https://script.google.com) while signed in to the Google account that should send the messages.
2. Create a new project and replace the starter code with `Code.gs` from this folder.
3. Set `RECIPIENT_EMAIL` at the top of the script to the Gmail inbox where you want to receive new contact messages. It currently uses `c20245689.astodillo@csav.edu.ph` from the website.
4. Save, then choose **Deploy > New deployment**.
5. Select **Web app**, set **Execute as** to **Me**, and set access to **Anyone** so visitors can submit the public form.
6. Deploy and approve the Google authorization to send email. Copy the web app URL ending in `/exec`.

Google documents the web app deployment settings in its [Apps Script guide](https://developers.google.com/apps-script/guides/web). The script uses Google's [MailApp service](https://developers.google.com/apps-script/reference/mail/mail-app) to send the message and set the visitor's address as Reply-To.

## 2. Connect the website

For local development, create a `.env` file in the project root (it is ignored by Git) with the deployed URL:

```env
PUBLIC_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

Restart the Astro dev server after adding the value.

For Vercel, open the project and go to **Settings > Environment Variables**. Add `PUBLIC_GOOGLE_APPS_SCRIPT_URL` with the deployed `/exec` URL. Select **Production** and **Preview** if you want the form working in both. Save, then redeploy the project so the new build receives the variable.

Send a test message through the form. It should arrive at `RECIPIENT_EMAIL`; replying to it will address the visitor who submitted the form.
