const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
// middleware

app.use(cors());
app.use(express.json());
// require("./index.js");
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g7zap.mongodb.net/?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kxy80.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("coding-test");
    const dropDownsCollections = database.collection("dropdown");
    const userInformationCollection = database.collection("information");

    // usersdetail post api

    app.post("/userInformation", async (req, res) => {
      const userInfo = req.body;
      // console.log("first", user);
      const result = await userInformationCollection.insertOne(userInfo);
      res.json(result);
    });
    app.get("/dropDown", async (req, res) => {
      const cursor = dropDownsCollections.find({});
      const user = await cursor.toArray();
      res.send(user);
    });
    app.get("/userInformation", async (req, res) => {
      const cursor = userInformationCollection.find({});
      const userInfo = await cursor.toArray();
      res.send(userInfo);
    });

    app.put("/userInformation", async (req, res) => {
      const user = req.body;
      const filter = { id: user._id };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await userInformationCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("codding server is running");
});

app.listen(port, () => {
  console.log("codding running at port ", port);
});
