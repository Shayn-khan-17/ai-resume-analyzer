// Queue system for rate limiting
const requestQueue = [];
let isProcessing = false;
const DELAY_BETWEEN_REQUESTS = 1000;

async function processQueue() {
  if (isProcessing || requestQueue.length === 0) return;
  
  isProcessing = true;
  const { req, res, handler } = requestQueue.shift();
  
  try {
    console.log(`🔄 Processing request. ${requestQueue.length} remaining.`);
    await handler(req, res);
  } catch (error) {
    console.error("❌ Queue error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  } finally {
    isProcessing = false;
    setTimeout(processQueue, DELAY_BETWEEN_REQUESTS);
  }
}

function queueRequest(req, res, handler) {
  requestQueue.push({ req, res, handler });
  console.log(`📥 Request queued. Queue length: ${requestQueue.length}`);
  processQueue();
}

module.exports = { queueRequest };