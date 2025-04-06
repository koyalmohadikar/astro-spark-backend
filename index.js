const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require('path');
const { connectToDatabase, disconnectFromDatabase } = require("./src/db/connectDB");
const routes = require("./src/routes/main.route");


dotenv.config();
const PORT = process.env.PORT || 3016;

const app = express();
// Middleware
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/getFiles', express.static(path.join(__dirname, '')));
app.use('/', routes);


app.get("/", (request, response) => {
    response.status(200).json({
        message: "backend live",
    });
});

//if routes not found 
app.get('*', function (req, res) {
    res.status(404).json({ 'message': "Route not found" });
});
app.post('*', function (req, res) {
    res.status(404).json({ 'message': "Route not found" });
});


// error handler
app.use((err, res) => {
    res.status(500).json({
        message: err.message,
        stack: err.stack,
    });
});

// Connect to the database when the application starts
connectToDatabase();

// Handle shutdown gracefully by disconnecting from the database
process.on('SIGINT', async () => {
    await disconnectFromDatabase();
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🏃‍♂️`);
});