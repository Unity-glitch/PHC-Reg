const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));
app.use(bodyParser.json());

// ✅ Uses Atlas in production, local in development
const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
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
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

connectDB();

// ✅ Root route so Vercel doesn't crash on GET /
app.get("/", (req, res) => {
  res.json({ status: "Backend is running ✅" });
});

// Store form submission
app.post("/phc-form", async (req, res) => {
  // ✅ fixed: phc → pch
  try {
    console.log("📥 Received:", req.body);
    const result = await collection.insertOne(req.body);
    res.json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to register" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
