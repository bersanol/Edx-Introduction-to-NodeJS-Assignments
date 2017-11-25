const path = require('path')


module.exports = {
    posts : require(path.join(__dirname,  'posts.js')),
    commentsHandler : require(path.join(__dirname, 'comments.js'))
}