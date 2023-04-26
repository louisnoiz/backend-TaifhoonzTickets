const express = require("express");
const pool = require("../config");
const path = require("path");
const multer = require("multer");
const { isLoggedIn } = require('../middlewares')
router = express.Router();
const isAdmin = async (req, res, next) => {
    
    if ("admin" !== req.user.role) {
        return res.status(403).send('You do not have permission to perform this action')
    }
    
      next()
}


const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "./static/uploads");
    },
    filename: function (req, file, callback) {
      callback(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

const upload = multer({ storage: storage })

router.post("/movies/add/",isLoggedIn,isAdmin, upload.single('myImage'), async function (req, res, next) {
    const file = req.file;
    if (!file) {
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);
    }
    const movie = req.body.movie
    const plot = req.body.plot
    const director = req.body.director
    const actors = req.body.actors
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try{

        const [addmovie, fields] = await pool.query('INSERT INTO movies(m_name, release_date, director, actors, img_movie, plot) VALUES(?, CURRENT_TIMESTAMP, ?, ?, ?, ?)'
        ,[movie, director, actors, file.path.substr(6), plot])
        res.json()
    } catch (err) {
        await conn.rollback();
        return res.status(500).json(err);
    } finally {
        console.log("finally");
        conn.release();
      }
})
router.post("/movies/edit/:id", upload.single('myImage'), async function (req, res, next) {
    const file = req.file;

    const movie = req.body.movie
    const plot = req.body.plot
    const director = req.body.director
    const actors = req.body.actors
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try{
        console.log(!file)
        if (!file) {
            console.log("ติด")
            const [editmovie1, fields1] = await pool.query('UPDATE movies SET m_name = ?, director = ?, actors = ?, plot = ? WHERE m_id = ?'
            ,[movie, director, actors, plot, req.params.id])
            console.log("ติด2")
        }else{
            const [editmovie2, fields2] = await pool.query('UPDATE movies SET m_name = ?, director = ?, actors = ?, img_movie = ?, plot = ? WHERE m_id = ?'
            ,[movie, director, actors, file.path.substr(6), plot, req.params.id])
        }
        res.json()
    } catch (err) {
        await conn.rollback();
        return res.status(500).json(err);
    } finally {
        console.log("finally");
        conn.release();
      }
})

router.delete("/show/delete/:id",isLoggedIn, isAdmin, async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try{
        const [rows2, fields2] = await pool.query(
            'Select * FROM tickets WHERE Show_show_id =?', 
            [req.params.id]);
        const orderid = rows2[0]
        if (orderid){
            const [rows, fields] = await pool.query(
                'DELETE FROM tickets WHERE Show_show_id =?', 
                [req.params.id]);
            const [rows3, fields3] = await pool.query(
                'DELETE FROM order_item WHERE ORDER_order_id =?', 
                [orderid.ORDER_ITEM_ORDER_order_id]);
            const [rows4, fields4] = await pool.query(
                'DELETE FROM project_database.order WHERE order_id =?', 
                [orderid.ORDER_ITEM_ORDER_order_id]);
        }
        const [rows1, fields1] = await pool.query(
             'DELETE FROM project_database.show WHERE show_id =?', 
             [req.params.id]);

        await conn.commit();
        res.json("success")
    } catch (err) {
        await conn.rollback();
        return res.status(500).json(err);
    } finally {
        console.log("finally");
        conn.release();
      }
})

router.get("/addShow/:id",isLoggedIn,isAdmin, async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try{
        cond = req.params.id
        const [m_name, field] = await pool.query(
            'Select * from movies where m_id = ?',
            [cond])
        const [movie, field1] = await pool.query('select * from movies')
        const [theatre, field2] = await pool.query('select * from theatre')
        await conn.commit();
        res.json({
            m_name: m_name,
            movie: movie,
            theatre: theatre})
    } catch (err) {
        await conn.rollback();
        return res.status(500).json(err);
    } finally {
        console.log("finally");
        conn.release();
      }
}),
router.get("/edit/show/:id",isLoggedIn,isAdmin, async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try{
        cond = req.params.id
        console.log(cond)
        const [show, field] = await pool.query(
            'Select * from project_database.show join movies on (m_id = THEATRE_MOVIE_MOVIES_m_id) \
            join theatre on (tid = THEATRE_MOVIE_THEATRE_tid) where show_id = ? ',
            [cond])
        await conn.commit();
        res.json({show : show})
    } catch (err) {
        await conn.rollback();
        return res.status(500).json(err);
    } finally {
        console.log("finally");
        conn.release();
      }
})
router.post("/edit/show/:id",isLoggedIn,isAdmin, upload.single('myImage'), async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try{
        show_date = req.body.show_date
        language = req.body.language
        st_time = req.body.st_time
        end_time = req.body.end_time
        const [editshow, fields1] = await pool.query('UPDATE project_database.show SET show_date = ?, st_time = ?, end_time = ?, language = ? WHERE show_id = ?'
        ,[show_date, st_time, end_time, language, req.params.id])
        console.log("ติด2")
        res.json()
    } catch (err) {
        await conn.rollback();
        return res.status(500).json(err);
    } finally {
        console.log("finally");
        conn.release();
      }
})

router.post("/addShow/add/",isLoggedIn,isAdmin, upload.single('myImage'), async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try{
        m_name = req.body.m_name
        tname = req.body.tname
        show_date = req.body.show_date
        language = req.body.language
        st_time = req.body.st_time
        end_time = req.body.end_time
        console.log(show_date)
        const [m_id, field] = await pool.query(
            'Select m_id From movies Where m_name = ?',
            [m_name]);
        const [tid, field1] = await pool.query(
            'Select tid From theatre Where tname = ?',
            [tname]);
        const [check, field4] = await pool.query(
                'SELECT * from theatre_movie where MOVIES_m_id = ? and THEATRE_tid = ?',
                [m_id[0].m_id, tid[0].tid]);
        if (check.length == 0){
            const [theatre_movie, field2] = await pool.query(
                'INSERT INTO theatre_movie(MOVIES_m_id, THEATRE_tid) VALUES(?, ?)',
                [m_id[0].m_id, tid[0].tid]);
        }
        const [m, field3] = await pool.query(
            'INSERT INTO project_database.show(show_date, st_time, end_time, language, THEATRE_MOVIE_MOVIES_m_id, \
                THEATRE_MOVIE_THEATRE_tid) VALUES(?, ?, ?, ?, ?, ?)',
            [show_date, st_time, end_time, language, m_id[0].m_id, tid[0].tid]);
        await conn.commit();
        res.json(m_id[0].m_id)
    } catch (err) {
        await conn.rollback();
        return res.status(500).json(err);
    } finally {
        console.log("finally");
        conn.release();
      }
})


router.delete("/movies/delete/:id",isLoggedIn,isAdmin, async function (req, res, next) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try{

        const [addshow, fields] = await pool.query('DELETE FROM movies WHERE m_id=?',[req.params.id])
        res.json()
    } catch (err) {
        await conn.rollback();
        return res.status(500).json(err);
    } finally {
        console.log("finally");
        conn.release();
      }
})


exports.router = router;