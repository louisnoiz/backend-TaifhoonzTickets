const express = require("express")
// const pool = require("../config")
// const Joi = require('joi')
// const bcrypt = require('bcrypt');
// const { generateToken } = require("../utils/token");
// const { isLoggedIn } = require('../middlewares')

router = express.Router();

// const passwordValidator = (value, helpers) => {
//     if (value.length < 8) {
//         throw new Joi.ValidationError('Password must contain at least 8 characters')
//     }
//     if (!(value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/))) {
//         throw new Joi.ValidationError('Password must be harder')
//     }
//     return value
// }

// const usernameValidator = async (value, helpers) => {
//     const [rows, _] = await pool.query("SELECT email_id FROM customer WHERE email_id = ?", [value])
//     if (rows.length > 0) {
//         const message = 'This email is already taken'
//         throw new Joi.ValidationError(message, { message })
//     }
//     return value
// }
// const signupSchema = Joi.object({
//     email: Joi.string().required().email().external(usernameValidator),
//     mobile: Joi.string().required().pattern(/0[0-9]{9}/),
//     c_name: Joi.string().required().max(150),
//     password: Joi.string().required().custom(passwordValidator),
//     confirm_password: Joi.string().required().valid(Joi.ref('password')),
// })

// router.post('/user/signup', async (req, res, next) => {
//     try {
//         await signupSchema.validateAsync(req.body, { abortEarly: false })
//     } catch (err) {
//         return res.status(400).send(err)
//     }

//     const conn = await pool.getConnection()
//     await conn.beginTransaction()

//     const password = req.body.password
//     const c_name = req.body.c_name
//     const email = req.body.email
//     const mobile = req.body.mobile

//     try {
//         await conn.query(
//             'INSERT INTO customer(password, c_name, email_id, phone_no) VALUES (?, ?, ?, ?)',
//             [password, c_name, email, mobile]
//         )
//         conn.commit()
//         res.status(201).send()
//     } catch (err) {
//         conn.rollback()
//         res.status(400).json(err.toString());
//     } finally {
//         conn.release()
//     }
// })

// const loginSchema = Joi.object({
//     username: Joi.string().required(),
//     password: Joi.string().required(),
//     role: Joi.string().required(),
// })

// router.post('/user/login', async (req, res, next) => {
//     try {
//         await loginSchema.validateAsync(req.body, { abortEarly: false })
//     } catch (err) {
//         return res.status(400).send(err)
//     }
//     const username = req.body.username
//     const password = req.body.password
//     const role = req.body.role
//     console.log(role)

//     const conn = await pool.getConnection()
//     await conn.beginTransaction()

//     try {
//         // Check if username is correct
//         if (role == 'customer'){
//             const [customer] = await conn.query(
//                 'SELECT * FROM customer WHERE email_id=?', 
//                 [username]
//             )
//             const user = customer[0]
//             if (!user) {    
//                 throw new Error('Incorrect email or password')
//             }
//             // Check if password is correct
//             if (!(password == user.password)) {
//                 throw new Error('Incorrect email or password')
//             }
//             const [tokens1] = await conn.query(
//                 'SELECT * FROM customer_tokens WHERE user_id=?', 
//                 [user.cid]
//             )
//             let token = tokens1[0]?.token
//             if (!token) {
//                 // Generate and save token into database
//                 token = generateToken()
//                 await conn.query(
//                     'INSERT INTO customer_tokens(user_id, token) VALUES (?, ?)', 
//                     [user.cid, token]
//                 )
//             }
//             conn.commit()
//             res.status(200).json({'token': token})


//         }else if (role == 'admin'){
//             const [admin] = await conn.query(
//                 'SELECT * FROM admin WHERE admin_email=?', 
//                 [username]
//             )
//             const user = admin[0]
//             if (!user) {    
//                 throw new Error('Incorrect email or password')
//             }
//             // Check if password is correct
//             if (!(password == user.password)) {
//                 throw new Error('Incorrect email or password')
//             }
//             const [tokens2] = await conn.query(
//                 'SELECT * FROM admin_tokens WHERE user_id=?', 
//                 [user.admin_id]
//             )
//             let token = tokens2[0]?.token
//             if (!token) {
//                 // Generate and save token into database
//                 token = generateToken()
//                 await conn.query(
//                     'INSERT INTO admin_tokens(user_id, token) VALUES (?, ?)', 
//                     [user.admin_id, token]
//                 )
//             }
//             conn.commit()
//             res.status(200).json({'token': token})
//         }
        
//     } catch (error) {
//         conn.rollback()
//         res.status(400).json(error.toString())
//     } finally {
//         conn.release()
//     }
// })

// router.get('/user/me', isLoggedIn, async (req, res, next) => {
//     // req.user ถูก save ข้อมูล user จาก database ใน middleware function "isLoggedIn"
//     res.json(req.user)
// })
// router.put('/user/change/:id', async (req, res, next) => {
//     const id = req.params.id
//     const conn = await pool.getConnection()
//     await conn.beginTransaction()

//     try {
//         const [old] = await conn.query(
//             'select password from customer where cid=?', [id]
//         )
//         const oldpassword = old[0].password
//         if (oldpassword == req.body.oldpassword){
//             const [newpassword] = await conn.query(
//                 'UPDATE customer SET password=? WHERE cid=?', [req.body.newpassword, id]
//             )
//             conn.commit()
//             res.status(200).json("เปลี่ยนรหัสเรียบร้อยแล้ว")
//         }else{
//             res.json("รหัสผ่านไม่ถูกต้อง")
//         }
//     } catch (error) {
//         conn.rollback()
//         res.status(400).json(error.toString())
//     } finally {
//         conn.release()
//     }
// })

// router.delete('/user/logout/:id', async (req, res, next) => {
//     const id = req.params.id
//     const role = req.body.role
//     console.log(req.body)
//     console.log(req.body.role)
//     console.log(req.body.admin)
//     const conn = await pool.getConnection()
//     await conn.beginTransaction()

//     try {
//         if (role == 'customer'){
//             const [tokens] = await conn.query(
//                 'delete from customer_tokens WHERE user_id=?', [id]
//             )
//             conn.commit()
//             res.status(200).json(tokens)
//         }else if (role == 'admin'){
//             const [tokens] = await conn.query(
//                 'delete from admin_tokens WHERE user_id=?', [id]
//             )
//             conn.commit()
//             res.status(200).json(tokens)
//         }

//     } catch (error) {
//         conn.rollback()
//         res.status(400).json(error.toString())
//     } finally {
//         conn.release()
//     }
// })
exports.router = router;