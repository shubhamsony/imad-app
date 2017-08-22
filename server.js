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
app.use(morgan('combined'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
var counter=0;
app.get('/counter', function (req , res){
    counter++;
    res.send(counter.toString());
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

app.get('/sign-up.html', function(req,res){
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
                    
                    req.session.auth = {userId : result.rows[0].id };
                    
                    res.send('credentials correct! ');
                }else {
                    res.status(403).send('username/password invalid');

                }
            }
        }
    });
});

app.get('/check-login' , function(req , res){
    if(req.session&&req.session.auth&&req.session.auth.userId){
        res.send('you are logged in as'+req.session.auth.userId);
    }else{
        res.send('you are not logged in');
        res.redirect('/login');
    }
});

app.get('/logout' , function(req , res){
    delete req.session.auth;
    res.send('logged-out successfully');
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
                                                