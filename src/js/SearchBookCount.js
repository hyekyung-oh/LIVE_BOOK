import { useState, useEffect } from "react"
import { memo } from "react";
import PropTypes from "prop-types"

const SearchBookCount =memo(({text, option})=>{

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
        <div style={{fontSize:"30px"}}>
            {filterTitle.length ?
            <span>검색결과 : {filterTitle.length} 개</span>
            : <span>검색결과 없음</span>
            }
        </div>
    );
});

SearchBookCount.PropTypes = {
    text : PropTypes.string.isRequired,
    option : PropTypes.string.isRequired,
}

export default SearchBookCount;