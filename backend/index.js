// backend/index.js
const express        = require('express');
const mongoose       = require('mongoose');
const cors           = require('cors');
const path           = require('path');
const { appendToExcel } = require('./excel');
const Employee       = require('./employee');

const app  = express();
const PORT = 5000;

/* ---------- middleware ---------- */
app.use(cors());
app.use(express.json());

/* ---------- MongoDB ---------- */
mongoose.connect('mongodb://127.0.0.1:27017/employeeData', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () =>
  console.log('✅ MongoDB connected'));
mongoose.connection.on('error', err =>
  console.error('❌ MongoDB error:', err));

/* ---------- API routes ---------- */
// POST /submit  → save to Mongo & Excel
app.post('/submit', async (req, res) => {
  const { name, work, date } = req.body;
  console.log('📥 Received:', name, work, date);

  try {
    await new Employee({ name, work, date }).save();
    await appendToExcel({ name, work, date });
    res.json({ message: 'Data saved successfully!' });
  } catch (err) {
    console.error('❌ Save failed:', err);
    res.status(500).json({ message: 'Error saving data' });
  }
});

// GET /download  → download Excel file
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
  console.log(`🚀 Server running at http://localhost:${PORT}`));
