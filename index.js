require('dotenv').config();
const express = require('express');
const { connectToMongoDB } = require('./connect');
const urlRoute = require('./routes/url');
const URL = require('./models/url');

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware to parse JSON
app.use(express.json());

// Correct route path with leading slash
app.use('/url', urlRoute);

app.get('/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  try {
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: { timestamp: Date.now() },
        },
      },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ message: 'URL not found' });
    }

    res.redirect(entry.redirectURL);
  } catch (error) {
    console.error('Error finding and updating URL:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server after establishing a connection to MongoDB
app.listen(PORT, async () => {
  await connectToMongoDB();
  console.log(`SERVER STARTED AT PORT ${PORT}`);
});
