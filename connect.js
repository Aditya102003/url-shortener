const mongoose = require('mongoose');

const connectToMongoDB = async () => {
  try {
    console.log("hello")
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas!');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    process.exit(1); // Exit the process with a failure
  }
};

module.exports = { connectToMongoDB };
