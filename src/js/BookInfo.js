import React, { useState, useEffect } from "react";
import "../css/BookInfo.css"

const BookInfo = (props) => {
    const {id} = props;

    const [book, setBook] = useState([]);

    const getBook = async () => {
        const json = await (
            await fetch(
                "http://localhost:4000/api/bookinfo?BookID="+id)
        ).json();
        setBook(json);
    }
    useEffect(()=>{
        getBook();
    },[])

    return (
        <>
            {book.map(info =>
                <div style={{border:"2px solid black"}}>
                    <div>
                        <img src={info.team3_Books_Thumnail.substr(10)} 
                        style={{width: "43vw", height: "40vh", display:"inline",objectFit:"contain", marginTop:"1vh"}} />
                    </div>
                    <div style={{height:"40vh", marginTop:"1vh"}}>
                        {/* 왼쪽 창 */}
                        <div className={"left"} style={{ height:"40vh",width:"12vw",position:"absolute"}}>
                            <div>제목</div>
                            <div>저자</div>
                            <div>장르</div>
                            <div>책 소개</div>
                        </div>
                        {/* 오른쪽 창 */}
                        <div className={"right"} style={{ height:"40vh", marginLeft:"12vw"}}>
                            <div>{info.team3_BooksTitle}</div>
                            <div>{info.team3_Books_author}</div>
                            <div>{info.team3_Books_genre}</div>
                            <div>{info.team3_BooksInfo}</div>
                        </div>
                    </div>
                </div>
                )}
            
        </>
    );
}

export default BookInfo;