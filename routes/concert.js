const express = require("express")
const pool = require("../config")
// const { isLoggedIn } = require('../middlewares')

router = express.Router();

router.get('/allConcert', async (req, res) => {
    try {
        const [rows, fields] = await pool.query('SELECT * FROM Concert');
        res.status(200).send(rows);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error retrieving user data');
    }
});

router.get('/concertById/:id', async (req, res) => {
    try {
        console.log("back",req.params.id);
        const [rows, fields] = await pool.query('SELECT * FROM Concert WHERE id = ?', [req.params.id]);
        res.status(200).send(rows);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error retrieving user data');
    }
});

exports.router = router;