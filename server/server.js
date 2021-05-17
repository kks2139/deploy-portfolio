const doQuery = require('./config/db');
const helper = require('./helper');       // pw 암호화
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const csrfProtection = csrf({ cookie: true });
const express = require('express');     // express = nodeJS 서버관리 모듈
const app = express();                  // app 변수로 서버관리
const PORT = process.env.PORT || 4000;  // 포트설정

app.use(express.json());                // 앞단의 파라미터를 받게 해준다 (req.body.값이름)
app.use(express.urlencoded( {extended : false } ));
app.use(cookieParser());

// 요청 시간기록, csrf미들웨어, 토큰요청이면 토큰값 화면으로 넘겨줌 or 다음 미들웨어로 넘김
app.use(helper.logger, csrfProtection, helper.tokenPass);

// 현재경로(server.js) 에서 node server.js 를 입력해 서버실행. 
app.listen(PORT, (req, res) => {                // 해당 포트번호로 서버실행
    console.log(`Server On : http://localhost:${PORT}/`);
});

app.get('/api', (req, res) => { 
    res.send({test : "test api"});
});

app.post('/api/login', (req, res)=>{
    req.body.pw = helper.encrypt(req.body.pw);
    doQuery('getUser', req.body).then( obj =>{
        const result = {
            error : obj.error ? "Error occured." : "",
            rows : obj.rows
        }
        res.send(result);
    });
});

app.post('/api/signup', (req, res)=>{
    doQuery('getUser', req.body).then( user =>{
        if(user.rows.length > 0){
            res.send({error : "exist"});
        }else{
            req.body.pw = helper.encrypt(req.body.pw);
            doQuery('signup', req.body).then( obj =>{
                const result = {
                    error : obj.error ? "Error occured." : "",
                    rows : obj.rows
                }
                res.send(result);
            })
        }
    });
})

app.post('/api/getRankList', (req, res) => { 
    doQuery('getRankList', req.body).then( obj =>{
        const result = {
            error : obj.error ? "Error occured." : "",
            rows : obj.rows
        }
        res.send(result);
    });
});

app.post('/api/saveScore', (req, res) => { 
    doQuery('saveScore', req.body).then( obj =>{
        const result = {
            error : obj.error ? "Error occured." : "",
            rows : obj.rows
        }
        res.send(result);
    });
});

app.post('/api/getHistory', (req, res) => { 
    doQuery('getHistory', req.body).then( obj =>{
        const result = {
            error : obj.error ? "Error occured." : "",
            rows : obj.rows
        }
        res.send(result);
    });
});

app.post('/api/getTopRanker', (req, res) => { 
    doQuery('getTopRanker', req.body).then( obj =>{
        const result = {
            error : obj.error ? "Error occured." : "",
            rows : obj.rows
        }
        res.send(result);
    });
});

app.post('/api/getKeySet', (req, res) => { 
    doQuery('getKeySet', req.body).then( obj =>{
        const result = {
            error : obj.error ? "Error occured." : "",
            rows : obj.rows
        }
        res.send(result);
    });
});

app.post('/api/saveKeySet', (req, res) => { 
    doQuery('saveKeySet', req.body).then( obj =>{
        const result = {
            error : obj.error ? "Error occured." : "",
            rows : obj.rows
        }
        res.send(result);
    });
});

app.post('/api/getTheme', (req, res) => { 
    doQuery('getTheme', req.body).then( obj =>{
        const result = {
            error : obj.error ? "Error occured." : "",
            rows : obj.rows
        }
        res.send(result);
    });
});

app.post('/api/saveTheme', (req, res) => { 
    doQuery('saveTheme', req.body).then( obj =>{
        const result = {
            error : obj.error ? "Error occured." : "",
            rows : obj.rows
        }
        res.send(result);
    });
});

// 에러 처리
app.use(function (err, req, res, next) {
    debugger;
    if (err.code === 'EBADCSRFTOKEN'){
        res.status(403);
        res.send('Bad request.');
    }else{
        return next(err);
    }
  })