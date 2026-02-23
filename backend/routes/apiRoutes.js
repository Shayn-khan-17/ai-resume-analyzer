const express = require("express");
const { analyzeResumeController } = require("../controllers/analyzeController");
const { fetchJobsController } = require("../controllers/jobsController");
const upload = require("../middleware/uploadMiddleware");
const { queueRequest } = require("../middleware/queueMiddleware");
const { queryHuggingFace } = require("../hfClient");
const axios = require('axios');

const router = express.Router();

// Test endpoints
router.get("/ping", (req, res) => {
  res.json({ status: "Server running with JSearch API! 🚀" });
});

router.get("/test-jsearch", async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/search',
      params: {
        query: 'software engineer in Pakistan',
        page: '1',
        num_pages: '1'
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    };
    const response = await axios.request(options);
    res.json({ 
      success: true, 
      count: response.data.data?.length || 0,
      jobs: response.data.data?.slice(0, 2)
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

router.get("/test-hf", async (req, res) => {
  try {
    const response = await queryHuggingFace({
      model: "moonshotai/Kimi-K2.5:novita",
      messages: [{ role: "user", content: "Say hello in one word" }],
      parameters: { max_new_tokens: 10 }
    });
    res.json({ success: true, response: response.choices[0].message.content });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Main endpoints
router.post("/analyze", upload.single("resume"), (req, res) => {
  queueRequest(req, res, analyzeResumeController);
});

router.post("/fetch-opportunities", fetchJobsController);

module.exports = router;