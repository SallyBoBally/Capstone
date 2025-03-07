import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import cardRoutes from '/src/Routes/cardRoutes.js';

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/cards", cardRoutes);


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));


const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);


app.post("/api/signup", async (req, res) => {
    try {
        console.log("📡 Received signup request:", req.body);
        const { username, email, password } = req.body;


        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            console.log("❌ User already exists:", existingUser);
            return res.status(400).json({ success: false, message: "Username or email already exists" });
        }

        const hashedPassword = await hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        console.log("✅ User created successfully:", newUser);
        res.json({ success: true, message: "Signup successful!" });
    } catch (err) {
        console.error("🔥 Signup Error:", err);
        res.status(500).json({ success: false, message: err.message || "Server error" });
    }
});



app.post('/api/login', async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        const user = await User.findOne({ 
            $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }] 
        });

        if (!user) return res.status(400).json({ success: false, message: "User not found" });


        const isMatch = await compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });


        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        res.json({ success: true, token, user: { username: user.username, email: user.email } });
    } catch (err) {
        console.error("🔥 Login Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
