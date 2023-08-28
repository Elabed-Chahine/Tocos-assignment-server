const mongoose = require('mongoose');

//MongoDB connection 
const connectDB = async () => {
    const db = await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`MongoDB connected: ${db.connection.host}`.cyan.underline.bold);
}

module.exports = connectDB