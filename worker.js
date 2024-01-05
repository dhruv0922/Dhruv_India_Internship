const sendMailQueue = require("./queue");
const sendMail = require("./mailer");
const mysql = require("mysql");

// Create a MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Shahman7@9",
  database: "mailing_server",
  port: 3306,
});

// Connect to MySQL
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database!");
});

// Process jobs from the queue
sendMailQueue.process(async (job) => {
  let { recipients, subject, body } = job.data;

  if (recipients != "" && subject != "" && body != "") {
    //error is because of empty set
    if (endsWithGmail(recipients)) {
      // error is with email
      sendMail(recipients, subject, body);
      //console.log(job.id);
      updateStatus(job.id);
      console.log(`sending email`);
    } else {
      console.log(`Email for: ${job.id} not sent due to invalid email`);
    }
  } else {
    console.log(`Email for: ${job.id} not sent due to invalid information`);
  }
});

function updateStatus(jobId) {
  const sql = `UPDATE email_logs SET status = 'sent' WHERE id = ?`;
  db.query(sql, jobId, (err, result) => {
    if (err) throw err;
    console.log(`Status updated to 'sent' for job ID: ${jobId}`);
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
