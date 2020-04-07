var template = require('./template');
var db = require('./db');
var qs = require('querystring');

exports.home = function(request, response) {
  db.query('SELECT * FROM topic', function(error, topics) {
    db.query('SELECT * FROM author', function(error, authors) {
      var title = 'Author';
      var list = template.list(topics);
      var html = template.HTML(title, list,
        `${template.authorTable(authors)}
         <form action="/author/create_process" method="post">
           <p><input type="text" name="name" placeholder="name"></p>
           <p><textarea name="profile" placeholder="description"></textarea></p>
           <p><input type="submit"></p>
         </form>`, ``);
      response.writeHead(200);
      response.end(html);
    })
  })
}

exports.create_process = function(request, response) {
  var body = '';
  request.on('data', function(data) {
    body = body + data;
  })
  request.on('end', function() {
    var post = qs.parse(body);
    db.query(
      `INSERT INTO author (name, profile) VALUES (?, ?);`,
      [post.name, post.profile], function(error, result) {
      if(error) throw error;
      response.writeHead(302, {Location: `/author`});
      response.end();
    })
  })
}
