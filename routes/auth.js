const express = require('express');
router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()



router.post('/signup', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        fullName: req.body.fullName,
        phone: req.body.phone,
        password: hashedPassword,
        role: 'USER'
      }
    })
    res.status(200).send('User created successfully');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error creating user');
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const checkUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: username,
          },
          {
            email: username,
          },
        ],
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        password: true,
        phone: true,
      }
    })
    if (!checkUser) {
      res.status(401).send('Username or Email Not Found');
      return;
    }
    const match = await bcrypt.compare(password, checkUser.password);
    console.log(match)
    if (!match) {
      res.status(401).send('Password is not Correct');
      return;
    }
    const user = checkUser;
    const payload = { 
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      phone: user.phone,
    };
    const token = jwt.sign({ payload }, 'taifhoonz');
    res.status(200).json({ token: token });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error logging in');
  }
});

router.get('/userbyid/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id
      }
    })
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error retrieving user data');
  }
});

router.get('/userbyusername/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username
      }
    })
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error retrieving user data');
  }
});

router.put('/user/:id', async (req, res) => {
  const { id } = req.params;
  const { username, fullName, email, phone, role } = req.body;
  try {
      const user = await prisma.user.update({
          where: {
              id: id
          },
          data: {
              username: username,
              fullName: fullName,
              email: email,
              phone: phone,
              role: role
          }
      })
      res.status(200).send(user);
  } catch (error) {
      console.log(error);
      res.status(500).send('Error updating user data');
  }
});

exports.router = router;