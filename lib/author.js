var template = require('./template');
var db = require('./db');

exports.home = function(request, response) {
  db.query('SELECT * FROM topic', function(error, topics) {
    db.query('SELECT * FROM author', function(error, authors) {
      var title = 'Author';
      var list = template.list(topics);
      var html = template.HTML(title, list,
        `${template.authorTable(authors)}`,
        `<a href="/create">Create</a>`);
      response.writeHead(200);
      response.end(html);
    })
  })
}
