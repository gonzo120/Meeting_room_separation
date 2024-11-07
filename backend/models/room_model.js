const db = require('../util/database');

module.exports = class Room {
    constructor(id, nombre, plazas, planta, Descripcion, estadoSalaId) {
        this.id = id;
        this.nombre = nombre;
        this.plazas = plazas;
        this.planta = planta;
        this.Descripcion = Descripcion;
        this.estadoSalaId = estadoSalaId;
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
    save() {
        return db.execute(
            'INSERT INTO salas (nombre, plazas, planta, Descripcion, estadoSalaId) VALUES (?, ?, ?, ?, ?)',
            [this.nombre, this.plazas, this.planta, this.Descripcion, this.estadoSalaId]
        );
    }

    update() {
        return db.execute(
            'UPDATE salas SET nombre = ?, plazas = ?, planta = ?, Descripcion = ?, estadoSalaId = ? WHERE id = ?',
            [this.nombre, this.plazas, this.planta, this.Descripcion,this.estadoSalaId, this.id]
        );
    }
    delete() {
        return db.execute('DELETE FROM salas WHERE id = ?', [this.id]);
    }

    static async fetchAll() {
        const [rows] = await db.execute('SELECT * FROM salas');
        return rows;
    }

    static findRoomById(id) { 
        return db.execute('SELECT * FROM salas WHERE id = ?', [id]);
    }
}