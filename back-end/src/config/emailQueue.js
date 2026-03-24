// jobs/emailQueue.js
const Queue = require("bull");
const { notifyLeave } = require("../utils/nodemailer");

const emailQueue = new Queue("emailQueue", {
  redis: { host: "127.0.0.1", port: 6379 },
});

// Worker - process jobs
emailQueue.process(async (job, done) => {
  try {
    await notifyLeave(job.data); // call nodemailer
    console.log("Email sent:", job.data);
    done();
  } catch (err) {
    console.error(" Email job failed:", err.message);
    done(err);
  }
});

module.exports = emailQueue;
