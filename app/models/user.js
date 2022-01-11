const db = require('../services/db');
const bcrypt = require("bcryptjs"); //encrypt and compare passwwords
const uniqid = require("uniqid"); //generate unique ids

class User {
    id;
    email;
    username;
    password;

    //checking existing user id from an email address
    async getIdFromEmail(email) {
        var sql = "SELECT id FROM user WHERE user.email = ?";
        const result = await db.query(sql, [email]);
        if (JSON.stringify(result) != '[]') {
            this.id = result[0].id;
            return this.id;
        }
        else{
            return false;
        }

    }

    async findUserById(id) {
        var sql = "SELECT id FROM user WHERE user.email = ?";
        const result = await db.query(sql, [id]);
        if (JSON.stringify(result) != '[]') {
            this.id = result[0].id;
            return this.id;
        }
        else{
            return false;
        }
    }

    //Add new user to user_info table
    async addUser(email, username, password) {
        this.email = email;
        this.username = username;
        this.password = await bcrypt.hash(password, 10);
        this.id = uniqid();
        console.log('hashed password is:', this.password, '| uniqid is:', this.id, '| email is:', this.email, '| username is:', this.username);
        var sql = "INSERT INTO users (id, email, username, user_password) VALUES (? , ? , ? , ?)";
        const result = await db.query(sql, [this.id, this.email, this.username, this.password]);
        console.log(result);
        return true;
    }

    //Authentication
    async authenticate(submitted) {
        var sql = "SELECT pass FROM user_info WHERE id = ? ";
        const result = await bcrypt.compare(submitted, result[0].password);
        if (match == true) {
            return true;
        }
        else {
            return false;
        }

    }
}

module.exports = {
    User
}