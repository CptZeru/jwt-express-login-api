require('dotenv').config()
const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.json());

checkToken = (req) => {
    try {
        const decoded = jwt.verify(req.header('Token'), process.env.APP_JWT_SECRET);
        if (decoded) {
            req.jwtProcess = {
                status : true,
                payload : decoded
            }
            return req
        } else {
            req.jwtProcess = {
                status : false
            }
            return req
        }
    } catch(err) {
        req.jwtProcess = {
            status : false
        }
        return req
    }
}

generateToken = (data) => {
    return jwt.sign(data, process.env.APP_JWT_SECRET,{
        expiresIn: 60000 // expires in 1 minute
     });
}

app.get('/ask/session', (req, res) => {
    let statusConn = checkSession(req.header('Session'))
    res.statusCode = 200
    res.json({
        code: 200,
        message: "success",
        data: {
            session: 'abc123'
        }
    })
});
app.post('/login', (req, res) => {
    console.log(req.body);
    if (req.body.email === 'jeruk@legacy.co.id' && req.body.password === '12345678'){
        const user = {
            email : req.body.email
        }
        res.statusCode = 201
        res.json({
            code: 201,
            message: "success",
            data: {
                token: generateToken(user)
            }
        })
    } else {
        res.statusCode = 404
        res.json({
            code: 404,
        })
    }
 });
 app.get('/book', (req, res) => {
    let processedReq = checkToken(req)
    if (processedReq.jwtProcess.status) {
        res.statusCode = 200
        res.json({
            code: 200,
            message: "success",
            data: processedReq.jwtProcess.payload
        })
    } else {
        res.statusCode = 404
        res.json({
            code: 404,
        })
    }
});
app.get('/ping', (req, res) => {
    res.statusCode = 200
    res.json({
        code: 200,
        message: "PING! PING! PING!"
    })
 });
app.listen(process.env.APP_PORT || 3000)
console.log(`App Run on URL : http://localhost:${process.env.APP_PORT}`)