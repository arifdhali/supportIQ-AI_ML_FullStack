const express = require('express');
const app = express();
const api = require('./routes/index.route');
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const helmet = require("helmet");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(helmet());





app.use("/api", api)

app.use((req, res, next, error) => {
    res.status(500).json({
        message: error.message
    })
    next(error)
})


app.listen(PORT, (error) => {
    if (error) {
        process.exit(1);
    }
    console.log(`Server is running at http://localhost:${PORT}`)
})