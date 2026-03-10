const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const dbName = "PHC-Form";
let collection;

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    const db = client.db(dbName);
    collection = db.collection("registrations");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message); // ✅ removed process.exit(1)
  }
}

connectDB();

app.get("/", (req, res) => {
  res.json({ status: "Backend is running ✅" });
});

app.post("/phc-form", async (req, res) => {
  try {
    if (!collection) {
      await connectDB(); // ✅ retry connection if not connected
    }
    console.log("📥 Received:", req.body);
    const result = await collection.insertOne(req.body);
    res.json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message }); // ✅ show actual error
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
