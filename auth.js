require("dotenv").config();

const { betterAuth } = require("better-auth");
const { mongodbAdapter } = require("better-auth/adapters/mongodb");
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_DB_URI);

const db = client.db(process.env.AUTH_DB_NAME);

console.log("ID:", process.env.GOOGLE_CLIENT_ID);
console.log("SECRET:", process.env.GOOGLE_CLIENT_SECRET);

exports.auth = betterAuth({

    trustedOrigins: [
        "https://resell-hub-client-blond.vercel.app"
    ],

    emailAndPassword: {
        enabled: true
    },

    socialProviders: {

        google: {

            clientId: process.env.GOOGLE_CLIENT_ID,

            clientSecret: process.env.GOOGLE_CLIENT_SECRET,

        },

    },

    database: mongodbAdapter(db, {
        client
    })

});

