const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Room = require('../models/room_model');
exports.createRoom = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { name, places, floor, description } = req.body;
    const stateCodeId = 1; // Asigna el tipoUsuarioId genérico aquí

    try {
        const room = new Room(null, name, places, floor, description, stateCodeId);
        console.log(room);// Verifica que los datos se estén pasando correctamente
        await room.save();
        res.status(201).json({ message: 'Room created successfully!' });
    } catch (err) { 
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }  
};
exports.updateRoom = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        const roomId = req.params.id;
        const { name, places, floor, description, stateCodeId } = req.body;
        const room = new Room(roomId,name, places, floor, description, stateCodeId);
        const [result] = await room.update();
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Room not found!'
            });
        }
        return res.status(200).json({
            message: 'Room updated successfully!',
            room: { id: roomId, name, places, floor, description, stateCodeId }
        });
    } catch (err) { 
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }  
};

exports.deleteRoom = async (req, res, next) => {
    try {
        const roomId = req.params.id;
        const room = new Room(roomId);
        await room.delete();
        if (room.affectedRows === 0) {
            return res.status(404).json({
                message: 'Room not found!'
            });
        }
        return res.status(200).json({
            message: 'Room deleted successfully!',
        });
    } catch (err) { 
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }  
};

exports.fetchAll = async (req, res, next) => { 
    try {
        const rooms = await Room.fetchAll();
        res.status(200).json({ rooms: rooms });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.findRoomById = async (req, res, next) => {
    const roomId = req.params.id;
    try {
        const room = await Room.findRoomById(roomId);
        if (room[0].length === 0) {
            return res.status(404).json({
                message: 'Room not found!'
            });
        }
        res.status(200).json({ room: room[0] });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};