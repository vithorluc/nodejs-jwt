//index.js
var http = require('http'); 
const express = require('express') 
const app = express() 
var cookieParser = require('cookie-parser'); 
const bodyParser = require('body-parser');
require('dotenv-safe').config() 
var jwt = require('jsonwebtoken')

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser()); 

app.get('/', (req, res, next) => {
    res.json({message: "Tudo ok por aqui!"});
})

app.get('/client', verifyJWT, (req, res, next) => { 
    console.log("Returning client");
    res.json([{id:1,nome:'luiz'}]);
})

function verifyJWT(req, res, next){
    var token = req.headers['x-access-token']

    if(!token) return res.status(401).json({auth: false, message: 'no token provided'})

    jwt.verify(token, process.env.SECRET, (err, decoded) => {

        if(err) return res.status(500).json({auth: false, message: 'failed to authenticate'})

        res.userId = decoded.id 

        next()
    })
}

// authentication 
app.post('/login', (req, res, next) => {
    if(req.body.user === "luiz" && req.body.pwd === '123') {
        //autorization is ok
        const id = 1
        var token = jwt.sign({ id }, process.env.SECRET, {
            expiresIn: 300 //expires in 5min
        })
        return res.json({auth: 1, token: token})
    }
    res.status(500).json({message: 'something went wrong'})
})

//logout 
app.post('/logout', (res, req, next) => {
   res.json({auth: false, token: null}) 
})

var server = http.createServer(app); 
server.listen(3000);
console.log('Running server on port 3000')
