const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse"); 
const cors = require("cors");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"), false);
  },
});

app.get("/", (req, res) => {
  res.send("AI Resume Analyzer Backend is running!");
});

app.post("/upload", upload.single("resume"), async (req, res) => {
  if (!req.file)
    return res.status(400).json({ error: "No file uploaded or wrong file type" });

  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer); // ✅ works in v1
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "PDF has no readable text (maybe image-based)" });
    }

    res.json({ text: resumeText });
  } catch (err) {
    console.error("PDF parse error:", err);
    res.status(500).json({ error: "Failed to parse PDF", details: err.message });
  } finally {
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Failed to delete uploaded file:", err);
    });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
