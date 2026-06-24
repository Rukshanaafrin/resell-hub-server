const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const { auth } = require("./auth");
const { toNodeHandler } = require("better-auth/node");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", toNodeHandler(auth));


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
        const usersCollection = database.collection("user");
        const productsCollection = database.collection("products");
        const ordersCollection = database.collection("orders");
        const wishlistCollection = database.collection("wishlist");
        const paymentsCollection = database.collection("payments");

        // Test API / Get User API
        app.get("/users", async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        });


        // Update User Status

        app.patch("/users/:id", async (req, res) => {

            const id = req.params.id;

            const body = req.body;


            const query = {

                _id: new ObjectId(id)

            };


            const updateDoc = {

                $set: {

                    status: body.status

                }

            };


            const result = await usersCollection.updateOne(

                query,

                updateDoc

            );


            res.send(result);

        });



        // Delete User


        app.delete("/users/:id", async (req, res) => {


            const id = req.params.id;


            const query = {

                _id: new ObjectId(id)

            };


            const result = await usersCollection.deleteOne(

                query

            );


            res.send(result);

        });



        // Featured Products API
        app.get("/featured-products", async (req, res) => {

            const result = await productsCollection.find().toArray();
            console.log(result);


            res.send(result);

        });


        // All Products API

        app.get("/products", async (req, res) => {

            const category = req.query.category;

            let query = {};


            if (category) {

                query.category = category;

            }


            const result = await productsCollection
                .find(query)
                .toArray();


            res.send(result);

        });


        // Categories API

        app.get("/categories", async (req, res) => {

            const result = await productsCollection.aggregate([

                {
                    $group: {
                        _id: "$category"
                    }
                }

            ]).toArray();


            res.send(result);

        });


        // Product Details API

        app.get("/products/:id", async (req, res) => {


            const id = req.params.id;


            const query = {

                _id: new ObjectId(id)

            }

            const result = await productsCollection.findOne(query);

            res.send(result);

        })

        // Add Product API

        app.post("/products", async (req, res) => {

            const product = req.body;

            const result = await productsCollection.insertOne(product);

            res.send(result);

        });


        // Get All Orders API

        app.get("/orders", async (req, res) => {

            const result = await ordersCollection
                .find()
                .toArray();

            res.send(result);

        })


        // Get All Products For Admin

        app.get("/admin-products", async (req, res) => {

            const result = await productsCollection
                .find()
                .toArray();

            res.send(result);

        });


        // Update Product Status

        app.patch("/admin-products/:id", async (req, res) => {

            const id = req.params.id;

            const body = req.body;


            const query = {

                _id: new ObjectId(id)

            };


            const updateDoc = {

                $set: {

                    status: body.status

                }

            };


            const result = await productsCollection.updateOne(

                query,

                updateDoc

            );


            res.send(result);

        });


        // Delete Product By Admin

        app.delete("/admin-products/:id", async (req, res) => {

            const id = req.params.id;


            const query = {

                _id: new ObjectId(id)

            };


            const result = await productsCollection.deleteOne(

                query

            );


            res.send(result);

        });


        // Update Product API


        app.put("/products/:id", async (req, res) => {


            const id = req.params.id;

            const updated = req.body;



            const query = {

                _id: new ObjectId(id)

            }



            const updateDoc = {


                $set: updated


            }



            const result = await productsCollection.updateOne(

                query,

                updateDoc

            )


            res.send(result);


        })


        // Update Order Status


        app.patch("/orders/:id", async (req, res) => {


            const id = req.params.id;

            const body = req.body;



            const query = {

                _id: new ObjectId(id)

            }



            const updateDoc = {


                $set: {


                    status: body.status,

                    delivery: body.delivery


                }


            }



            const result = await ordersCollection.updateOne(

                query,

                updateDoc

            )


            res.send(result);


        })


        // Delete Product

        app.delete("/products/:id", async (req, res) => {

            const id = req.params.id;

            const query = {
                _id: new ObjectId(id)
            };

            const result = await productsCollection.deleteOne(query);

            res.send(result);

        });


        // My Products API

        app.get("/my-products", async (req, res) => {

            const result = await productsCollection
                .find()
                .toArray();

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