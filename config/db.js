const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DB_URI;
const client = new MongoClient(uri);

let db;

const connectDB = async () => {
    try {
        await client.connect();
        db = client.db("NirmanBD");
        console.log("Database Connect Hoyeche! ✅");
    } catch (error) {
        console.error("Connect korte error hoyeche:", error);
    }
};

const getDb = () => db;

module.exports = { connectDB, getDb };