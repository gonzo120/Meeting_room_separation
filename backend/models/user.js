const db = require('../util/database');

module.exports = class User {
    constructor(id, username, email, password, tipoUsuarioId) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.tipoUsuarioId = tipoUsuarioId;
    }
    static findByEmail(email) {
        return db.execute('SELECT * FROM users WHERE email = ?', [email]);
    }
    static loginFindByEmail(email) {
        return db.execute(
            'SELECT u.id AS id_usuario, u.*,tu.*  FROM users u LEFT JOIN tipo_usuarios tu ON tu.id = u.tipoUsuarioId WHERE u.email = ?', 
            [email]
        );
    }
    save() {
        return db.execute(
            'INSERT INTO users (username, email, password, tipoUsuarioId) VALUES (?, ?, ?, ?)',
            [this.username, this.email, this.password, this.tipoUsuarioId]
        );
    }

    static deleteById(id) {}

    static fetchAll() {
        return db.execute('SELECT * FROM users');
    }

    static findById(id) {}
}