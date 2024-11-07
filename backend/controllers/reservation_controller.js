const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Reservation = require('../models/reservation_model');
exports.createReservation = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { name, day, hour_start, duration, description, roomId, userId } = req.body;
    const stateCodeId = 2; // Asigna el tipoUsuarioId genérico aquí

    try {
        const reservation = new Reservation(null, name, day, hour_start, duration, description, roomId, userId, stateCodeId);
        console.log(reservation);
        await reservation.save();

        
        await Reservation.updateRoomState(roomId, stateCodeId);

        res.status(201).json({ message: 'Reservation created successfully' });
    } catch (err) { 
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }  
};
exports.updateReservation = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    
    //const stateCodeId = 2; // Asigna el tipoUsuarioId genérico aquí

    try {
        //const reservation = new Reservation(id, name, day, hour_start, duration, description, roomId, userId);
        const id = req.params.id;
        const { name, day, hour_start, duration, description, roomId, userId, stateCodeId } = req.body;
    //console.log(req.body);
        const reservation = new Reservation(
            id !== undefined ? parseInt(id, 10) : null,
            name !== undefined ? name : null,
            day !== undefined ? day : null,
            hour_start !== undefined ? hour_start : null,
            duration !== undefined ? parseInt(duration, 10) : null,
            description !== undefined ? description : null,
            roomId !== undefined ? parseInt(roomId, 10) : null,
            userId !== undefined ? parseInt(userId, 10) : null
        );
        const query = 'UPDATE reservas SET nombre = ?, dia = ?, hora_inicio = ?, duracion_sala = ?, descripcion = ?, salaId = ?, userId = ? WHERE id = ?';
        const values = [
            this.nombre !== undefined ? this.nombre : null,
            this.dia !== undefined ? this.dia : null,
            this.hora_inicio !== undefined ? this.hora_inicio : null,
            this.duracion_sala !== undefined ? this.duracion_sala : null,
            this.descripcion !== undefined ? this.descripcion : null,
            this.salaId !== undefined ? this.salaId : null,
            this.userId !== undefined ? this.userId : null,
            this.id !== undefined ? this.id : null
        ];
        console.log(reservation);
        console.log('Executing query:', query);
        console.log('With values:', values);

        const [result]  = await reservation.update();
        //console.log(result);
        await Reservation.updateRoomState(roomId, stateCodeId);

        res.status(200).json({ message: 'Reservation updated successfully' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
exports.deleteReservation = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        const id = req.params.id;
        const reservation = new Reservation(id);
        const roomId = req.params.roomId;
        const stateCodeId = 1; 
        await reservation.delete();
        await Reservation.updateRoomState(roomId, stateCodeId);
        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.fetchAll = async (req, res, next) => {
    try {
        const reservations = await Reservation.fetchAll();
        res.status(200).json(reservations);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.findReservationByIdUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        const id = req.params.id;
        const reservation = await Reservation.findReservationByIdUser(id);
        if (reservation[0].length === 0) {
            return res.status(404).json({
                message: 'User Reservations not found!'
            });
        }
        res.status(200).json({ reservation: reservation[0] });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
exports.findRoomsAvailable = async (req, res, next) => {   
    try {
        const rooms = await Reservation.findRoomsAvailable();
        res.status(200).json(rooms[0]);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.updateStateLastRoom = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        const id = req.params.id;
        await Reservation.updateStateLastRoom(id);
        res.status(200).json({ message: 'Room state updated successfully' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};