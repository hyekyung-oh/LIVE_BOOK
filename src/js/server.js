const express = require("express"); // npm i express | yarn add express
const cors    = require("cors");    // npm i cors | yarn add cors
const mysql   = require("mysql2");   // npm i mysql2 | yarn add mysql2
const app     = express();
const PORT    = 4000; // 포트번호 설정
const fs = require('fs');

// MySQL 연결.
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

// post 요청 시 값을 객체로 바꿔줌.
app.use(express.urlencoded({ extended: true })) 

// 서버 연결 시 발생함.
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

// 모든 책 정보에 대해 데이터를 db로 부터 가져옴.
app.get("/api/book", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    
    const sqlQuery = "select * from team3_Books";

    db.query(sqlQuery, (err, result) => {
        if(err) throw err;
        return res.send(result);
    });
});

// 한 책에 대한 이미지 주소를 가져옴.
app.get("/play/", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    
    // const paramValue = req.params.param; // URL 파라미터 값 가져오기
    const paramValue = req.param('id');

    const sqlQuery = "SELECT * FROM team3_Imgs_Pages WHERE team3_BooksID = ?";
    
    const values = [paramValue]; // 동적인 값

    db.query(sqlQuery, values, (err, result) => {
        if (err) throw err;
        return res.send(result);
    });
});

// 한 책에 대한 모든 정보를 가져옴.
app.get("/api/bookinfo/", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    
    // /api/bookinfo?BookID=1 같은 형식
    const paramValue = req.param('BookID'); // URL 파라미터 값 가져오기

    const sqlQuery = "SELECT * FROM team3_Books WHERE team3_BooksID = ?";
    
    const values = [paramValue]; // 동적인 값

    db.query(sqlQuery, values, (err, result) => {
        if (err) throw err;
        return res.send(result);
    });
});

// 브금 리스트의 폴더 경로를 반환한다.
app.get("/bgm/", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    
    // const paramValue = req.params.param; // URL 파라미터 값 가져오기
    
    const paramValue = req.param('mood');

    let folderPath = "";
    
    if (paramValue === "sad") {
        folderPath = '../../public/bgm/슬픔/';
        
    } else if (paramValue === "happy") {
        folderPath = '../../public/bgm/행복/';
    } else if (paramValue === "scary") {
        folderPath = '../../public/bgm/공포/';
    } else if (paramValue === "nervous") { 
        folderPath = '../../public/bgm/긴장/';
    } else if (paramValue === "slience") { 
        folderPath = '../../public/bgm/고요/';
    } else if (paramValue === "exciting") { 
        folderPath = '../../public/bgm/신남/';
    } else if (paramValue === "fail") { 
        folderPath = '../../public/bgm/실패/';
    } else if (paramValue === "mystery") { 
        folderPath = '../../public/bgm/신비/';
    }

    fs.readdir(folderPath, (err, files) => {
        if (err) {
          console.error('폴더를 읽을 수 없습니다:', err);
          return;
        }
      
        const bgmFiles = files.map(file => folderPath + file);
      
        res.send(bgmFiles);
    });
});