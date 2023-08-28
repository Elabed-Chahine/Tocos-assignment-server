const express = require('express')
const cors = require('cors')
//Setting dotenv to point at config.env file
require('dotenv').config({ path: "./config/config.env" });
const connectDB = require('./config/db')
const errorHandler = require('./middlewares/errorMiddleware');
//************************ROUTES IMPORTS****************************** */
const userRouter = require('./routes/userRoutes'); 
const transactionRouter = require("./routes/transactionRoutes")




//************************end ROUTES IMPORTS****************************** */
app = express();
require('colors')
//Mongo db connection
connectDB()




// Body parser
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

// Enable CORS // Different domain
app.use(
    cors({
        origin: "*",
        methods: "GET,PUT,POST,DELETE",
    })
);


app.listen(process.env.PORT, () => {
    console.log(`runnig server on port ${process.env.PORT}`.magenta);
})

app.use("/api/users", userRouter)
app.use("/api/transactions", transactionRouter)



app.use(errorHandler);


module.exports = {app}