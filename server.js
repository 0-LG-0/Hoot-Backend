const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('morgan');
const testController = require("./controllers/test-jwt")
const authController = require('./controllers/auth')
const userController = require('./controllers/user')
const verifyJwt = require('./middlewares/verify-token.js')
const hootsRouter = require('./controllers/hoot.js')

require('./db/connection')

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Routes
app.use('/auth', authController)

app.use(verifyJwt)  // Authorization check
app.use('/users', userController)
app.use('/hoots', hootsRouter)

app.listen(3000, () => {
  console.log('The express app is ready!');
});