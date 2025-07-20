// backend/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const { appendToExcel } = require('./excel'); // Your Excel write logic

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------- middleware ---------- */
app.use(cors());
app.use(express.json());

/* ---------- API routes ---------- */

// POST /submit → save to Excel only
app.post('/submit', async (req, res) => {
  const { name, work, date } = req.body;
  console.log('📥 Received:', name, work, date);

  try {
    await appendToExcel({ name, work, date });
    res.json({ message: 'Data saved to Excel successfully!' });
  } catch (err) {
    console.error('❌ Excel write failed:', err);
    res.status(500).json({ message: 'Error saving to Excel' });
  }
});

// GET /download → download Excel file
app.get('/download', (req, res) => {
  const filePath = path.join(__dirname, 'data.xlsx');
  res.download(filePath, 'EmployeeData.xlsx', err => {
    if (err) {
      console.error('❌ Download error:', err);
      res.status(500).send('Error downloading file.');
    }
  });
});

/* ---------- start server ---------- */
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
