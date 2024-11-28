const { createObjectCsvWriter } = require("csv-writer");
const express = require("express");
const moment = require("moment");
const fs = require("fs");

const app = express();
const port = 3000;

// Middleware for parsing JSON bodies
app.use(express.json());

// CSV file setup
const csvFilePath = "data.csv";
let recordCounter = 1;

// Initialize CSV writer
const csvWriter = createObjectCsvWriter({
  path: csvFilePath,
  header: [
    { id: "no", title: "No" },
    { id: "uid", title: "UID" },
    { id: "name", title: "Name" },
    { id: "date", title: "Date of Entry" },
  ],
  append: fs.existsSync(csvFilePath), // Append to file if it already exists
});

// Check if the file exists and set the recordCounter
if (fs.existsSync(csvFilePath)) {
  const data = fs.readFileSync(csvFilePath, "utf-8").split("\n");
  recordCounter = data.length - 1; // Adjust for rows already in the file
}

// Route to receive data from IoT device
app.post("/iot/data", async (req, res) => {
  const { name, uid } = req.body;

  // Validate input
  if (!name || !uid) {
    return res.status(400).json({ message: "Name and UID are required." });
  }

  const dateOfEntry = moment().format("YYYY-MM-DD HH:mm:ss");
  const newRecord = { no: recordCounter++, uid, name, date: dateOfEntry };

  try {
    // Append to CSV
    await csvWriter.writeRecords([newRecord]);
    res
      .status(200)
      .json({ message: "Data saved successfully.", data: newRecord });
  } catch (err) {
    console.error("Error writing to CSV:", err);
    res.status(500).json({ message: "Failed to save data." });
  }
});

// Route to fetch all CSV data
app.get("/iot/data", (req, res) => {
  try {
    // Check if the file exists
    if (!fs.existsSync(csvFilePath)) {
      return res.status(404).json({ message: "No data found." });
    }

    // Read and parse the CSV file
    const csvData = fs
      .readFileSync(csvFilePath, "utf-8")
      .trim()
      .split("\n")
      .map((line) => line.split(","));

    const headers = csvData[0];
    const rows = csvData.slice(1).map((row) => {
      const record = {};
      headers.forEach((header, index) => {
        record[header.trim()] = row[index].trim();
      });
      return record;
    });

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error reading CSV file:", err);
    res.status(500).json({ message: "Failed to read data." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
