import MediaCard from "./Card"
import { useState, useEffect } from "react"
import "../css/SearchBookList.css"
import { memo } from "react";
import PropTypes from "prop-types"

// 검색된 책 리스트를 출력하기 위한 컴포넌트
const SearchBookList = memo(({text}) => {

    const [books, setBooks] = useState([]);
    
    // 모든 책 정보를 가져와 setBooks로 json 형식을 이용해 넣어줌.
    const getBooks = async () => {
        const json = await (
            await fetch(
                "http://localhost:4000/api/book")
        ).json();
        setBooks(json);
    }

    // 검색어를 필러 함수를 통해 뛰어쓰기, 대소문자 구문 없이 만들어줌.
    const filterTitle = books.filter((p) => {
        return p.team3_BooksTitle.replace(" ","").toLocaleLowerCase().includes(text.toLocaleLowerCase().replace(" ",""))
    })

    useEffect(()=>{
        getBooks();
    },[])
    
    return (
        <div className="card_book">
                {filterTitle.map(book =>
                <div key={book.team3_BooksID}>
                <MediaCard variant="outlined" id = {book.team3_BooksID} title = {book.team3_BooksTitle} 
                author={book.team3_Books_author} genre={book.team3_Books_genre}
                thumnail={book.team3_Books_Thumnail}/>
                </div>
                )}
        </div>
    );
});

SearchBookList.propTypes ={
    text : PropTypes.string.isRequired,
}

export default SearchBookList;