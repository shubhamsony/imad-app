var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require ('crypto');
var bodyParser = require('body-parser');

var config = {
    user:"shubhamsoni136",
    database:"shubhamsoni136",
    host:"db.imad.hasura-app.io",
    port:"5432",
    password:process.env.DB_PASSWORD
}; 
var pool = new Pool(config);
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
function createTemplate(data){
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;
    var htmlTemplate = `
    <html>
        <head>
            <title>
            ${title}
            </title>
            <link rel="stylesheet" href="/ui/style.css">
        </head>
        <body>
            <div class="container">
                <div>
                    <a href="/">home</a>
                </div>
                </hr>
                <h3>
                ${heading}
                </h3>
                <div>
                ${date.toDateString()}
                </div>
                <div>
                ${content}
                </div>
            </div>
        </body>
    </html>
    `;
    return htmlTemplate;
}
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
var counter=0;
app.get('/counter', function (req , res){
    counter++;
    res.send(counter.toString());
});

app.get('/testdb' , function (req , res){
    pool.query('SELECT id,name FROM test' , function(err , result){
        if(err){
            res.status(500).send(err.toString());
        } else {
            res.send(JSON.stringify(result.rows));
        }
    });
});
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/profile' , function(req,res){
  res.sendFile(path.join(__dirname, 'ui','profile.html'));  
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
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
    var password = req.body.password;
    pool.qurey('SELECT FROM test WHERE username=$1',[username],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send('hello');
        }
    });
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
app.get('/article/:articleName', function (req, res) {
  pool.query("SELECT * FROM article WHERE title =$1 " , [req.params.articleName],function(err,result){
   if(err){
       res.status(500).send(err.toString());
   } else{
       if(result.rows.length===0){
          res.status(404).send('Article not found'); 
       } else{
           var articleData = result.rows[0];
           res.send(createTemplate(articleData));
       }
   }   
  });
});
var names=[];
app.get('/submit-name', function(req,res){
    var name = req.query.name;
    names.push(name);
    res.send(JSON.stringify(names));
});
// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
                                                