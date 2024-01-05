const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const sendMailQueue = require("./queue");
const mysql = require("mysql");

//database connection setup
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Shahman7@9",
  database: "mailing_server",
  port: 3306, // Your MySQL port
});

//connect to MySQL
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database!");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/email", async (req, res) => {
  errors = "no errors";
  const { recipients, subjectIn, body } = req.body;

  if (recipients == "" || subjectIn == "" || body == "") {
    errors = "empty set of information";
  } else if (!endsWithGmail(recipients)) {
    errors = "invalid email";
  }

  try {
    // Job data
    const data = {
      recipients: recipients,
      subject: subjectIn,
      body: body,
    };

    const options = {
      attempts: 2,
    };

    // Add job
    sendMailQueue.add(data, options);

    console.log("job added to queue");

    logEmailToDB(data, "queued", errors);

    res.status(200).json({ status: "success", message: "Email sent" });
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    res.status(500).json({ status: "error", message: "Failed to send email" });
  }
});

function logEmailToDB(job, status, errors) {
  const sql = `INSERT INTO email_logs (recipient, subject, body, status, errors)
               VALUES (?, ?, ?, ?, ?)`;
  const values = [job.recipients, job.subject, job.body, status, errors];

  db.query(sql, values, (err, result) => {
    if (err) throw err;
    console.log("Logged to database");
  });
}

function endsWithGmail(recipients) {
  const emailList = recipients.split(",").map((email) => email.trim());
  torf = false;
  for (const email of emailList) {
    const lowerCaseEmail = email.toLowerCase();
    if (lowerCaseEmail.endsWith("@gmail.com")) {
      torf = true;
    } else {
      torf = false;
    }
  }
  return torf;
}

module.exports = app;
