import { useState, useEffect } from 'react';
import axios from 'axios';
import logos from './logodata';

import "../css/Render.css";

const Render=() => {
    const { out, ham, back, play, stop, forward, book, volume, speed } = logos;

    // 상태값 
    const [clicks, setClicks] = useState({
        volumeclick: true,
        speedclick: true,
        hamclick: false,
        isMouseMoving: false,
        opacity: 1, // 투명도 조절//
        delay: 2000, // 딜레이 상태 추가
        playing: true,
        contents: "", // 텍스트 상태 추가
        page: 1
    });

    const { volumeclick, speedclick, hamclick, isMouseMoving, opacity, delay, playing, contents, page } = clicks;
    
    // 플라스크로 연 서버로부터 json파일을 불러옴
    useEffect(() => {
        axios
            .get(`http://223.222.16.248:5001/page/${page}`)
            .then((response) => {
                console.log(response.data['contents']);
                setClicks(prevState => ({
                    ...prevState,
                    contents: response.data['contents']
                }));
            });
    }, [page, hamclick]); // end useEffect()

    // 이벤트 핸들링
    useEffect(() => {

        // 변수
        let timeid;

        const handleMouseMove = () => {
            setClicks(prevState => ({
                ...prevState,
                isMouseMoving: true,
                opacity: 1
            }));

            clearTimeout(timeid);
            timeid = setTimeout(() => {
                setClicks(prevState => ({
                    ...prevState,
                    isMouseMoving: false,
                    opacity: 0.1
                }));
                if (delay === 5000) {
                    setClicks(prevState => ({
                        ...prevState,
                        delay: 2000
                    }));
                  }
            }, delay);
        };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        clearTimeout(timeid);
        };
    }, [delay]); // end useEffect()

    const nextPage = () => {
        setClicks(prevState => ({
            ...prevState,
            page: prevState.page + 1
        }));
    };

    const beforePage = () => {
        if (page > 0) {
            setClicks(prevState => ({
                ...prevState,
                page: prevState.page - 1
            }));
        }
    };

    const volumehandle = () => {
        setClicks(prevState => ({
            ...prevState,
            volumeclick: !prevState.volumeclick
        }));
    };

    const speedhandle = () => {
        setClicks(prevState => ({
            ...prevState,
            speedclick: !prevState.speedclick
        }));
    };

    const handleClick = () => {
        setClicks(prevState => ({
            ...prevState,
            hamclick: !prevState.hamclick
        }));
        if (delay === 2000 && !hamclick) {
            setClicks(prevState => ({
                ...prevState,
                delay: 5000
            }));
        }
    };
    
    const playClick = () => {
        setClicks(prevState => ({
            ...prevState,
            playing: !prevState.playing
        }));
    };

    return (
        <div className={"divRender"}>
            <div className={hamclick ? 'div_top_Click' : 'div_top_UnClick'}>
                <input type={"image"} id={"out"} src={out} alt="out" style={{ opacity: isMouseMoving ? 1 : opacity }}/>
                <input type={"image"} id={"ham"} src={ham} alt="tag" onClick={handleClick} style={{ opacity: isMouseMoving ? 1 : opacity }}/>
            </div>
            <div className={hamclick ? "div_bottom_Click" : "div_bottom_UnClick"}>
                {/* set background-image */}
                <div id={"main"} ></div>
                {/* 진행률 상태바 */}
                <div className={"divbox"} style={{ opacity: isMouseMoving ? 1 : opacity }}>
                    <div className={"playbarBox"}> 
                        <section id={"playbar"}>
                            <div id={"controlPlaybar"}></div>
                        </section>
                    </div>
                    <div className={"settingBox"}>
                        <div id={"settingbar"}>
                            {/* 한 페이지 이전으로 넘기기 */}
                            <div><input type={"image"} id={"backward"} src={back} alt="back" onClick={beforePage} /></div>
                            {/* 재생 / 일시정지 */}
                            <div><input type={"image"} id={"play"} src={playing ? play : stop} alt="play" onClick={playClick}/></div>
                            {/* 한 페이지 다음으로 넘기기 */}
                            <div><input type={"image"} id={"forward"} src={forward} alt="forward" onClick={nextPage} /></div>
                            {/* 책 아이콘 */}
                            <div><input type={"image"} id={"book"} src={book} alt="book" /></div>
                            {/* 볼륨 조절 */}
                            <div><input type={"image"} id={"volume"} src={volume} alt="volume" onClick={volumehandle}/></div>
                                <div className={volumeclick ? "" : "control_volume"} ></div> 
                            {/* 배속 조절 */}
                            <div><input type={"image"} id={"speed"} src={speed} alt="speed" onClick={speedhandle}/></div>
                                <div className={speedclick ? "" : "control_speed"} ></div>
                        </div>
                    </div>
                </div>
                <div className={"Ofpages"} style={{opacity: isMouseMoving ? 1 : opacity }}>
                    <div id={"page"}>10</div>
                    <div id={"pages"}>20</div>
                </div>
            </div>
            <div className={hamclick ? "div_right_Click" : "" }>
                 {/* 본문 내용 출력부 */}
                 <div id={hamclick ? "contents" : ""} style={{ opacity: hamclick ? 1 : 0 }}>{contents} <br></br> <br></br> {page}페이지</div>
            </div>            
        </div>
    );
};

export default Render;