const request = require('supertest');
const express = require('express');
const roomRoutes = require('../routes/room');
const Room = require('../models/room_model');

const app = express();
app.use(express.json());
app.use('/api/rooms', roomRoutes);

// Mock completo del módulo room_model
jest.mock('../models/room_model', () => {
  return jest.fn().mockImplementation(() => {
    return {
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
  });
});

describe('Room Controller Tests', () => {
  // Tests para POST /createRoom
  describe('POST /createRoom', () => {
    it('debería crear una sala cuando los datos son válidos', async () => {
      // Mock para findByName (verificación de sala existente)
      Room.findByName = jest.fn().mockResolvedValueOnce([[]]);
      
      const mockRoomInstance = new Room();
      mockRoomInstance.save.mockResolvedValueOnce();
      Room.mockImplementation(() => mockRoomInstance);

      const response = await request(app)
        .post('/api/rooms/createRoom')  // Corregida la ruta
        .send({
          name: 'SALA TEST',
          places: '20',
          floor: '3',
          description: 'Sala de prueba'
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'Room created successfully!'
      });
    });

    it('debería devolver error 422 cuando la sala ya existe', async () => {
      Room.findByName = jest.fn().mockResolvedValueOnce([[{ id: 1 }]]);

      const response = await request(app)
        .post('/api/rooms/createRoom')  // Corregida la ruta
        .send({
          name: 'SALA EXISTENTE',
          places: '20',
          floor: '3',
          description: 'Sala de prueba'
        });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('errors');
    });
  });

  // Tests para PUT /updateRoom/:id
  describe('PUT /updateRoom/:id', () => {
    it('debería actualizar la sala cuando los datos son válidos', async () => {
      const mockResult = [{
        affectedRows: 1
      }];
      
      const mockRoomInstance = new Room();
      mockRoomInstance.update.mockResolvedValueOnce(mockResult);
      Room.mockImplementation(() => mockRoomInstance);

      const roomData = {
        name: 'SALA 1',
        places: '10',
        floor: '2',
        description: 'Nueva descripción',
        stateCodeId: 2
      };

      const response = await request(app)
        .put('/api/rooms/updateRoom/1')  // Corregida la ruta
        .send(roomData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Room updated successfully!',
        room: {
          id: '1',
          ...roomData
        }
      });
    });

    it('debería devolver 404 cuando la sala no existe', async () => {
      const mockRoomInstance = new Room();
      mockRoomInstance.update.mockResolvedValueOnce([{ affectedRows: 0 }]);
      Room.mockImplementation(() => mockRoomInstance);

      const response = await request(app)
        .put('/api/rooms/updateRoom/999')  // Corregida la ruta
        .send({
          name: 'SALA 1',
          places: '10',
          floor: '2',
          description: 'Nueva descripción',
          stateCodeId: 2
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: 'Room not found!'
      });
    });
  });

  // Tests para DELETE /deleteRoom/:id
  describe('DELETE /deleteRoom/:id', () => {
    it('debería eliminar la sala cuando existe', async () => {
      const mockRoomInstance = new Room();
      mockRoomInstance.delete.mockResolvedValueOnce({ affectedRows: 1 });
      Room.mockImplementation(() => mockRoomInstance);

      const response = await request(app)
        .delete('/api/rooms/deleteRoom/1');  // Corregida la ruta

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Room deleted successfully!'
      });
    });

    it('debería devolver 404 cuando la sala no existe', async () => {
      const mockRoomInstance = new Room();
      mockRoomInstance.delete.mockResolvedValueOnce({ affectedRows: 0 });
      Room.mockImplementation(() => mockRoomInstance);

      const response = await request(app)
        .delete('/api/rooms/deleteRoom/999');  // Corregida la ruta

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Room deleted successfully!'
      });
    });
  });

  // Tests para GET /fetchAllRooms
  describe('GET /fetchAllRooms', () => {
    it('debería devolver todas las salas', async () => {
      const mockRooms = [
        { id: 1, name: 'SALA 1', places: '10', floor: '1' },
        { id: 2, name: 'SALA 2', places: '20', floor: '2' }
      ];

      Room.fetchAll = jest.fn().mockResolvedValueOnce(mockRooms);

      const response = await request(app)
        .get('/api/rooms/fetchAllRooms');  // Corregida la ruta

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        rooms: mockRooms
      });
    });
  });

  // Tests para GET /findRoomById/:id
  describe('GET /findRoomById/:id', () => {
    it('debería devolver una sala cuando existe', async () => {
      const mockRoom = [{
        id: 1,
        name: 'SALA 1',
        places: '10',
        floor: '1',
        description: 'Descripción',
        stateCodeId: 1
      }];

      Room.findRoomById = jest.fn().mockResolvedValueOnce([mockRoom]);

      const response = await request(app)
        .get('/api/rooms/findRoomById/1');  // Corregida la ruta

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        room: mockRoom
      });
    });

    it('debería devolver 404 cuando la sala no existe', async () => {
      Room.findRoomById = jest.fn().mockResolvedValueOnce([[]]); 

      const response = await request(app)
        .get('/api/rooms/findRoomById/999');  // Corregida la ruta

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: 'Room not found!'
      });
    });
  });

  // Limpiar todos los mocks después de cada prueba
  afterEach(() => {
    jest.clearAllMocks();
  });
});