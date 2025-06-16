import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import cors from 'cors';
import pdfParse from 'pdf-parse';
import { fileURLToPath } from 'url';
import extractSkills from './skillExtractor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
await fs.mkdir(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

app.post('/analyze-multiple', upload.array('resumes', 10), async (req, res) => {
  try {
    const results = [];

    for (const file of req.files) {
      const buffer = await fs.readFile(file.path);
      const { text } = await pdfParse(buffer);

      const matched = extractSkills(text);

      matched.forEach(role => {
        results.push({
          filename: file.originalname,
          role: role.role,
          matchedSkills: role.matchedSkills,
          verified: false
        });
      });
    }

    res.json({ success: true, results });
  } catch (err) {
    console.error('❌ Analyze Error:', err);
    res.status(500).json({ success: false, message: 'Error analyzing resumes' });
  }
});

app.get('/', (req, res) => {
  res.send('✅ Resume Analyzer Backend is running...');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});