const jwt = require("jsonwebtoken");
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

// JWT Generate Token API

app.post("/jwt", (req, res) => {

    const user = req.body;

    const token = jwt.sign(

        user,

        process.env.JWT_SECRET,

        {
            expiresIn: "7d"
        }

    );

    res.send({
        token
    });

});


// MongoDB Connection
const uri = `mongodb+srv://resellhub_a10_afrin:Rf8YArqaOHY2lkIS@cluster0.0ogo0ei.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});


// Verify JWT Middleware

const verifyToken = (req, res, next) => {

    const authorization = req.headers.authorization;

    if (!authorization) {

        return res.status(401).send({

            message: "Unauthorized Access"

        });

    }


    const token = authorization.split(" ")[1];


    jwt.verify(

        token,

        process.env.JWT_SECRET,

        (err, decoded) => {


            if (err) {

                return res.status(403).send({

                    message: "Forbidden Access"

                });

            }


            req.decoded = decoded;

            next();

        }

    );

};

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
        const reportsCollection = database.collection("reports");

        // Test API / Get User API
        app.get("/users", async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        });


        // Get Single User

        app.get("/users/:email", async (req, res) => {

            const email = req.params.email;

            const query = {
                email: email
            };

            const result = await usersCollection.findOne(query);

            res.send(result);

        });


        // ======================
        // Settings API
        // ======================

        app.patch("/settings/:id", async (req, res) => {

            const id = req.params.id;
            const body = req.body;

            const query = {
                _id: new ObjectId(id)
            };

            const updateDoc = {
                $set: {
                    darkMode: body.darkMode,
                    notifications: body.notifications
                }
            };

            const result = await usersCollection.updateOne(
                query,
                updateDoc
            );

            res.send(result);

        });



        // Update Profile

        app.patch("/update-profile/:id", async (req, res) => {

            const id = req.params.id;

            const body = req.body;


            const query = {

                _id: new ObjectId(id)

            };


            const updateDoc = {

                $set: {

                    name: body.name,

                    phone: body.phone,

                    address: body.address,

                    photo: body.photo

                }

            };


            const result = await usersCollection.updateOne(

                query,

                updateDoc

            );


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
            };

            const updateDoc = {
                $set: {}
            };

            if (body.status) {
                updateDoc.$set.status = body.status;
            }

            if (body.delivery) {
                updateDoc.$set.delivery = body.delivery;
            }

            const result = await ordersCollection.updateOne(
                query,
                updateDoc
            );

            res.send(result);

        });


        // Cancel Order

        app.patch("/cancel-order/:id", async (req, res) => {

            const id = req.params.id;

            const query = {
                _id: new ObjectId(id)
            };

            const updateDoc = {

                $set: {

                    status: "Cancelled"

                }

            };


            const result = await ordersCollection.updateOne(

                query,
                updateDoc

            );

            res.send(result);

        });


        // =====================
        // Wishlist APIs
        // =====================

        // Get Wishlist

        app.get(

            "/wishlist",

            verifyToken,

            async (req, res) => {

                const result = await wishlistCollection
                    .find()
                    .toArray();

                res.send(result);

            }

        );




        // Add Wishlist

        app.post("/wishlist", async (req, res) => {


            const item = req.body;


            const result = await wishlistCollection.insertOne(item);


            res.send(result);


        });




        // Remove Wishlist


        app.delete("/wishlist/:id", async (req, res) => {


            const id = req.params.id;


            const query = {

                _id: new ObjectId(id)

            };


            const result = await wishlistCollection.deleteOne(query);


            res.send(result);


        });



        // Report Product API


        app.post("/reports", async (req, res) => {

            const report = req.body;

            const result = await reportsCollection.insertOne(report);

            res.send(result);

        });


        // Delete Product

        app.delete("/products/:id", async (req, res) => {

            const id = req.params.id;

            const query = {
                _id: new ObjectId(id)
            };

            const result = await productsCollection.deleteOne(query);

            res.send(result);

        });


        // Payment History API

        app.get("/payments", async (req, res) => {

            const result = await paymentsCollection
                .find()
                .toArray();

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