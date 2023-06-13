// import { useState } from 'react'
import React from 'react';
import { SearchModalBox, SearchModalContent } from './Modal.tsx'
import BookInfo from './BookInfo.js'
import { Link } from 'react-router-dom'

import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const Modal = (props) => {
  	// 전달받은 state 함수
    const clickModal = props.clickModal;
    const {id} = props.id    
    
    return (  
      	// 뒷배경을 클릭하면 모달을 나갈 수 있게 해야하므로 뒷 배경 onClick에 state함수를 넣는다.
        <SearchModalBox onClick={clickModal}>
            {/* 나가기 버튼 구역 */}
            <SearchModalContent onClick={(e) => e.stopPropagation()}>
                <div style={{width: "100%"}}>
                    <Button sx={{float: "right"}} onClick={clickModal}>
                        <CloseIcon color="action" sx={{fontSize: 30, display: "flex", alignItems: "center"}} />
                    </Button>
                </div>
            {/* 책 정보 구역 */}
            <BookInfo id={id} />
                {/* 재생하기 버튼 구역 */}
                <div style={{width: "100%", paddingTop: "15px"}}>
                    <Link to={`/Render?id=${id}`} style={{ textDecoration: "none" }}>
                        <Button variant="contained" aria-label="play" size="large" color="primary"
                                sx={{fontFamily: "'Noto Sans KR', sans-serif", fontSize: 28}}>재생하기
                            <PlayCircleOutlineIcon sx={{fontSize: 55, display: "flex", alignItems: "center", color: "white"}} />
                        </Button>
                    </Link>
                </div>
            </SearchModalContent>
        </SearchModalBox>
    )
}

export default Modal
