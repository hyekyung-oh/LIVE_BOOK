import out from '../logo/out.jpg';
import ham from '../logo/hambuger.jpg';
import back from '../logo/backward.jpg';
import play from '../logo/play.jpg';
import forward from '../logo/forward.jpg';
import book from '../logo/book.jpg';
import volume from '../logo/volume.jpg';
import speed from '../logo/speed.png';
import stop from '../logo/stop.jpg';
import "../css/Render.css";
import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';
import { useLocation } from 'react-router-dom';

const Render=() => {
    // 상태값 
    const [volumeClick,setVolume] = useState(true)
    const [speedClick,setSpeed] = useState(true)
    const [hamclickd,sethamClicked] = useState(false);
    const [isMouseMoving, setIsMouseMoving] = useState(false);
    const [opacity, setOpacity] = useState(1);
    const [delay, setDelay] = useState(2000); // 딜레이 상태 추가
    const [playing,setPlaying] = useState(true);
    const [contents, setContents] = useState(''); // 텍스트 상태 추가
    const [page, setPage] = useState(1);
    
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    //플라스크로 연 서버로부터 json파일을 불러옴
    useEffect(() => {
        axios
            .get(`http://localhost:4000/play/${id}`)
            .then((response) => {
                console.log(response.data[page]);
                setContents(response.data[page]);
            });
    }, [page]);

    // 변수
    let timeid;

    // 이벤트 핸들링
    useEffect(() => {
        const handleMouseMove = () => {
            setIsMouseMoving(true);
            setOpacity(1);
            clearTimeout(timeid);
            timeid = setTimeout(() => {
                setIsMouseMoving(false);
                setOpacity(0.1);
                if (delay === 5000) {
                    setDelay(2000);
                  }
            }, delay);
        };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        clearTimeout(timeid);
        };
    }, [delay]);

    const nextPage = () => {
        setPage(page + 1);
    };

    const beforePage = () => {
        if (page > 0) {
        setPage(page - 1);
        }
    }

    const volumehandle = () => {
        setVolume(!volumeClick);
    };

    const speedhandle = () => {
        setSpeed(!speedClick);
    };

    const handleClick = () => {
        sethamClicked(!hamclickd);
        if(delay === 2000 & !hamclickd){
            setDelay(5000);
        }
    };

    const playClick = () => {
        setPlaying(!playing);
    }

    return (
        <div class={"divmom"}>
            <div class={hamclickd ? 'dived1' : 'div1'}>
                <input type={"image"} id={"out"} src={out} alt="out"
                style={{ opacity: isMouseMoving ? 1 : opacity }}/>
                <input type={"image"} id={"ham"} src={ham} alt="tag" 
                onClick={handleClick} style={{ opacity: isMouseMoving ? 1 : opacity }}/>
            </div>
            <div class={hamclickd ? "dived2" : "div2"}>
                <div id={"main"} ></div>
                <div class={"divbox"} style={{ opacity: isMouseMoving ? 1 : opacity }}>
                    <div class={"div3"}>
                        <section id={"bar"}>
                            <div id={"controllbar"}></div>
                        </section>
                    </div>
                    <div class={"div4"}>
                        <div id={"setting"}>
                        {/* 한 페이지 뒤로 넘기기 */}
                        <div><input type={"image"} id={"backward"} src={back} alt="back" onClick={beforePage} /></div>
                            <div><input type={"image"} id={"play"} src={playing ? play : stop} alt="play" 
                                onClick={playClick}/></div>
                            
                            {/* 한 페이지 넘기기버튼 */}
                            <div><input type={"image"} id={"forward"} src={forward} alt="forward" onClick={nextPage} /></div>
                            <div><input type={"image"} id={"book"} src={book} alt="book" /></div>
                            <div><input type={"image"} id={"volume"} src={volume} alt="volume" onClick={volumehandle}/></div>
                                <div class={volumeClick ? "" : "container_volume"} ></div>           
                            <div><input type={"image"} id={"speed"} src={speed} alt="speed" onClick={speedhandle}/></div>
                                <div class={speedClick ? "" : "container_speed"} ></div>
                        </div>
                    </div>
                </div>
                <div class={"Ofpages"} style={{opacity: isMouseMoving ? 1 : opacity }}>
                    <div id={"page"}>10</div>
                    <div id={"pages"}>20</div>
                </div>
            </div>
            <div class={hamclickd ? "dived3" : "" }>
                 {/* 본문 내용 출력부 */}
                 <div id={hamclickd ? "contents" : ""} 
                      style={{ opacity: hamclickd ? 1 : 0 }}>
                    {contents['team3_text']}{contents['team3_page_number']}
                  <br></br> <br></br> 
                  {page}
                  페이지</div>
            </div>            
        </div>
    );
};

export default Render;