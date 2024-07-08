require('dotenv').config();
const path = require('path')
const express = require('express');
const { connectToMongoDB } = require('./connect');

const {restrictToLoggedserOnly,checkAuth}  =require('./middleware/auth')

const URL = require('./models/url');
const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter')
const userRoute = require('./routes/user')
const cookieParser = require('cookie-parser') 

const app = express();
const PORT = process.env.PORT || 8001;

app.set('view engine', "ejs")
app.set('views',path.resolve("./views"))


// Middleware to parse JSON
app.use(express.json());

// middlewares it is basically used to parse the form data 

app.use(express.urlencoded({extended:false}))





app.get('/test', async (req,res) =>{
  const allUrls = await URL.find({});

  return res.render('home.ejs',{
urls: allUrls,
  });
})

// Correct route path with leading slash

app.use(cookieParser());

app.use('/url',restrictToLoggedserOnly,urlRoute);
app.use('/user', userRoute);
app.use("/",checkAuth,staticRoute)


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
