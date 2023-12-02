const express = require('express');
const path = require('path');
const app = express();
const analyzeContract = require('./api/analyze.js');
const port = process.env.PORT || 3000;
const fs = require('fs');
const multer = require('multer');
const tesseract = require('tesseract.js');

app.use(express.json());
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public/index.html'));
});

app.get('/upload', (req, res) => {
  res.render('upload');
});

app.post('/result', upload.single('image'), async (req, res) => {
  try {
    const { data: { text } } = await tesseract.recognize(req.file.path, 'eng');
    const summary = await analyzeContract(text);
    res.redirect(`/displayResult?summary=${encodeURIComponent(summary)}`);
  } catch (error) {
    console.error('Error in analyzing contract:', error);
    res.status(500).json({ error: 'Error in analyzing contract' });
  }
});

app.get('/displayResult', (req, res) => {
  // Retrieve summary data from query parameters
  const summary = req.query.summary;

  // Render app.html and pass the summary data
  res.render('app', { summary });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
