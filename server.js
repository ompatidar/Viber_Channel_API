const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const VIBER_AUTH_TOKEN = process.env.VIBER_AUTH_TOKEN;
const VIBER_BASE_URL = "https://chatapi.viber.com";

app.get("/", (req, res) => {
  res.send("Viber Channel API server is running");
});

// Webhook endpoint
app.post("/viber/webhook", (req, res) => {
  console.log("Webhook received:", req.body);

  // Viber expects HTTP 200 OK
  res.sendStatus(200);
});

// Set webhook
app.post("/setup-webhook", async (req, res) => {
  try {
    const webhookUrl = req.body.url;

    const response = await axios.post(`${VIBER_BASE_URL}/pa/set_webhook`, {
      url: webhookUrl,
      auth_token: VIBER_AUTH_TOKEN
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: error.response?.data || error.message
    });
  }
});

// Get account info
app.get("/account-info", async (req, res) => {
  try {
    const response = await axios.post(`${VIBER_BASE_URL}/pa/get_account_info`, {
      auth_token: VIBER_AUTH_TOKEN
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: error.response?.data || error.message
    });
  }
});

// Send text message
app.post("/send-message", async (req, res) => {
  try {
    const { from, text } = req.body;

    const response = await axios.post(`${VIBER_BASE_URL}/pa/post`, {
      auth_token: VIBER_AUTH_TOKEN,
      from,
      type: "text",
      text
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: error.response?.data || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
