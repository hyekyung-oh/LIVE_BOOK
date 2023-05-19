import MediaCard from "./Card"
import { useState, useEffect } from "react"
import "../css/SearchBookList.css"
import { memo } from "react";
import PropTypes from "prop-types"


const SearchBookList = memo(({text,option}) => {

    

    const [books, setBooks] = useState([]);
    
    const getBooks = async () => {
        const json = await (
            await fetch(
                "http://localhost:4000/api/book")
        ).json();
        console.log(json[0])
        setBooks(json);

    }

    const filterTitle = books.filter((p) => {
        return p.team3_BooksTitle.replace(" ","").toLocaleLowerCase().includes(text.toLocaleLowerCase().replace(" ",""))
    })

    useEffect(()=>{
        getBooks();
    },[])
    
    return (
        <div className="card_book">
                {filterTitle.map(book =>
                <div style={{padding:"4px"}}>
                <MediaCard id = {book.team3_BooksID} title = {book.team3_BooksTitle} author={book.team3_Books_author} genre={book.team3_Books_genre}/>
                </div>
                )}
        </div>
    );
});

SearchBookList.PropTypes ={
    text : PropTypes.string.isRequired,
    option : PropTypes.string.isRequired,
}

export default SearchBookList;