const express = require('express');
const app = express();
const api = require('./routes/index.route');
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const helmet = require("helmet");
const db = require("./models/index.js")
require("dotenv").config();


app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));




app.use("/api", api)

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;

    res.status(statusCode).json({
        success: false,
        message: error.message || "Internal issue"
    })
})


async function bootstrap() {
    try {
        await db.sequelize.authenticate();
        console.log("Database connected successfully!");

        app.listen(PORT, (error) => {
            if (error) {
                process.exit(1);
            }
            console.log(`Server is running at http://localhost:${PORT}`)
        })
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

bootstrap();

