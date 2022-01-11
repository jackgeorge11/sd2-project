const db = require('../services/db');

class newPost {

    id;
    title;
    date;
    username;
    authorId;
    body;


    async newPost(_id) {
        var sql = `
        INSERT INTO posts(id, authorid, post_date, postTitle, postBody)
        VALUES('1', '2022-01-10', 'title', 'post body');
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
    newPost
}