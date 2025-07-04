const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const bodyParser = require("body-parser");

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json"); // Download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ecommerce-79bf2-default-rtdb.firebaseio.com/",
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API endpoint to get user messages
app.get("/api/user-messages/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const db = admin.database();
    const messagesRef = db.ref(`swiftusermessages/${userId}`);

    messagesRef.once("value", (snapshot) => {
      const messages = snapshot.val();

      if (!messages) {
        return res.status(200).json([]);
      }

      // Convert to array and sort by timestamp
      const messagesArray = Object.entries(messages)
        .map(([key, value]) => ({ id: key, ...value }))
        .sort((a, b) => a.timestamp - b.timestamp);

      res.status(200).json(messagesArray);
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// API endpoint to send a message
app.post("/api/send-message/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { text, sender, name } = req.body;

    if (!text || !sender || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const db = admin.database();
    const messagesRef = db.ref(`swiftusermessages/${userId}`);

    const newMessage = {
      text,
      sender,
      name,
      timestamp: admin.database.ServerValue.TIMESTAMP,
      status: "sent",
    };

    const newMessageRef = messagesRef.push();
    await newMessageRef.set(newMessage);

    res.status(201).json({
      id: newMessageRef.key,
      ...newMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// API endpoint to mark messages as read
app.put("/api/mark-read/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { messageIds } = req.body;

    if (!messageIds || !Array.isArray(messageIds)) {
      return res.status(400).json({ error: "Invalid message IDs" });
    }

    const db = admin.database();
    const updates = {};

    messageIds.forEach((id) => {
      updates[`swiftusermessages/${userId}/${id}/status`] = "read";
    });

    await db.ref().update(updates);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ error: "Failed to update message status" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
