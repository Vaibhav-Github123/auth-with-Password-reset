// Node.js program to demonstrate the
// crypto.randomBytes() method

// Including crypto module
// const crypto = require('crypto');

// // Calling randomBytes method with callback
// crypto.randomBytes(1270, (err, buf) => {
//   if (err) {
//     // Prints error
//     console.log(err);
//     return;
//   }

//   // Prints random bytes of generated data
//   console.log("The random data is: "
//              + buf.toString('hex'));
// });

const cron = require("node-cron");
const express = require("express");

// app = express(); // Initializing app

// // Creating a cron job which runs on every 10 second
// cron.schedule("*/10 * * * * *", function() {
//     console.log("running a task every 10 second");
// });

// app.listen(3000);

const job = cron.schedule("* * * * * *", function jobYouNeedToExecute() {
  // Do whatever you want in here. Send email, Make  database backup or download data.
  console.log(new Date().toLocaleString());
});
