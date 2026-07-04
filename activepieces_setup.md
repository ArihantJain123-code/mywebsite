# Connecting Inquiry Forms to Activepieces

This guide explains how to connect your website's contact forms, inquiry modals, and AI chatbot to **Activepieces** for workflow automation. Activepieces is a modern, open-source automation tool (alternative to Zapier/Make) that allows you to trigger actions based on webhooks.

---

## Step 1: Create a Flow in Activepieces
1. Log in to your **Activepieces** account (either [Activepieces Cloud](https://cloud.activepieces.com/) or your self-hosted instance).
2. Click on **New Flow** in the top right corner.
3. Rename your flow by clicking the title in the top-left (e.g., `Website Leads Inquiry Router`).

## Step 2: Configure the Webhook Trigger
1. In the flow builder, click on the **Trigger** block.
2. Search for and select **Webhook** (the trigger type).
3. Set the trigger event to **Catch Webhook**.
4. Activepieces will generate a unique Webhook URL for you. It will look something like:
   `https://cloud.activepieces.com/api/v1/webhooks/YOUR_UNIQUE_ID`
5. **Copy this Webhook URL**. You will need it to update your website's configuration.

## Step 3: Update Website Configuration in `app.js`
1. Open the [app.js](file:///d:/mywebsite/app.js) file.
2. Near the top of the file, find the `ACTIVEPIECES_WEBHOOK_URL` constant:
   ```javascript
   const ACTIVEPIECES_WEBHOOK_URL = "";
   ```
3. Paste your Activepieces Webhook URL inside the quotes:
   ```javascript
   const ACTIVEPIECES_WEBHOOK_URL = "https://cloud.activepieces.com/api/v1/webhooks/YOUR_UNIQUE_ID";
   ```
4. Save the file.

## Step 4: Test the Webhook trigger in Activepieces
1. Go back to your Activepieces flow builder.
2. Click **Test Trigger**. Activepieces will wait for a sample submission.
3. Open your website in a browser, and submit one of the forms:
   - The **Inquiry Modal** (from the top navigation menu)
   - The **Contact Form** (at the bottom of the contact page)
   - The **AI Chatbot** (Priya) at the bottom-right of the page (complete the full name, course, budget, phone, and email steps)
4. Activepieces should receive the test payload successfully! You will see the captured data in the test panel:
   ```json
   {
     "formType": "Inquiry Form",
     "name": "Jane Doe",
     "email": "jane@example.com",
     "phone": "9876543210",
     "location": "New Delhi, Delhi",
     "budget": "₹1 Lakh – ₹1.5 Lakh",
     "course": "Online MBA",
     "message": "Interested in MBA programs",
     "date": "2026-07-04T13:00:00.000Z"
   }
   ```

## Step 5: Add Automation Actions
Now that Activepieces is receiving the lead details, you can add any action step to process the lead:
- **Google Sheets**: Select the Google Sheets piece → *Add Row* to automatically append the lead data to any sheet.
- **Gmail / Email Piece**: Send an automated email confirmation to the student or an internal lead alert to your team.
- **CRM Integration**: Send the lead directly to HubSpot, Zoho CRM, Salesforce, or other CRM pieces.
- **Slack / Telegram**: Post a notification to your channel when a new lead is captured.

## Step 6: Publish the Flow
Once you have configured and tested your actions, click the **Publish** button in the top-right corner of Activepieces to make the automation live!
