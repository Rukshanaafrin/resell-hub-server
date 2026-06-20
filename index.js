const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;



app.use(cors());

app.use(express.json());

app.use(cookieParser());



app.get("/", (req, res) => {

    res.send("ReSell Hub Server Running");

});



app.listen(port, () => {

    console.log(`Server running on port ${port}`);

});