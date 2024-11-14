const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
    "mongodb+srv://whardian:6FKOy1u2Tz5P5ff2@cluster0.kkbxejj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
const database = client.db("rmt54");
module.exports = database;
