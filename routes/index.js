const express = require("express");
// const pool = require("../config");
// const { router } = require("./user");
// const { isLoggedIn } = require('../middlewares')
router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello Taifhoon')
  })



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

// router.get("/",isLoggedIn, async function (req, res, next) {
//     const conn = await pool.getConnection();
//     await conn.beginTransaction();
//     try{
//         const search = req.query.search || ''
//         const order = req.query.order || ''
//         const theatre = req.query.theatre || ''
//         cond = []
//         sql = 'SELECT * from project_database.show join movies on project_database.show.THEATRE_MOVIE_MOVIES_m_id = movies.m_id join theatre on project_database.show.THEATRE_MOVIE_THEATRE_tid = theatre.tid order by '+order
//         if (theatre != 'none'){
//             sql = 'SELECT * from project_database.show join movies on project_database.show.THEATRE_MOVIE_MOVIES_m_id = movies.m_id join theatre on project_database.show.THEATRE_MOVIE_THEATRE_tid = theatre.tid WHERE tname = ? order by '+order
//             cond = [`${theatre}`]
//         }
//         if (search.length > 0){
//             sql = 'SELECT * from project_database.show join movies on project_database.show.THEATRE_MOVIE_MOVIES_m_id = movies.m_id join theatre on project_database.show.THEATRE_MOVIE_THEATRE_tid = theatre.tid WHERE m_name like ? order by '+order
//             cond = [`%${search}%`]
//             if (theatre != 'none'){
//                 sql = 'SELECT * from project_database.show join movies on project_database.show.THEATRE_MOVIE_MOVIES_m_id = movies.m_id join theatre on project_database.show.THEATRE_MOVIE_THEATRE_tid = theatre.tid WHERE m_name like ? and tname like ? order by '+order
//                 cond = [`%${search}%`, `%${theatre}%`]
//             }
//         }
//         const [movie, field] = await pool.query(sql, cond)
//         await conn.commit();
//         res.json(movie)
//     } catch (err) {
//         await conn.rollback();
//         return res.status(500).json(err);
//     } finally {
//         console.log("finally");
//         conn.release();
//       }
// })

// router.get("/movie/:id",isLoggedIn, async function (req, res, next) {
//     const conn = await pool.getConnection();
//     await conn.beginTransaction();
//     try{
//         cond = req.params.id
//         const [seat, field1] = await pool.query('SELECT * FROM seat JOIN seat_type  on (SEAT_TYPE_type_id = type_id) where THEATRE_tid = \
//         (select tid FROM theatre join project_database.show on THEATRE_MOVIE_THEATRE_tid = tid where show_id = ?) order by no_of_seats', [cond])
//         const [seatBook, field2] = await pool.query('select no_of_seats from seat join tickets on (seat_id = SEAT_seat_id) join project_database.order on (ORDER_ITEM_ORDER_order_id = order_id) where SHOW_show_id = ?   order by no_of_seats', [cond])
//         const [movie, field3] = await pool.query('select * from project_database.show join movies on (THEATRE_MOVIE_MOVIES_m_id = m_id) join theatre on (tid = THEATRE_MOVIE_THEATRE_tid) where show_id = ?', [cond])
//         await conn.commit();
//         res.json({seat: seat,
//                 seatBook: seatBook,
//                 movie: movie})
//     } catch (err) {
//         await conn.rollback();
//         return res.status(500).json(err);
//     } finally {
//         console.log("finally");
//         conn.release();
//       }
// })
// router.put("/movie/confirm/:cid",isLoggedIn, isCusto, async function (req, res, next) {
//     const conn = await pool.getConnection();
//     await conn.beginTransaction();
//     try{
//         var seatOrder = ""
//         var itemId = []
//         const selectSeat = req.body.selectSeat
//         const seatId = req.body.seatId
//         const price = req.body.price
//         const type = req.body.type
//         const movie = req.body.movie
//         for (var i=0;i<selectSeat.length;i++){
//             seatOrder += selectSeat[i]+", "
//         }
//         const [order, field1] = await pool.query('INSERT INTO project_database.order(order_date, order_seats, total_price, CUSTOMER_cid, payment) VALUES(CURRENT_TIMESTAMP, ?, ?, ?, ?)', 
//         [seatOrder, parseInt(price), req.params.cid, "wait"])
//         console.log(order.insertId)
//         for (var i=0; i< type.length; i++){
//             const [orderItem, field2] = await pool.query('INSERT INTO order_item(item_price, ORDER_order_id) VALUES(?, ?)', 
//             [type[i], order.insertId])
//             itemId.push(orderItem.insertId)
//             const [ticket, field3] = await pool.query('INSERT INTO tickets(price, SHOW_show_id, ORDER_ITEM_item_no, ORDER_ITEM_ORDER_order_id, ADMIN_admin_id, SEAT_seat_id) VALUES(?, ?, ?, ?, ?, ?)',
//             [type[i], movie.show_id, orderItem.insertId, order.insertId, 1, seatId[i]])
//         }

