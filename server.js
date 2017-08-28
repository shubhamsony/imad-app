var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require ('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
    user:"shubhamsoni136",
    database:"shubhamsoni136",
    host:"db.imad.hasura-app.io",
    port:"5432",
    password:process.env.DB_PASSWORD
}; 

var pool = new Pool(config);
var app = express();
app.use(session({
    secret: 'somerandomstringvalue',
    cookie: {maxAge : 1000 * 60 * 60 * 24 * 30}
}));
function createTemplate (data) {
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;
    var member=data.username;
    var pic = data.profile_pic;
    
    var htmlTemplate = `
    <html>
      <head>
          <title>
              ${title}
          </title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="/ui/style.css" rel="stylesheet" />
      </head> 
      <body>
          
              <div class="head">
                  <h2><a href="/">Home</a></h2>
                  <img src=${pic} width="70px" height="70px">
              </div>
          <div class="container">    
              <h3>
                 ${heading}
              </h3>
              <p></p>
              <div>
                  ${date.toDateString()}
              </div>
              <div>
                ${content}
              </div>
              <br><br>
              <h4>Comments</h4>
              <div id="comment_form">
              </div>
              <div id="comments">
                <center>Loading comments...</center>
              </div>
          </div>
          <script type="text/javascript" src="/ui/article.js"></script>
      </body>
    </html>
    `;
    return htmlTemplate;
}
app.use(morgan('combined'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
    res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
app.get('/ui/article.js', function (req, res) {
    res.sendFile(path.join(__dirname, 'ui', 'article.js'));
});

app.get('/profile' , function(req,res){
  res.sendFile(path.join(__dirname, 'ui','profile.html'));  
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/sign-up', function(req,res){
    res.sendFile(path.join(__dirname ,  'sign-up.html'));
});
app.get('/signup.js', function(req,res){
    res.sendFile(path.join(__dirname ,  'signup.js'));
});
app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});
function hash(input, salt ){
    var hashed = crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return ["pbkdf2",10000,salt,hashed.toString('hex')].join('$');   
}
app.post('/login', function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    pool.query('SELECT * FROM test WHERE username=$1',[username],function(err,result){
        if(err){
            res.status(500).send();
        }else{
            if(result.rows.length===0){
                res.status(403).send('username/password invalid');
            }
            else{
                var dbstring = result.rows[0].password;
                var salt=dbstring.split('$')[2];
                var hashedpassword=hash(password,salt);
                if(hashedpassword===dbstring){
                    
                    req.session.auth = {userId : result.rows[0].user_id };
                    
                    res.send('credentials correct! ');
                }else {
                    res.status(403).send('username/password invalid');

                }
            }
        }
    });
});

app.get('/check-login' , function(req , res){
    if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM test WHERE user_id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].username);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});

app.get('/logout' , function(req , res){
    delete req.session.auth;
    res.redirect('/');
});

app.get('/get-articles', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT * FROM article ORDER BY date DESC', function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.post('/submit-comment/:articleName', function(req,res){
    if(req.session && req.session.auth && req.session.auth.userId ){
    pool.query('SELECT * FROM article WHERE title=$1',[req.params.articleName],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            if(result.rows.length===0){
                res.status(400).send('Article Not Found!');
            }else{
                var articleid = result.rows[0].article_id;
                pool.query('INSERT INTO comment (article_id,comment,user_id) VALUES ($1,$2,$3)',[articleid,req.body.comment,req.session.auth.userId],function(err,result){
                    if(err){
                        res.status(500).send(err.toString());
                    }else{
                        res.status(200).send('comment inserted successfully');
                    }
                });
            }
        }
    });
    }else{
        res.send('only logged in user can comment');
    }
});

app.get('/get-comments/:articleName' ,function(req,res){
    pool.query('SELECT comment.*,test.username FROM article, comment, test WHERE article.title = $1 AND article.article_id = comment.article_id AND comment.user_id = test.user_id ORDER BY comment.timestamp DESC', [req.params.articleName], function(err,result){
              if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
    });
});

app.get('/articles/:articleName',function(req,res){
   
   pool.query('SELECT article.*,test.profile_pic,test.username FROM article , test WHERE title=$1 AND test.user_id=$2',[req.params.articleName,req.session.auth.userId],function(err,result){
       if(err){
           res.status(500).send(err.toString());
       }else{
           var article_data = result.rows[0];
           res.send(createTemplate(article_data));
       }
   }) ;
});
app.get('/hash/:input',function (req, res ){
    var hashedString = hash(req.params.input,'this is an string');
    res.send(hashedString);
});
app.post('/create-user', function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbstring = hash(password,salt);
    pool.query('INSERT INTO test (username,password) VALUES ($1,$2)', [username,dbstring],function(err,result){
       if(err){
            res.status(500).send(err.toString());
        } else {
            res.send('user created successfully');
        } 
    });
});
// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
                                                