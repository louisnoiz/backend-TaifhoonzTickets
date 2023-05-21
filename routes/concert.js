const express = require("express")
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const multer = require("multer");
const path = require("path");

router = express.Router();

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

router.post('/createConcert', upload.single('image'), async (req, res) => {
    const file = req.file;
    await prisma.notification.create({
        data: {
            description: req.body.name + '\'s Concert is coming!',
        }
    });
    try {
        const concert = await prisma.concert.create({
            data: {
                name: req.body.name,
                artist: req.body.artist,
                location: req.body.location,
                details: req.body.details,
                date: new Date(req.body.date),
                image: file.path.substr(6),
            }
        });
        res.status(200).send(concert);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error creating concert');
    }
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

router.get('/getAllNotification', async (req, res) => {
    await prisma.notification.findMany()
        .then((data) => {
            res.status(200).send(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).send('Error retrieving user data');
        });
});

exports.router = router;