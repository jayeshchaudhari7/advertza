/**
 * Google Sheets Integration (Optional)
 * 
 * To use: place your service-account.json in the backend root
 * and set GOOGLE_SHEET_ID in .env
 */
const { google } = require("googleapis");
const path = require("path");

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "../service-account.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const spreadsheetId = process.env.GOOGLE_SHEET_ID || "YOUR_GOOGLE_SHEET_ID";

async function appendRow(data) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A:G",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [data],
    },
  });
}

module.exports = appendRow;
