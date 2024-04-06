const config = require('./Config/AppConfig')
const express = require('express')
const mongoose = require('mongoose')
const app = express();
const cookieParser = require('cookie-parser');
const router = require('./Router/router')
const auth = require('./Router/AuthenticationRoute')
const agent =  require('./Router/AgentRoute')
const employee =  require('./Router/EmployeeRoute')

const cors = require('cors');
const corsOptions = {
    origin: 'https://devevalsystem1-0-1.onrender.com' 
  };
app.use(cors(corsOptions));


//app.use(cookieParser());

//middleware 
app.use(express.json())


//route
app.use('/auth', auth)
app.use('/', agent)
app.use('/', employee)
app.use('/', router)

//port
const port = 4000;

//connection to bd 
const connectDB = (url) => {
    return mongoose.connect(url)
}


const start = async () => {
    try {
        await connectDB(config.mongo_uri)
        console.log("connected to db ");
        app.listen(port, console.log(`server is listening on port ${port}`));
    } catch (error) {
        console.log(error);
    }
}
start(); 
