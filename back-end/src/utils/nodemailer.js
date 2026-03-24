const nodemailer = require('nodemailer');
const dotenv =require('dotenv');
dotenv.config()

// configure transporter (use your SMTP details)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toDateString();
};

const notifyLeave = async ({ type, leave, employee, managers = [] }) => {
    try {
        let mailOptions = {};

        if (type === 'new') {
            // Notify manager/admin about new leave request
            if (!managers.length) return;
            const managerEmails = managers.map(m => m.email);
            mailOptions = {
                from: `<${process.env.EMAIL_USER}>`,
                to: managerEmails,
                subject: `New leave request submitted by ${employee.name}`,
                text: `Employee ${employee.name} submitted a leave request from ${formatDate(leave.startDate)} to ${formatDate(leave.endDate)}.\n\nPlease review it.\n\nHR System`
            };
        } else if (type === 'review') {
            // Notify employee about leave status update
            if (!employee || !employee.email) return;
            mailOptions = {
                from: `<${process.env.EMAIL_USER}>`,
                to: employee.email,
                subject: `Your leave request has been ${leave.status}`,
                text: `Hello ${employee.name},\n\nYour leave request from ${formatDate(leave.startDate)} to ${formatDate(leave.endDate)} has been ${leave.status.toLowerCase()}.\n\nRegards,\nHR Team`
            };
        } else {
            return;
        }

        const info = await transporter.sendMail(mailOptions);
        console.log('Notification sent:', info.response);
    } catch (err) {
        console.error('Email notification failed:', err.message);
    }
};

module.exports = { notifyLeave };
