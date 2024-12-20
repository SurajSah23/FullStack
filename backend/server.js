const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB setup
mongoose.connect('mongodb+srv://hanoted966:fUIzc8OxbRdR4XEA@cluster0.dq7jj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Schema for saving calculation history
const CalculationSchema = new mongoose.Schema({
  expression: String,
  result: Number,
  date: {
    type: Date,
    default: Date.now,
  },
});

const Calculation = mongoose.model('Calculation', CalculationSchema);

// Route to save the calculation history
app.post('/api/saveCalculation', async (req, res) => {
  const { expression, result } = req.body;
  try {
    const newCalculation = new Calculation({ expression, result });
    await newCalculation.save();
    res.status(200).json({ message: 'Calculation saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save calculation' });
  }
});

// Route to get the calculation history
app.get('/api/history', async (req, res) => {
  try {
    const history = await Calculation.find();
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