//         await conn.commit();
//         res.json({orderId: order.insertId, itemId: itemId})
//     } catch (err) {
//         await conn.rollback();
//         return res.status(500).json(err);
//     } finally {
//         console.log("finally");
//         conn.release();
//       }
// })
// router.delete("/movie/cancel/:id",isLoggedIn, isCusto, async function (req, res, next) {
//     const conn = await pool.getConnection();
//     await conn.beginTransaction();
//     try{
//         const [rows3, fields3] = await pool.query(
//             'DELETE FROM tickets WHERE ORDER_ITEM_ORDER_order_id=?', [req.params.id]
//         )
//         const [rows1, fields1] = await pool.query(
//              'DELETE FROM order_item WHERE ORDER_order_id=?', [req.params.id]
//         )
//         const [rows2, fields2] = await pool.query(
//             'DELETE FROM project_database.order WHERE order_id=?', [req.params.id]
//         )

//         await conn.commit();
//         res.json("success")
//     } catch (err) {
//         await conn.rollback();
//         return res.status(500).json(err);
//     } finally {
//         console.log("finally");
//         conn.release();
//       }
// })

// router.get("/booking/:orderId",isLoggedIn, isCusto, async function (req, res, next) {
//     const conn = await pool.getConnection();
//     await conn.beginTransaction();
//     const user = req.user.cid
//     try{
//         orderId = req.params.orderId
//         const [order, field] = await pool.query(
//             'SELECT * FROM project_database.order where order_id = ? AND CUSTOMER_cid = ?',
//             [orderId, user]);
//         const [customer, field1] = await pool.query(
//             'SELECT * FROM project_database.order JOIN customer on (CUSTOMER_cid = cid) where order_id = ? AND CUSTOMER_cid = ?',
//             [orderId, user]);
//         const [show, field2] = await pool.query(
//             'SELECT * FROM project_database.show WHERE show_id = \
//             (SELECT SHOW_show_id FROM tickets JOIN project_database.order on (ORDER_ITEM_ORDER_order_id = order_id) WHERE order_id = ? AND CUSTOMER_cid = ? GROUP BY SHOW_show_id)',
//             [orderId, user]);
//         const [movies, field3] = await pool.query(
//             'SELECT * FROM movies WHERE m_id = \
//             (SELECT THEATRE_MOVIE_MOVIES_m_id FROM project_database.show JOIN tickets on (show_id = SHOW_show_id) JOIN project_database.order on (ORDER_ITEM_ORDER_order_id = order_id) WHERE order_id = ? AND CUSTOMER_cid = ? GROUP BY THEATRE_MOVIE_MOVIES_m_id)',
//             [orderId, user]);
//         const [theatre, field4] = await pool.query(
//             'SELECT * FROM theatre WHERE tid = \
//             (SELECT THEATRE_MOVIE_THEATRE_tid FROM project_database.show JOIN tickets on (show_id = SHOW_show_id) JOIN project_database.order on (ORDER_ITEM_ORDER_order_id = order_id) WHERE order_id = ? AND CUSTOMER_cid = ? GROUP BY THEATRE_MOVIE_THEATRE_tid)',
//             [orderId, user]);

//         await conn.commit();
//         res.json({order: order,
//                 customer: customer,
//                 show: show,
//                 movies: movies,
//                 theatre: theatre
//             })
//     } catch (err) {
//         await conn.rollback();
//         return res.status(500).json(err);
//     } finally {
//         console.log("finally");
//         conn.release();
//       }
// })

