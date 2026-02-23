const express = require('express');
const { getDb } = require('../config/db');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, phone, image } = req.body;

        const db = getDb();
        const usersCollection = db.collection("users");

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide name, email, and password." });
        }

        const existingUser = await usersCollection.findOne({ email });
        if(existingUser){
            return res.status(400).json({ 
                success: false, 
                message: "User already exists." 
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            name,
            email,
            password: hashedPassword,
            phone: phone || "",
            image: image || "default.png",
            role: "customer",
            isActive: true,
            createdAt: new Date(),
            lastLogin: new Date()
        };

        const result = await usersCollection.insertOne(newUser);

        const token = jwt.sign(
            {
                id: result.insertedId,
                role: newUser.role
            },
            process.env.JWT_SECRET || 'Secret123',
            { 
                expiresIn: '7d'
            }
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            token,
            user: {
                id: result.insertedId,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error!" });

    }
})

router.post('/signin', async (req, res) => {
    try {
        const { email, password, } = req.body;
        const db = getDb();
        const usersCollection = db.collection("users");

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email, and password." });
        }

        const user = await usersCollection.findOne({ email });
        if(!user){
            return res.status(400).json({ 
                success: false, 
                message: "Invalid credentials. User not found!" 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid credentials. Password didn't match!" 
            });
        }

        await usersCollection.updateOne(
            { _id: user._id },
            { $set: { lastLogin: new Date() } }
        );

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET || 'Secret123',
            { 
                expiresIn: '7d'
            }
        );

        res.status(200).json({
            success: true,
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error!" });

    }
})

module.exports = router;