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
        var sql = "SELECT id FROM users WHERE users.id = ?";
        const result = await db.query(sql, [id]);
        if (JSON.stringify(result) != '[]') {
            return result[0].id;
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
    async authenticate(username, password) {
        console.log(username, password)
        var sql = "SELECT user_password, id FROM users WHERE username = ? ";
        const result = await db.query(sql, [username]);
        console.log(result)
        const match = await bcrypt.compare(password, result[0].user_password);
        console.log(match)
        if (match == true) {
            return {match: true, _id:  result[0].id};
        }
        else {
            return false;
        }
    }
}

module.exports = {
    User
}