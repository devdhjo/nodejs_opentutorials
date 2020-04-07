var template = require('./template');
var db = require('./db');
var qs = require('querystring');
var url = require('url');

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
           <p><input type="submit" value="Create"></p>
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

exports.update = function(request, response) {
  var queryData = url.parse(request.url, true).query;
  db.query('SELECT * FROM topic', function (error, topics) {
    db.query('SELECT * FROM author', function (error, authors) {
      db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], function (error, author) {
        if(error) throw error;
        var title = 'Author';
        var list = template.list(topics);
        var html = template.HTML(title, list,
          `${template.authorTable(authors)}
           <form action="/author/update_process" method="post">
             <input type="hidden" name="id" value="${queryData.id}">
             <p><input type="text" name="name" placeholder="name" value="${author[0].name}"></p>
             <p><textarea name="profile" placeholder="profile">${author[0].profile}</textarea></p>
             <p><input type="submit" value="Update"></p>
           </form>`, ``);
        response.writeHead(200);
        response.end(html);
      })
    })
  })
}

exports.update_process = function(request, response) {
  var body = '';
  request.on('data', function(data) {
    body = body + data;
  })
  request.on('end', function() {
    var post = qs.parse(body);
    db.query(`UPDATE author SET name=?, profile=? WHERE id=?`, [post.name, post.profile, post.id], function(error, result) {
      if(error) throw error;
      response.writeHead(302, {Location: `/author`});
      response.end();
    })
  })
}
