import { useState, useEffect } from "react"
import { memo } from "react";
import PropTypes from "prop-types"

// 검색된 책의 수를 보여주는 컴포넌트
const SearchBookCount =memo(({text})=>{

    const [books, setBooks] = useState([]);
    
    const getBooks = async () => {
        const json = await (
            await fetch(
                "http://localhost:4000/api/book")
        ).json();
        setBooks(json);
    }

    useEffect(()=>{
        getBooks();
    },[])

    const filterTitle = books.filter((book) => {
            return book.team3_BooksTitle.toLocaleLowerCase().includes(text.toLocaleLowerCase())}
    )
    return(
        <div style={{fontSize:"16px", color:"gray", fontFamily: 'NanumBarunGothic'}}>
            {filterTitle.length ?
            <span>검색결과 : {filterTitle.length} 개</span>
            : <span>검색결과 없음</span>
            }
        </div>
    );
});

SearchBookCount.propTypes = {
    text : PropTypes.string.isRequired,
}

export default SearchBookCount;