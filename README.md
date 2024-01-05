This is an email utility integrated within a network of loosely interconnected microservices, accessible to users across the company via an API gateway

This Node.js application, is a mailing service application that recieves post requests with unique json files sent through postman, specifying the email information including: the recipients, the subject(s), and the body. 

Each post request is then stored and proccessed using a redis queue, and every email queued and sent is logged into a chart using a mysql database.

The chart holds several pieces of information about each email including, the numeric id, email addresses, time, date, subject, body, status (queued or sent), and any errors to be accounted for. 

redis commands:

cd C:\Program Files\Redis

redis-server --port 6380

// start a server on port 6380

mysql commands:

SHOW DATABASES; --> list of databases
USE database_name --> change to a database
SHOW TABLES; --> show tables in the database
SELECT * FROM your_table; --> show all data in the selected table
DELETE FROM your_table; --> delete all date in the selected table
ALTER TABLE email_logs AUTO_INCREMENT = 1;