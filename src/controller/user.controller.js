const User = require('../models/user.model');
const Employee = require('../models/employee.model');

const Role = require('../models/role.model');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv')

dotenv.config()
const jwt = require('jsonwebtoken');
const { sendResponse } = require('../utils/sendResponse');
const { responseStatus } = require('../utils/responseStatus');


exports.signup = async (req, res) => {
    try {
        const { name, email, password, roleId } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res
                .status(responseStatus.code_400)
                .send(sendResponse(null, true, 'Invalid email format'));
        }
           const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

        if (!passwordRegex.test(password)) {
            return res
                .status(responseStatus.code_400)
                .send(
                    sendResponse(
                        null,
                        true,
                        'Password must be at least 6 characters long and include uppercase, lowercase, number, and special character'
                    )
                );
        }
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(responseStatus.code_400)
                .send(sendResponse(null, true, 'Email already exists'));
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: roleId,
        });

        await user.save();

        // Populate role to check its name
        await user.populate('role', 'role');

        // If role is Employee, save to Employee collection
        if (user.role.role === 'Employee') {
            const existingEmployee = await Employee.findOne({ email });
            if (!existingEmployee) {
                const newEmployee = new Employee({
                    name: user.name,
                    email: user.email,
                    password: hashedPassword, 
                    role: roleId,
                });
                await newEmployee.save();
            }
        }

        return res
            .status(responseStatus.code_201)
            .send(sendResponse(user, false, 'User created successfully'));
    } catch (err) {
        return res
            .status(responseStatus.code_500)
            .send(sendResponse(null, true, err.message));
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user and populate role 
        const user = await User.findOne({ email })
            .populate('role', 'role')        // only name field

        if (!user) {
            return res
                .status(responseStatus.code_400)
                .send(sendResponse(null, true, 'Invalid email or password'));
        }

        // Compare password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res
                .status(responseStatus.code_400)
                .send(sendResponse(null, true, 'Invalid email or password'));
        }

        // Payload for JWT
        const payload = {
            id: user._id,
            role: user.role.role
        };
        console.log("oa", payload)
        // Generate access token
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES || '1d'
        });

        // Generate refresh token
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
        });

        const finalData = {
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role.name,
            }
        };

        return res
            .status(responseStatus.code_200)
            .send(sendResponse(finalData, false, 'Login successful'));
    } catch (err) {
        return res
            .status(responseStatus.code_500)
            .send(sendResponse(null, true, err.message));
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .populate('role', 'name')


        return res
            .status(responseStatus.code_200)
            .send(sendResponse(users, false, 'Users fetched successfully'));
    } catch (err) {
        return res
            .status(responseStatus.code_500)
            .send(sendResponse(null, true, err.message));
    }
};


