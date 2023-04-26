const express = require("express")
const cors = require('cors')
const app = express();
// const { logger } = require('./middlewares')
//setting 

// app.use(logger)
app.use(cors())
app.use(express.static('static'))
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))

const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')
const orderRouter = require('./routes/order')
const createRouter = require('./routes/create')
app.use(indexRouter.router)
app.use(userRouter.router)
app.use(orderRouter.router)
app.use(createRouter.router)
app.listen(3000, () => {
    console.log(`Backend App running at: http://localhost:3000/`)
  })
