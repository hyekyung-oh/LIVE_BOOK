import React, { useState, useEffect } from "react";


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
                <>
                    
                    <img src={info.team3_Books_Thumnail.substr(10)} 
                    style={{width: "30vw", height: "40vh"}} />
                    <>
                        <div className={"Left"} style={{float:"left", width:"5vw"}}>
                            <div>제목</div>
                            <div>저자</div>
                            <div>장르</div>
                            <div>책 정보</div>
                        </div>
                        <div className={"right"} style={{float:"right", width:"10vw"}}>
                            <div>{info.team3_BooksTitle}</div>
                            <div>{info.team3_Books_author}</div>
                            <div>{info.team3_Books_genre}</div>
                            <div>{info.team3_BooksInfo}</div>
                        </div>
                    </>
                    
                    
                </>
                )}
            
        </>
    );
}

export default BookInfo;