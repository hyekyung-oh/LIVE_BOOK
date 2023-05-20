const express = require("express"); // npm i express | yarn add express
const cors    = require("cors");    // npm i cors | yarn add cors
const mysql   = require("mysql2");   // npm i mysql2 | yarn add mysql2
const app     = express();
const PORT    = 4000; // 포트번호 설정

// MySQL 연결
const db = mysql.createPool({
    host:'selab.hknu.ac.kr',
    port:'51714',
    user:'pbl3_team3',
    password:'12345678',
    database:'2023_pbl3',
});

app.use(cors({
    origin: "*",                // 출처 허용 옵션
    credentials: true,          // 응답 헤더에 Access-Control-Allow-Credentials 추가
    optionsSuccessStatus: 200,  // 응답 상태 200으로 설정
}))

// post 요청 시 값을 객체로 바꿔줌
app.use(express.urlencoded({ extended: true })) 

// 서버 연결 시 발생
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

app.get("/api/book", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    
    const sqlQuery = "select * from team3_Books";

    db.query(sqlQuery, (err, result) => {
        if(err) throw err;
        return res.send(result);
    });
});
// app.get("/api/book/")