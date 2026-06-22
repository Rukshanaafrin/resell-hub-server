const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
const uri = `mongodb+srv://resellhub_a10_afrin:Rf8YArqaOHY2lkIS@cluster0.0ogo0ei.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        await client.connect();

        // Database
        const database = client.db("resellhub_db");

        // Collections
        const usersCollection = database.collection("users");
        const productsCollection = database.collection("products");
        const ordersCollection = database.collection("orders");
        const wishlistCollection = database.collection("wishlist");
        const paymentsCollection = database.collection("payments");

        // Test API
        app.get("/users", async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        });

        // Featured Products API
        app.get("/featured-products", async (req, res) => {

            const result = await productsCollection.find().toArray();
            console.log(result);
                

            res.send(result);

        });

        await client.db("admin").command({ ping: 1 });
        console.log("✅ Connected to MongoDB!");

    } catch (err) {
        console.log(err);
    }
}

run();

// Routes
app.get("/", (req, res) => {
    res.send("ReSell Hub Server Running");
});

// Server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});