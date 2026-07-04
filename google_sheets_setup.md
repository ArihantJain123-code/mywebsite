# Connecting Inquiry Forms to Google Sheets

Since this is a static frontend website, submissions can be securely and directly sent to Google Sheets using **Google Apps Script**. Follow the step-by-step guide below to configure and activate this integration.

---

## Step 1: Create a Google Spreadsheet
1. Open [Google Sheets](https://sheets.google.com) and create a **blank spreadsheet**.
2. Give your spreadsheet a name (e.g., `Inquiry Submissions`).

## Step 2: Open Google Apps Script
1. In the top menu of your Google Spreadsheet, click on **Extensions** > **Apps Script**.
2. Delete any code inside the editor window (typically a blank `myFunction()`).

## Step 3: Paste the Apps Script Code
Copy the code below and paste it into the Apps Script editor:

```javascript
function doPost(e) {
  // Set up CORS header
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming JSON payload
    var data = JSON.parse(e.postData.contents);
    
    // If the sheet is completely empty, append headers first
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Form Type",
        "Name",
        "Email",
        "Phone",
        "Location / City",
        "Budget Preference",
        "Preferred Course",
        "Message"
      ]);
      
      // Format headers bold
      sheet.getRange(1, 1, 1, 9).setFontWeight("bold").setBackground("#f3f4f6");
    }
    
    // Format timestamp nicely
    var timestamp = new Date();
    
    // Append the submission row
    sheet.appendRow([
      timestamp,
      data.formType || "Inquiry",
      data.name || "",
      data.email || "",
      data.phone || "",
      data.location || "",
      data.budget || "",
      data.course || "",
      data.message || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Inquiry recorded" }))
                         .setMimeType(ContentService.MimeType.JSON)
                         .setHeaders(headers);
                         
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON)
                         .setHeaders(headers);
  }
}

// Support preflight OPTIONS requests for CORS
function doOptions(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  return ContentService.createTextOutput("")
                       .setMimeType(ContentService.MimeType.TEXT)
                       .setHeaders(headers);
}

function doGet(e) {
  return ContentService.createTextOutput("Google Sheets Web App is up and running!");
}
```

3. Save the script by clicking the disk icon or pressing `Ctrl + S`.

## Step 4: Deploy as a Web App
1. Click the **Deploy** button in the top right corner and choose **New deployment**.
2. Click the gear icon next to "Select type" and select **Web app**.
3. Configure the fields exactly as follows:
   - **Description**: `Online Degrees Inquiry Form Handler`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: `Anyone` *(This is required so the frontend site can send data without authentication)*
4. Click **Deploy**.
5. Google will ask you to **Authorize access**. Click "Authorize access", sign in with your account, click "Advanced" -> "Go to Untitled project (unsafe)" / "Go to ... (unsafe)", and click **Allow**.
6. Once deployed, copy the **Web app URL** provided (it will look like `https://script.google.com/macros/s/.../exec`).

## Step 5: Update the Configuration in `app.js`
1. Open the [app.js](file:///d:/mywebsite/app.js) file.
2. Near the top of the file, find the `GOOGLE_SCRIPT_URL` variable.
3. Paste your Web App URL inside the quotes:
   ```javascript
   const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/.../exec";
   ```
4. Save the file. Your forms are now live and connected!
