const functions = require("firebase-functions");
const express = require("express");
const GPTClient = require("./utils/gptclient.util");
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors({
    origin: '*',
    // credentials: true,
}))

// Routes
app.get("/articles/:title/:content", async (req, res) => {
    const { title, content } = req.params;
    if (!title || !content) {
        return res.status(400).end();
    }
    const questions = await GPTClient.getQuestions(title, content);
    res.json(questions).end();
});

module.exports.app = functions.https.onRequest(app);