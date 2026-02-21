const express = require('express')
const cors = require('cors');
const { connectDB } = require('./config/db');
const app = express()
require('dotenv').config();
const port = process.env.PORT || 3000;
const productRoutes = require('./routes/productRoutes');

app.use(cors())
app.use(express.json())

app.use('/api/products', productRoutes);

connectDB().then(() => {
    app.get('/', (req, res) => {
        res.send('NirmanBD server is running! ✅');
    });

    app.listen(port, () => {
        console.log(`Server Running Port: ${port}`);
        console.log(`Brower URL: http://localhost:${port}`);
    });

}).catch(err => {
    console.error("opps database and server error ❌", err);
});