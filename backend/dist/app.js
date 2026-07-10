const express = require('express');
const app = express();
const cors = require('cors');
const authRouter = require('./routes/authRoute')
const incomeRouter = require('./routes/incomeRoute')
const expenseRouter = require('./routes/expenseRoute')
const budgetRouter = require('./routes/budgetRoute')
const dashboardRouter = require('./routes/dashboardRoute')
const connectDB = require('./config/db');
require('dotenv').config();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}))

//?Routes Middlewares
app.use('/api/auth',authRouter);
app.use('/api/income', incomeRouter);
app.use('/api/expense', expenseRouter);
app.use('/api/budget', budgetRouter);
app.use('/api/dashboard', dashboardRouter);

app.get("/", (req,res) => {
    res.send("Service is up and running");
})

const startServer = async () => {
    await connectDB();

    const PORT = process.env.PORT || 3000; 

    app.listen(PORT, () => {
        console.log(`Server Started`);
    })
}

startServer();