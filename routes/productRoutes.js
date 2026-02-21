const express = require('express');
const { getDb } = require('../config/db');
const router = express.Router();

router.post('/add', async(req, res) => {
    try {
        const db = getDb();
        const newProduct = req.body;

        if (!newProduct.name || !newProduct.price) {
            return res.status(400).send({
                success: false,
                message: "প্রোডাক্টের নাম এবং দাম অবশ্যই দিতে হবে!"
            });
        }

        const result = await db.collection('products').insertOne(newProduct);

        res.status(201).send({
            success: true,
            message: "প্রোডাক্ট সফলভাবে যোগ করা হয়েছে! ✅",
            insertedId: result.insertedId
        });

    } catch (error) {
        console.error("ডাটা সেভ করতে সমস্যা:", error);
        res.status(500).send({
            success: false,
            message: "সার্ভারে সমস্যা হয়েছে, ডাটা সেভ করা যায়নি।" 
        });
    }
})

module.exports = router;