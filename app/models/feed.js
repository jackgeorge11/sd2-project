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
        let _posts = []
        results.forEach((post) => {
            let newPost = {
                id: post.id,
                title: post.postTitle,
                date: post.post_date,
                username: post.username,
                authorId: post.authorId,
                body: post.postBody
            };
            _posts.push(newPost)
        })
        this.posts = _posts
    }
}

module.exports = {
    Feed
}