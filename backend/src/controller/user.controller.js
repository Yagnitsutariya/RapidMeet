// Import User model (MongoDB schema)
import { User } from "../model/user.model.js";

// Import HTTP status codes (like 200, 404, 500)
import httpStatus from "http-status";

// Import bcrypt for password hashing & comparison
import bcrypt from "bcrypt";

// Import crypto for generating random tokens
import crypto from "crypto";

/* =========================
   LOGIN CONTROLLER
========================= */
const login = async (req, res) => {

    // Extract username and password from request body
    const { username, password } = req.body;

    // If username or password is missing, return error
    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "username and password are required" });
    }

    try {
        // Find user in database using username
        const user = await User.findOne({ username });

        // If user does not exist, return 404
        if (!user) {
            return res
                .status(httpStatus.NOT_FOUND)
                .json({ message: "user not found" });
        }

        // Compare entered password with hashed password in DB
        if (await bcrypt.compare(password, user.password)) {

            // Generate a random token (used for authentication)
            let token = crypto.randomBytes(20).toString("hex");

            // Save token in user document
            user.token = token;

            // Save updated user to database
            await user.save();

            // Send token back to client
            return res
                .status(httpStatus.OK)
                .json({ token: token });
        }

        // If password is incorrect (optional improvement)
        return res
            .status(httpStatus.UNAUTHORIZED)
            .json({ message: "invalid password" });

    } catch (e) {
        // Handle server errors
        res
            .status(500)
            .json({ message: e.message });
    }
};

/* =========================
   REGISTER CONTROLLER
========================= */
const register = async (req, res) => {

    // Extract user details from request body
    const { name, username, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });

        // If user exists, return error
        if (existingUser) {
            return res
                .status(httpStatus.FOUND)
                .json({ message: "user already exists" });
        }

        // Hash password before saving to database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user object
        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword
        });

        // Save user to database
        await newUser.save();

        // Send success response
        res
            .status(httpStatus.CREATED)
            .json({ message: "user registered successfully" });

    } catch (e) {
        // Handle server errors
        res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: e.message });
    }
};

// Export controllers
export { login, register };
