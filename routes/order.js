const express = require("express")
// const pool = require("../config")
// const { isLoggedIn } = require('../middlewares')

router = express.Router();


// const isAdmin = async (req, res, next) => {
    
//     if ("admin" !== req.user.role) {
//         return res.status(403).send('You do not have permission to perform this action')
//     }
    
//       next()
// }
// const isCusto = async (req, res, next) => {
    
//     if ("customer" !== req.user.role) {
//         return res.status(403).send('You do not have permission to perform this action')
//     }
    
//       next()
// }


// router.get('/order/ticket/:id', isLoggedIn, isCusto, async (req, res, next) => {


//     const conn = await pool.getConnection()
//     await conn.beginTransaction()

//     try {
//         const [order, field] = await pool.query(
//             'SELECT * FROM project_database.order where CUSTOMER_cid = ? GROUP BY order_id',
//             [req.params.id]
//         )
//         conn.commit()
//         res.json({order: order})
//     } catch (err) {
//         conn.rollback()
//         res.status(400).json(err.toString());
//     } finally {
//         conn.release()
//     }
// })

// router.get('/profile/myorder/:id',isLoggedIn, isCusto, async (req, res, next) => {
//     const conn = await pool.getConnection()
//     await conn.beginTransaction()

//     try {
//         const [order, field1] = await pool.query(
//             'select * from project_database.order WHERE CUSTOMER_cid = ?',
//             [req.user.cid]
//         )
//         const [paid, field2] = await pool.query(
//             'SELECT * FROM project_database.order join tickets on order_id = ORDER_ITEM_ORDER_order_id join project_database.show \
//             on show_id = SHOW_show_id join movies on THEATRE_MOVIE_MOVIES_m_id = m_id where CUSTOMER_cid = ? and payment = "paid" group by order_id',

//             [req.user.cid]
//         )
//         const [wait, field3] = await pool.query(
//             'SELECT * FROM project_database.order join tickets on order_id = ORDER_ITEM_ORDER_order_id join project_database.show \
//             on show_id = SHOW_show_id join movies on THEATRE_MOVIE_MOVIES_m_id = m_id where CUSTOMER_cid = ? and payment = "wait" group by order_id',

//             [req.user.cid]
//         )
//         const [ticket, field4] = await pool.query(
//             'SELECT * FROM project_database.order join tickets on order_id = ORDER_ITEM_ORDER_order_id join project_database.show \
//             on show_id = SHOW_show_id join movies on THEATRE_MOVIE_MOVIES_m_id = m_id where CUSTOMER_cid = ? and payment = "paid"',

//             [req.user.cid]
//         )
//         conn.commit()
//         res.json({paid: paid, order: order, wait: wait, ticket: ticket})
//     } catch (err) {
//         conn.rollback()
//         res.status(400).json(err.toString());
//     } finally {
//         conn.release()
//     }
// })
// router.get('/profile/myorder/ticket/:id',isLoggedIn, isCusto, async (req, res, next) => {
//     const conn = await pool.getConnection()
//     await conn.beginTransaction()

//     try {
//         const [ticket, field4] = await pool.query(
//             'SELECT * FROM project_database.order join tickets on order_id = ORDER_ITEM_ORDER_order_id join seat on SEAT_seat_id = seat_id join project_database.show \
//             on show_id = SHOW_show_id join movies on THEATRE_MOVIE_MOVIES_m_id = m_id join theatre on tid = THEATRE_MOVIE_THEATRE_tid where CUSTOMER_cid = ? and order_id = ? and payment = "paid"',

//             [req.user.cid, req.params.id]
//         )
//         conn.commit()
//         res.json({ticket: ticket})
//     } catch (err) {
//         conn.rollback()
//         res.status(400).json(err.toString());
//     } finally {
//         conn.release()
//     }
// })

exports.router = router;