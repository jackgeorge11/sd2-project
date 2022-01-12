const db = require('../services/db');
const uniqid = require("uniqid");

class Post {

    id;
    title;
    date;
    username;
    authorId;
    body;
    authorActive;

    async getPost(_id, sessionId) {
        var sql = `
        SELECT p.*, u.username
        FROM posts p
            JOIN users u ON p.authorId = u.id
            WHERE p.id = '${_id}'
        `;
        console.log(`post id is: ${_id}`)
        const results = await db.query(sql)
        const post = results[0]
        this.id = post.id;
        this.title = post.postTitle;
        this.date = post.post_date;
        this.username = post.username;
        this.body = post.postBody;
        this.authorId = post.authorId;
        if (this.authorId === sessionId) {
            this.authorActive = true;
        } else {this.authorActive = false}
    }

    async createPost(_id, title, body) {
        console.log('preparing to write sql statement')
        var sql = `INSERT INTO posts (id, authorId, post_date, postTitle, postBody) VALUES (? , ? , ? , ? , ?) `;
        const newPostId = uniqid();
        const now = new Date;
        console.log(`the new post id is: ${newPostId} and the authorId is: ${_id}`)
        const results = await db.query(sql, [newPostId, _id, now, title, body])
        return true
    }
}

module.exports = {
    Post
}