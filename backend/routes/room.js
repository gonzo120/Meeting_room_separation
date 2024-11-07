const express = require('express');
const Room = require('../models/room_model');
const { body, param } = require('express-validator');
const roomController = require('../controllers/room_controller');
const router = express.Router();

router.post(
    '/createRoom',
    [
        body('name')
            .notEmpty().withMessage('Please enter a name s')
            .bail()
            .custom(async (nombre) => {
                const [room] = await Room.findByName(nombre);
                if (room.length > 0) {
                    throw new Error('Room already exists!');
                }
            }),
        body('places').trim().notEmpty().withMessage('Please enter the number of places'),
        body('floor').trim().notEmpty().withMessage('Please enter the floor number'),
        body('description').trim().optional(), // Hacer que la descripción sea opcional
    ],
    roomController.createRoom
);

router.put(
    '/updateRoom/:id',
    [   
        param('id').isNumeric(), 
        body('name').notEmpty().withMessage('Please enter a name'),
        body('places').trim().notEmpty().withMessage('Please enter the number of places'),
        body('floor').trim().notEmpty().withMessage('Please enter the floor number'),
        body('description').trim().optional(), // Hacer que la descripción sea opcional
        body('stateCodeId').isNumeric().withMessage('State Code ID must be a number'),
    ], roomController.updateRoom
);

router.delete(
    '/deleteRoom/:id',
    [   
        param('id').isNumeric(), 
    ], roomController.deleteRoom
);

router.get('/fetchAllRooms', roomController.fetchAll);

router.get('/findRoomById/:id',
    [   
        param('id').isNumeric()
    ], roomController.findRoomById);

module.exports = router;