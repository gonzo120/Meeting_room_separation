const db = require('../util/database');

module.exports = class Reservationom {
    constructor(id, nombre, dia, hora_inicio, duracion_sala, descripcion, salaId, userId) {
        this.id = parseInt(id, 10); // Asegúrate de que el id es un número
        this.nombre = nombre;
        this.dia = dia instanceof Date ? dia.toISOString().split('T')[0] : dia; // Formatear la fecha
        this.hora_inicio = hora_inicio;
        this.duracion_sala = parseInt(duracion_sala, 10); // Asegúrate de que la duración es un número
        this.descripcion = descripcion;
        this.salaId = parseInt(salaId, 10); // Asegúrate de que salaId es un número
        this.userId = parseInt(userId, 10); // Asegúrate de que userId es un número
    }

    static findRoomById(id) { 
        return db.execute('SELECT * FROM reservas WHERE salaId = ?', [id]);
    }

    save() {
        return db.execute(
            'INSERT INTO reservas (nombre_reserva, dia, hora_inicio, duracion_sala, descripcion, salaId, userId) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [this.nombre, this.dia, this.hora_inicio, this.duracion_sala, this.descripcion, this.salaId, this.userId]
        );
    }

    static updateRoomState(salaId, estadoSalaId) {
        return db.execute(
            'UPDATE salas SET estadoSalaId = ? WHERE id = ?',
            [estadoSalaId, salaId]
        );
    }
    update() {
        const query = 'UPDATE reservas SET nombre_reserva = ?, dia = ?, hora_inicio = ?, duracion_sala = ?, descripcion = ?, salaId = ?, userId = ? WHERE id = ?';
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
        console.log('Executing query:', query);
        console.log('With values:', values);

        return db.execute(query, values);
    }
   static findReservationByIdUser(id) {

    return db.execute('SELECT r.*, u.username, u.email, s.nombre FROM reservas r LEFT JOIN users u ON r.userId = u.id LEFT JOIN salas s On r.salaId = s.id where r.userId = ?', [id]);
    }
    static findByName(nombre) {
        return db.execute('SELECT * FROM salas WHERE nombre = ?', [nombre]);
    }
    static loginFindByEmail(email) {
        return db.execute(
            'SELECT * FROM users u LEFT JOIN tipo_usuarios tu ON tu.id = u.tipoUsuarioId WHERE u.email = ?', 
            [email]
        );
    }
    static updateStateLastRoom(id) {
        return db.execute('UPDATE salas SET estadoSalaId = 1 WHERE id = ?', [id]);
    }

    
    delete() {
        return db.execute('DELETE FROM reservas WHERE id = ?', [this.id]);
    }

    static async fetchAll() {
        const [rows] = await db.execute('SELECT r.*, u.username, u.email, s.nombre FROM reservas r LEFT JOIN users u ON r.userId = u.id LEFT JOIN salas s ON r.salaId = s.id');
        return rows;
    }
    
    static findRoomsAvailable() {
        return db.execute('SELECT * FROM salas WHERE estadoSalaId = 1');
    }

    
}