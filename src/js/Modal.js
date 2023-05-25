// import { useState } from 'react'
import { SearchModalBox, SearchModalContent } from './Modal.tsx'
import BookInfo from './BookInfo.js'
import { Link } from 'react-router-dom'

const Modal = (props) => {
  	// 전달받은 state 함수
    const clickModal = props;
    const {id} = props.id    
    
    return (
      	// 뒷배경을 클릭하면 모달을 나갈 수 있게 해야하므로 뒷 배경 onClick에 state함수를 넣는다.
        <SearchModalBox onClick={clickModal}>
            <SearchModalContent onClick={(e) => e.stopPropagation()}>
                
            <BookInfo id={id} />
                <div style={{marginTop:"2vh"}}>
                    <button>
                        <Link to={`/Render?id=${id}`}>더보기</Link>
                    </button>
                    <button onClick={clickModal}>뒤로가기</button>
                </div>
            </SearchModalContent>
        </SearchModalBox>
    )
}

export default Modal
