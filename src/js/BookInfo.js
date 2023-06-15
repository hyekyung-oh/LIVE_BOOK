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
                <div id="allside" key={info.team3_BooksID}>
                    {/* leftside는 책의 썸네일이 담긴 부분 */}
                    <div id="leftside">
                        <img src={info.team3_Books_Thumnail.substr(10)} 
                        style={{width: "300px", height: "390px", objectFit:"contain"}} />
                    </div>
                    {/* rightside는 책의 정보가 담긴 부분 */}
                    <div id="rightside">
                        {/* rightside의 top은 책 제목, 저자, 장르가 담긴 부분 */}
                        <div id="top">
                            <div className="top-div">
                                <div id="title">제목</div> 
                                <div id="booktitle">{info.team3_BooksTitle}</div>
                            </div>
                            <div className="top-div">
                                <div id="author">저자</div> 
                                <div id="bookauthor">{info.team3_Books_author}</div>
                            </div>
                            <div className="top-div">
                                <div id="genre">장르</div> 
                                <div id="bookgenre">{info.team3_Books_genre}</div>
                            </div> 
                        </div>
                        {/* middle은 rightside의 top과 bottom을 구분하는 구분선으로 쓰임 */}
                        <div id="middle"></div>
                        {/* rightside의 bottom은 책 소개가 담긴 부분 */}
                        <div id="bottom">
                            <div id="info">책 소개</div>
                            <div id="bookinfo">{info.team3_BooksInfo}</div>
                        </div>
                    </div>
                    
                </div>
                )}
            
        </>
    );
}

export default BookInfo;