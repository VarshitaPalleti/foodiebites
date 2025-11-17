const { MongoClient } = require("mongodb");

// MongoDB connection URI (can be overridden with environment variable)
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "foodiebites";

let client;
let db;
let isConnected = false;

// In-memory storage as fallback
let inMemoryStorage = {
  restaurants: [],
  orders: [],
};

async function connectDB() {
  try {
    if (!client) {
      client = new MongoClient(uri);
      await client.connect();
      db = client.db(dbName);
      isConnected = true;
      console.log("Connected to MongoDB");
    }
    return db;
  } catch (error) {
    console.warn(
      "MongoDB connection failed, using in-memory storage:",
      error.message
    );
    isConnected = false;
    return null;
  }
}

function getDB() {
  if (isConnected && db) {
    return db;
  }
  // Return mock DB object for in-memory operations
  return {
    collection: (name) => ({
      find: () => ({
        toArray: async () => inMemoryStorage[name] || [],
        sort: () => ({
          toArray: async () => inMemoryStorage[name] || [],
        }),
      }),
      findOne: async (query) => {
        const items = inMemoryStorage[name] || [];
        if (query._id) {
          // Since we're using plain string IDs, just compare directly
          let idString = query._id;
          if (typeof query._id === "object" && query._id.toString) {
            idString = query._id.toString();
          }

          return items.find((item) => item._id === idString);
        }
        return items[0];
      },
      insertOne: async (doc) => {
        if (!inMemoryStorage[name]) {
          inMemoryStorage[name] = [];
        }
        // Use plain string IDs for in-memory storage
        const newId =
          Date.now().toString() + Math.random().toString(36).substr(2, 9);
        doc._id = newId;
        inMemoryStorage[name].push(doc);
        return { insertedId: newId };
      },
      insertMany: async (docs) => {
        if (!inMemoryStorage[name]) {
          inMemoryStorage[name] = [];
        }
        docs.forEach((doc) => {
          // Use plain string IDs for in-memory storage
          doc._id =
            Date.now().toString() + Math.random().toString(36).substr(2, 9);
          inMemoryStorage[name].push(doc);
        });
        return { insertedCount: docs.length };
      },
      countDocuments: async () => {
        return (inMemoryStorage[name] || []).length;
      },
      updateOne: async (query, update) => {
        const items = inMemoryStorage[name] || [];
        // Since we're using plain string IDs, just compare directly
        let queryIdString = query._id;
        if (typeof query._id === "object" && query._id.toString) {
          queryIdString = query._id.toString();
        }

        const index = items.findIndex((item) => item._id === queryIdString);

        if (index !== -1 && update.$set) {
          items[index] = { ...items[index], ...update.$set };
        }
        return { modifiedCount: index !== -1 ? 1 : 0 };
      },
    }),
  };
}

async function closeDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    isConnected = false;
    console.log("MongoDB connection closed");
  }
}

module.exports = { connectDB, getDB, closeDB };
