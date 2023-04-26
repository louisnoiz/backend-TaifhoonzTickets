const express = require("express")
const cors = require('cors')
const app = express();
const passport = require('passport');
require('./routes/auth');
const session = require("express-session");
const pool = require('./config');
// const { logger } = require('./middlewares')
//setting 

// app.use(logger)
app.use(cors())
app.use(express.static('static'))
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))
// app.use((req, res, next) => {
//   req.app.locals.pool = pool;
//   next();
// });



const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')
const orderRouter = require('./routes/order')
const createRouter = require('./routes/create');

app.use(session({
  secret: 'taifhoonztickets',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(indexRouter.router)
app.use(userRouter.router)
app.use(orderRouter.router)
app.use(createRouter.router)
app.listen(3000, () => {
    console.log(`Backend App running at: http://localhost:3000/`)
  })
