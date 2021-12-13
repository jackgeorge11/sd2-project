const db = require('../services/db');

class Feed {
    posts = [];

    async getPosts() {
        var sql = `
            SELECT p.post_date, p.postTitle, p.postBody, p.id, u.username
            FROM posts p
                JOIN users u WHERE p.authorId = u.id;
        `;
        const results = await db.query(sql)
        this.posts = results
    }
}

module.exports = {
    Feed
}