const db = require('../services/db');

class deletePost {

    id;
    title;
    date;
    username;
    authorId;
    body;


    async deletePost(_id) {
        var sql = `
        DELETE FROM posts WHERE id= ${_id}
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
    deletePost
}