const express = require("express");
const pool = require("../config");
const jwt = require('jsonwebtoken');



router = express.Router();


router.get('/', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // ดึง token จาก header
  try {
    const decoded = jwt.verify(token, 'taifhoonz'); // ยืนยัน token และดึงข้อมูล user ออกมา
    const user = decoded.user;
    res.status(200).send(`Welcome ${user.firstname} ${user.lastname}`);
  } catch (err) {
    console.log(err);
    res.status(401).send('Invalid token');
  }
});

// router.get('/login', passport.authenticate('google', {
//   successRedirect: '/home',
//   failureRedirect: '/login',
//   failureFlash: true
// }));



router.get('/home' , (req, res) => {
  // console.log(res)
  res.send('you are logged in, this is your profile - ')
})

// router.get('/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/google/callback',
//   passport.authenticate('google', {
//     failureRedirect: '/login',
//   }),
//   async function (req, res, next) {
//     try {
//       const { email, given_name, family_name } = req.user._json;
//       const conn = await pool.getConnection();
//       await conn.beginTransaction();
//       const [rows, fields] = await conn.execute(
//         'SELECT id FROM user WHERE email = ?',
//         [email]
//       );
//       if (rows.length > 0) {
//         console.log('(Routes/index.js) User already exists in database:', email);
//         await conn.rollback();
//         conn.release();
//         return next(); // เรียกใช้ middleware isLoggedIn
//       } else {
//         const [insertResult, insertFields] = await conn.execute(
//           'INSERT INTO user (email, firstname, lastname, role) VALUES (?, ?, ?, ?)',
//           [email, given_name, family_name, 'user']
//         );
//         console.log('(Routes/index.js) User has been saved to database:', insertResult);
//         req.session.firstLogin = true;
//         await conn.commit();
//         conn.release();
//          // สร้าง flag เพื่อบอกว่าเป็นการลงทะเบียนครั้งแรก
//         return next(); // เรียกใช้ middleware isLoggedIn
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Internal Server Error');
//     }
//   },
//   isLoggedIn, // เรียกใช้ middleware isLoggedIn เมื่อเป็นการลงทะเบียนครั้งที่สองขึ้นไป
//   async function (req, res) {
    
//     if (req.session.firstLogin == true) {
//       // แสดงข้อความหลังจากบันทึกข้อมูลครั้งแรกเสร็จแล้ว
//       res.send('Welcome! Your data has been saved to the database.');
//       console.log(req.session.firstLogin);
//     } else {
//       req.session.firstLogin = false;
//       req.session.authenticate = true// กำหนดค่า firstLogin เป็น false และบันทึกลงใน session
//       // แสดงหน้า home
//       res.redirect('/home');
//       console.log(req.session.authenticate);
//     }
//   }
// );

exports.router = router;