const express = require("express")
const pool = require("../config")
// const { isLoggedIn } = require('../middlewares')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router = express.Router();

router.post('/createConcert', async (req, res) => {
    await prisma.concert.create({
        data: {
            name: req.body.name,
            artist: req.body.artist,
            location: req.body.location,
            details: req.body.details,
            date: new Date(req.body.date),
        }
    }).then((data) => {
        res.status(200).send(data);
    }).catch((err) => {
        console.log(err);
        res.status(500).send('Error retrieving user data');
    });

});

router.get('/getAllConcert', async (req, res) => {
    await prisma.concert.findMany()
        .then((data) => {
            res.status(200).send(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).send('Error retrieving user data');
        });
});

router.get('/getConcertById/:id', async (req, res) => {
    await prisma.concert.findUnique({
        where: {
            id: req.params.id
        }
    }).then((data) => {
        res.status(200).send(data);
    }).catch((err) => {
        console.log(err);
        res.status(500).send('Error retrieving user data');
    });
});

router.post('/createRound', async (req, res) => {
    await prisma.round.create({
        data: {
            concert_id: req.body.concert_id,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            date: req.body.date
        }
    }).then((data) => {
        res.status(200).send(data);
    }).catch((err) => {
        console.log(err);
        res.status(500).send('Error retrieving user data');
    });
});

router.get('/getAllRound', async (req, res) => {
    await prisma.round.findMany()
        .then((data) => {
            res.status(200).send(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).send('Error retrieving user data');
        });
});

router.post('/createZone', async (req, res) => {
    await prisma.zone.create({
        data: {
            name: req.body.name,
            concert_id: req.body.concert_id,
            totalSeat: req.body.totalSeat
        }
    }).then((data) => {
        res.status(200).send(data);
    }).catch((err) => {
        console.log(err);
        res.status(500).send('Error retrieving user data');
    });
});

router.get('/getAllZone', async (req, res) => {
    await prisma.zone.findMany()
        .then((data) => {
            res.status(200).send(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).send('Error retrieving user data');
        });
});

router.post('/createTicket', async (req, res) => {
    await prisma.ticket.create({
        data: {
            concert_id: req.body.concert_id,
            round_id: req.body.round_id,
            zone_id: req.body.zone_id,
            userId: req.body.userId,
            paymentId: req.body.paymentId,
            price: req.body.price
        }
    }).then((data) => {
        res.status(200).send(data);
    }).catch((err) => {
        console.log(err);
        res.status(500).send('Error retrieving user data');
    });
});

router.get('/getAllTicket', async (req, res) => {
    await prisma.ticket.findMany()
        .then((data) => {
            res.status(200).send(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).send('Error retrieving user data');
        });
});

router.post('/createPayment', async (req, res) => {
    await prisma.payment.create()
    .then((data) => {
        res.status(200).send(data);
    }).catch((err) => {
        console.log(err);
        res.status(500).send('Error retrieving user data');
    });
});

router.get('/getAllPayment', async (req, res) => {
    await prisma.payment.findMany()
        .then((data) => {
            res.status(200).send(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).send('Error retrieving user data');
        });
});


exports.router = router;