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

router.delete('/delConcertById/:id', async (req, res) => {
    try {
        await prisma.concert.delete({
            where: {
                id: req.params.id
            }
        })
        res.status(200).send('Delete concert success');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error retrieving user data');
    }
});

router.post('/createConcert', upload.single('image'), async (req, res) => {
    const file = req.file;
    function convertTimeToNumber(timeString) {
        var parts = timeString.split(":");
        var hours = parseInt(parts[0], 10);
        var minutes = parseInt(parts[1], 10);

        var currentDate = new Date(); // Assuming today's date
        currentDate.setHours(hours);
        currentDate.setMinutes(minutes);

        return currentDate;
    }
    try {
        const createdConcert = await prisma.concert.create({
            data: {
                name: req.body.name,
                artist: req.body.artist,
                location: req.body.location,
                details: req.body.details,
                dateStart: new Date(req.body.dateStart),
                dateEnd: new Date(req.body.dateEnd),
                image: file.path.substr(6),
            }
        })
        await prisma.notification.create({
            data: {
                description: `${req.body.name}'s Concert is coming!`,
                concertId: createdConcert.id,
            }
        });
        const roundsWithConcertId = JSON.parse(req.body.rounds).map(round => ({
            concertId: createdConcert.id,
            startTime: convertTimeToNumber(round.startTime),
            endTime: convertTimeToNumber(round.endTime),
            date: new Date(round.date),
        }))
        await prisma.round.createMany({
            data: roundsWithConcertId
        })
        await prisma.zone.createMany({
            data: [
                { concertId: createdConcert.id, name: 'Zone A (Green)', totalSeat: 100, price: 4800 },
                { concertId: createdConcert.id, name: 'Zone B (Blue)', totalSeat: 100, price: 4500 },
                { concertId: createdConcert.id, name: 'Zone C (Purple)', totalSeat: 100, price: 3500 },
                { concertId: createdConcert.id, name: 'Zone D (Orange)', totalSeat: 100, price: 2500 },
            ],
        })
        res.status(200).send("Create concert success");
    } catch (error) {
        console.log(error);
        res.status(500).send('Error creating concert');
    }
});

router.put('/updateConcert/:concertId', upload.single('image'), async (req, res) => {
    const concertId = req.params.concertId;
    const file = req.file;

    function convertTimeToNumber(timeString) {
        var parts = timeString.split(":");
        var hours = parseInt(parts[0], 10);
        var minutes = parseInt(parts[1], 10);

        var currentDate = new Date(); // Assuming today's date
        currentDate.setHours(hours);
        currentDate.setMinutes(minutes);

        return currentDate;
    }

    try {
        const existingConcert = await prisma.concert.findUnique({
            where: {
                id: concertId,
            },
            include: {
                Round: true,
            },
        });

        if (!existingConcert) {
            res.status(404).send("Concert not found");
            return;
        }

        const updatedConcertData = {
            name: req.body.name || existingConcert.name,
            artist: req.body.artist || existingConcert.artist,
            location: req.body.location || existingConcert.location,
            details: req.body.details || existingConcert.details,
            dateStart: req.body.dateStart ? new Date(req.body.dateStart) : existingConcert.dateStart,
            dateEnd: req.body.dateEnd ? new Date(req.body.dateEnd) : existingConcert.dateEnd,
            image: file ? file.path.substr(6) : undefined,
        };

        const updatedConcert = await prisma.concert.update({
            where: {
                id: concertId,
            },
            data: updatedConcertData,
        });

        if (req.body.rounds) {
            const roundsWithConcertId = JSON.parse(req.body.rounds).map(round => ({
                concertId: updatedConcert.id,
                startTime: convertTimeToNumber(round.startTime),
                endTime: convertTimeToNumber(round.endTime),
                date: new Date(round.date),
            }));
            const roundsToDelete = existingConcert.Round.filter(existingRound =>
                !roundsWithConcertId.some(updatedRound =>
                    updatedRound.startTime === existingRound.startTime &&
                    updatedRound.endTime === existingRound.endTime &&
                    updatedRound.date === existingRound.date
                )
            );
            await prisma.round.deleteMany({
                where: {
                    id: {
                        in: roundsToDelete.map(round => round.id),
                    },
                },
            });
            const roundsToAdd = roundsWithConcertId.filter(updatedRound =>
                !existingConcert.Round.some(existingRound =>
                    updatedRound.startTime === existingRound.startTime &&
                    updatedRound.endTime === existingRound.endTime &&
                    updatedRound.date === existingRound.date
                )
            );
            await prisma.round.createMany({
                data: roundsToAdd,
            });
        }


        res.status(200).send("Update concert success");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating concert");
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
router.get('/getLastConcert', async (req, res) => {
    await prisma.concert.findFirst({
        orderBy: {
            id: 'desc'
        }
    })
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

router.get('/getRoundByConcertId/:concertId', async (req, res) => {
    await prisma.round.findMany({
        where: {
            concertId: req.params.concertId
        }
    })
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

router.get('/getZoneByConcertId/:concertId', async (req, res) => {
    await prisma.zone.findMany({
        orderBy: {
            name: 'desc'
        },
        where: {
            concertId: req.params.concertId
        }
    })
        .then((data) => {
            res.status(200).send(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).send('Error retrieving user data');
        });
});

router.post('/createTicket', async (req, res) => {
    const createPayment = await prisma.payment.create({
        data: {
            status: "PENDING"
        }
    })
    await prisma.ticket.create({
        data: {
            concertId: req.body.concertId,
            roundId: req.body.roundId,
            zoneId: req.body.zoneId,
            userId: req.body.userId,
            paymentId: createPayment.id,
            price: req.body.price,
            count: req.body.count
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

router.get('/getTicketById/:id', async (req, res) => {
    await prisma.ticket.findUnique({
        where: {
            id: req.params.id
        },
        include: {
            concert: true,
            round: true,
            zone: true,
            user: true,
            payment: true
        }
    })
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error retrieving user data');
        });
});

router.get('/getTicketByUserId/:userId', async (req, res) => {
    await prisma.ticket.findMany({
        where: {
            userId: req.params.userId
        },
        include: {
            concert: true,
            round: true,
            zone: true,
            payment: true
        }
    })
        .then((data) => {
            res.status(200).send(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).send('Error retrieving user data');
        });
});

router.post('/createPayment', async (req, res) => {
    await prisma.payment.create({
        data: {
            status: "PENDING"
        }
    })
        .then((data) => {
            res.status(200).send(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).send('Error retrieving user data');
        });
});

router.patch('/updatePayment/:paymentId', async (req, res) => {
    await prisma.payment.update({
        where: {
            id: req.params.paymentId
        },
        data: {
            status: req.body.status
        }
    })
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

router.get('/getPaymentById/:id', async (req, res) => {
    await prisma.payment.findUnique({
        where: {
            id: req.params.id
        },
        include: {
            Ticket: {
                include: {
                    concert: true,
                    round: true,
                    zone: true,
                    user: true,
                    payment: true
                }
            }
        }
    }).then((data) => {
        res.status(200).send(data);
    }
    ).catch((err) => {
        console.log(err);
        res.status(500).send('Error retrieving user data');
    }
    );
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

// router.delete('delConcert', async (req, res) => {
//     //delete all concert
//     await prisma.concert.deleteMany()
//         .then((data) => {
//             res.status(200).send(data);
//         }).catch((err) => {
//             console.log(err);
//             res.status(500).send('Error deleting concert');
//         });
// });


exports.router = router;