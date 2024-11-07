const express = require('express');
const Reservation = require('../models/reservation_model');
const { body, param } = require('express-validator');
const reservationController = require('../controllers/reservation_controller');
const router = express.Router();

router.get('/funciona', (req, res) => {
    res.send('Funciona');
});
router.post(
    '/createRersevation',
    [
        body('name')
            .notEmpty().withMessage('Please enter a name'),
        body('day')
            .isISO8601().toDate().withMessage('Please enter a valid date'),
        body('hour_start')
            .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).withMessage('Please enter a valid time in HH:mm:ss format'),
        body('duration')
            .isNumeric().withMessage('Duration must be a number'),
        body('description')
            .trim().optional(), // Hacer que la descripción sea opcional
        body('roomId')
            .isNumeric().withMessage('Room ID must be a number')
            .custom(async (roomId) => {
                const [room] = await Reservation.findRoomById(roomId);
                if (room.length > 0) {
                    throw new Error('Room already busy!');
                }
            }),
        body('userId')
            .isNumeric().withMessage('User ID must be a number')
    ],
    reservationController.createReservation
);
router.put(
    '/updateReservation/:id',
    [ 
        param('id').isNumeric(),
        body('name').notEmpty().withMessage('Please enter a name'),
        body('day')
            .isISO8601().toDate().withMessage('Please enter a valid date'),
        body('hour_start').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).withMessage('Please enter a valid time in HH:mm:ss format'),
        body('duration').isNumeric().withMessage('Duration must be a number'),
        body('description').trim().optional(), // Hacer que la descripción sea opcional
        body('roomId').isNumeric().withMessage('Room ID must be a number'),
        body('userId').isNumeric().withMessage('User ID must be a number'),
        body('stateCodeId').isNumeric().withMessage('State Code ID must be a number'),
    ], reservationController.updateReservation
);

router.delete(
    '/deleteReservation/:id/:roomId',
    [   
        param('id').isNumeric(),
        param('roomId').isNumeric() 
    ], reservationController.deleteReservation
);

router.get('/fetchAllReservations/rooms', reservationController.fetchAll);
router.get('/findReservationById/:id',  [param('id').isNumeric()], reservationController.findReservationByIdUser);
router.get('/findRoomsAvailable', reservationController.findRoomsAvailable);
router.put('/updateStateLastRoom/:id', [param('id').isNumeric()], reservationController.updateStateLastRoom);
module.exports = router;