// router.put("/booking/:orderId",isLoggedIn, isCusto, async function (req, res, next) {
//     const conn = await pool.getConnection();
//     await conn.beginTransaction();
//     try{
//         console.log(req.params.orderId)
//         const [row, fields] = await pool.query(
//             'UPDATE project_database.order SET payment="paid" WHERE order_id=?', 
//             [req.params.orderId]);
//         const [order, field] = await pool.query(
//             'SELECT * FROM project_database.order where order_id = ?',
//             [req.params.orderId]);
//         await conn.commit();
//         res.json({order: order})
//     } catch (err) {
//         await conn.rollback();
//         return res.status(500).json(err);
//     } finally {
//         console.log("finally");
//         conn.release();
//       }
// })

// router.get("/movies/detail", async function (req, res, next) {
//     const conn = await pool.getConnection();
//     await conn.beginTransaction();
//     const search = req.query.search || ''
//     const order = req.query.sortdetail || ''
//     cond = []
//     sql = 'SELECT * from movies order by '+order
//     try{
//         if (search.length > 0){
//             sql = 'SELECT * from movies WHERE m_name like ? order by '+order
//             cond = [`%${search}%`]
//         }else{
            
//         }
//         const [moviedetail, fields] = await pool.query(sql, cond)
//         await conn.commit();
//         res.json({moviedetail: moviedetail})
//     } catch (err) {
//         await conn.rollback();
//         return res.status(500).json(err);
//     } finally {
//         console.log("finally");
//         conn.release();
//       }
// })
// router.get("/movies/detail/:id", async function (req, res, next) {
//     const conn = await pool.getConnection();
//     await conn.beginTransaction();
//     try{

//         const [moviedetail, fields] = await pool.query('SELECT * FROM movies where m_id = ?',[req.params.id])
//         const [show, fields2] = await pool.query('SELECT * FROM project_database.show join theatre on (tid = THEATRE_MOVIE_THEATRE_tid) where THEATRE_MOVIE_MOVIES_m_id = ?',[req.params.id])
//         await conn.commit();
//         res.json({moviedetail: moviedetail, show: show})
//     } catch (err) {
//         await conn.rollback();
//         return res.status(500).json(err);
//     } finally {
//         console.log("finally");
//         conn.release();
//       }
// })

// router.get("/customer", async function (req, res, next) {
//     const conn = await pool.getConnection();
//     const search = req.query.search || ''
//     await conn.beginTransaction();
//     try{
//         sql = 'SELECT *, COUNT(CUSTOMER_cid) as `order` FROM customer  left outer join project_database.order on (CUSTOMER_cid = cid) GROUP by cid order by cid'
//         cond = []
//         if (search.length > 0){
//             sql = 'SELECT *, COUNT(CUSTOMER_cid) as `order` FROM customer  left outer join project_database.order on (CUSTOMER_cid = cid) where c_name like ? or email_id like ? GROUP by cid order by cid'
//             cond = [`%${search}%`, `%${search}%`]
//         }
//         const [customer, fields1] = await pool.query(sql, cond)
//         await conn.commit();
//         res.json({customer: customer})
//     } catch (err) {
//         await conn.rollback();
//         return res.status(500).json(err);
//     } finally {
//         console.log("finally");
//         conn.release();
//       }
// })
// router.get("/customer/detail/:id", async function (req, res, next) {
//     const conn = await pool.getConnection();
//     await conn.beginTransaction();
//     try{
//         const [order, fields1] = await pool.query('SELECT * FROM project_database.order join tickets on (order_id = ORDER_ITEM_ORDER_order_id) \
//          join project_database.show on (SHOW_show_id = show_id) join movies on (m_id = THEATRE_MOVIE_MOVIES_m_id) join theatre on (THEATRE_MOVIE_THEATRE_tid = tid) where CUSTOMER_cid = ? GROUP BY order_id order by order_id', [req.params.id])
//          const [customer, fields2] = await pool.query('SELECT * FROM customer where cid = ?', [req.params.id])
//          await conn.commit();
//         console.log(order)
//         res.json({order: order, customer: customer})
//     } catch (err) {
//         await conn.rollback();
//         return res.status(500).json(err);
//     } finally {
//         console.log("finally");
//         conn.release();
//       }
// })


exports.router = router;