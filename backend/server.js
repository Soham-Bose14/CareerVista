const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

const app = express();
dotenv.config();
// connnectDB();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to CareerVista.");
});

const PORT = process.env.PORT || 4000

app.listen(PORT, console.log(`Server started on port ${PORT}`));
