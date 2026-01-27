const jwt = require('jsonwebtoken');
const { sendResponse } = require('../utils/sendResponse');
const { responseStatus } = require('../utils/responseStatus');

exports.authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res
                .status(responseStatus.code_401)
                .send(sendResponse(null, true, 'Authorization header missing'));
        }

        const token = authHeader.split(' ')[1]; // Bearer <token>
        if (!token) {
            return res
                .status(responseStatus.code_401)
                .send(sendResponse(null, true, 'Token missing'));
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach user info to request
        next();
    } catch (err) {
        return res
            .status(responseStatus.code_401)
            .send(sendResponse(null, true, 'Invalid or expired token'));
    }
};


exports.authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res
                .status(responseStatus.code_401)
                .send(sendResponse(null, true, 'Unauthorized'));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res
                .status(responseStatus.code_403)
                .send(sendResponse(null, true, 'Forbidden: Access denied you do not have rights to perform this'));
        }

        next();
    };
};
