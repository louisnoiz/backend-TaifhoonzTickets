const express = require("express");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()



router = express.Router();


router.get('/', async (req, res) => {
  const test = await prisma.concert.findMany()
  res.send("Hello EC2 ", test)
});


router.get('/home' , (req, res) => {
  // console.log(res)
  res.send('you are logged in, this is your profile - ')
})


exports.router = router;