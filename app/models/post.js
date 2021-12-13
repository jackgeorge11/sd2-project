const db = require('../services/db');

class Post {

    id;
    title;
    date;
    username;
    authorId;
    body;


    async getPost(_id) {
        var sql = `
        SELECT p.*, u.username
        FROM posts p
            JOIN users u ON p.authorId = u.id
            WHERE p.id = ${_id}
        `;
        const results = await db.query(sql)
        const post = results[0]
        this.id = post.id;
        this.title = post.postTitle;
        this.date = post.post_date;
        this.username = post.username;
        this.body = post.postBody;
        this.authorId = post.authorId;
    }
}

module.exports = {
    Post
}