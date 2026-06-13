const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');


dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
app.use(cors("*"));
app.use(express.json({ limit: '10mb' }));

app.use('/api/content', require('./routes/contentRoutes'));

app.get('/', (req, res) => {
  res.send('Learning Content Ingestion API is running');
});

const PORT = process.env.PORT || 5002;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(error => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
