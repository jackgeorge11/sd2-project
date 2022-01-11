const db = require('../services/db');
const bcrypt = require("bcryptjs"); //encrypt and compare passwwords

class user_info {
    //User id
    id;

    //User email
    email;

    constructor(email) {
        this.email = email;
    }

    //checking existing user id from an email address
    async getIdFromEmail() {
        var sql = "SELECT id FROM user_info WHERE user_info.email = ?";
        const result = await db.query(sql, [this.email]);
        if (JSON.stringify(result) != '[]') {
            this.id = result[0].id;
            return this.id;
        }
        else{
            return false;
        }

    }

    //add password to existing user
    async setUserPassword(password) {
        const pw = await bcrypt.hash(password, 10);
        var sql = "UPDATE user_info SET pass = ? WHERE user_info.id = ?";
        const result = await db.query(sql, [pw, this.id]);
        return this.id;

    }

    //Add new user to user_info table
    async addUser(password) {
        const pw = await bcrypt.hash(password, 10);
        console.log('hashed password is:', pw)
        var sql = "INSERT INTO user_info (email, pass) VALUES (? , ?)";
        const result = await db.query(sql, [this.email, pw]);
        console.log(result.insertId);
        this.id = result.insertId;
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
    user_info
}