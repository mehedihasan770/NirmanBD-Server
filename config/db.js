const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DB_URI;
const client = new MongoClient(uri);

let db;

const connectDB = async () => {
    try {
        await client.connect();
        db = client.db("NirmanBD"); // Ekhane apnar database er nam hobe
        console.log("Database Connect Hoyeche! ✅");
    } catch (error) {
        console.error("Connect korte error hoyeche:", error);
    }
};

// Eta diye amra onno file e database ke niye jabo
const getDb = () => db;

module.exports = { connectDB, getDb };