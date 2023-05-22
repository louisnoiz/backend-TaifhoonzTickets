const express = require("express")
const cors = require('cors')
const app = express();

require('dotenv').config();
app.use(cors())
app.use(express.static('static'))
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))


const indexRouter = require('./routes/index')
const concertRouter = require('./routes/concert')
const authRouter = require('./routes/auth');

app.use(indexRouter.router)
app.use(concertRouter.router)
app.use(authRouter.router);
app.listen(3000, () => {
    console.log(`Backend App running at: http://localhost:3000/`)
  })
