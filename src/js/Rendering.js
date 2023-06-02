import { useState, useEffect } from 'react';
import axios from 'axios';
import logos from './logodata';
import "../css/Render.css";
import { Link } from 'react-router-dom';

const Render=() => {
    const BookID = window.location.href.split("=")[1];
    const { out, ham, back, play, stop, forward, volume, speed } = logos;

    // 상태값 
    const [clicks, setClicks] = useState({
        volumeclick: true,
        speedclick: true,
        hamclick: false,
        isMouseMoving: false,
        opacity: 1, // 투명도 조절//
        delay: 2000, // 딜레이 상태 추가
        playing: true,
        contents: [], // 텍스트 상태 추가
        page: 1,
        img_path: "",
        final_page:1,
        state:1,
    });

    
    const { volumeclick, speedclick, hamclick, isMouseMoving,
         opacity, delay, playing, contents, page ,img_path,final_page,state } = clicks;
    
    // 플라스크로 연 서버로부터 json파일을 불러옴
    useEffect(() => {
        axios
            .get(`http://localhost:4000/play/${BookID}`)
            .then((response) => {
                const text = response.data[page - 1]["team3_text"];
                const slicedText = text.split("\n"); // 개행 문자를 기준으로 텍스트를 자름
                setClicks(prevState => ({
                    ...prevState,
                    
                    contents: slicedText,
                    img_path: "temp/"+response.data[page-1]["team3_imgPath"]
                    .split("temp/")[1].split("/")[0]+"/"+response.data[page-1]["team3_imgPath"]
                    .split("temp/")[1].split("/")[0]+"_"+response.data[page-1]["team3_imgPath"]
                    .split(response.data[page-1]["team3_imgPath"].split("temp/")[1].split("/")[0]+"/")[1],
                    final_page: response.data[response.data.length-1]["team3_page_number"] - response.data[0]["team3_page_number"] +1,
                    state: page/final_page*100
                }));
            });
    }, [page]); // end useEffect()

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
        if(page < final_page){
            setClicks(prevState => ({
                ...prevState,
                page: prevState.page + 1,
                state: (page+1)/final_page*100
            }));
            
        } else{
            alert("마지막 페이지 입니다.")
        }
    };
    const beforePage = () => {
        if (page > 1) {
            setClicks(prevState => ({
                ...prevState,
                page: prevState.page - 1,
                state: (page)/final_page*100
            }));
        } else{
            alert("첫 페이지 입니다.")
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
                <div>
                <button id='playbgm' onClick={playBgm}>
                    {bgm ? '음악 정지' : '음악 재생'}
                </button>
                </div>
    return (
        <div className={"divRender"}>
            <div className={hamclick ? 'div_top_Click' : 'div_top_UnClick'}>
                <Link to={"/"}>
                    <input type={"image"} id={"out"} src={out} alt="out" style={{ opacity: isMouseMoving ? 1 : opacity }}/>
                </Link>
                <input type={"image"} id={"ham"} src={ham} alt="tag" onClick={handleClick} style={{ opacity: isMouseMoving ? 1 : opacity }}/>
            </div>
            <div className={hamclick ? "div_bottom_Click" : "div_bottom_UnClick"}>
                {/* set background-image */}
                <div id={"main"} style={{backgroundImage: `url("${img_path}")` , opacity: 0.8}}></div>
                
                {/* 진행률 상태바 */}
                <div className={"divbox"} style={{ opacity: isMouseMoving ? 1 : opacity }}>
                    <div className={"playbarBox"}> 
                        <section id={hamclick ? "playbar_Click" : "playbar_UnClick"}>
                            <div id={"controlPlaybar"} style={{width: state+"%"}}></div>
                        </section>
                    </div>
                    <div className={"settingBox"}>
                        <div id={hamclick ? "settingbar_Click" : "settingbar_UnClick"}>
                            {/* 한 페이지 이전으로 넘기기 */}
                            <div><input type={"image"} id={"backward"} src={back} alt="back" onClick={beforePage} /></div>
                            {/* 재생 / 일시정지 */}
                            <div><input type={"image"} id={"play"} src={playing ? play : stop} alt="play" onClick={playClick}/></div>
                            {/* 한 페이지 다음으로 넘기기 */}
                            <div><input type={"image"} id={"forward"} src={forward} alt="forward" onClick={nextPage} /></div>
                            {/* 배속 조절 */}
                            <div><input type={"image"} id={"speed"} src={speed} alt="speed" onClick={speedhandle}/></div>
                                
                            {/* 볼륨 조절 */}
                            <div><input type={"image"} id={"volume"} src={volume} alt="volume" onClick={volumehandle}/></div>
                            
                        </div>
                    </div>
                        <div className={speedclick ? "" : ( hamclick ? "control_speed_Click" : "control_speed")} ></div>
                        <div className={volumeclick ? "" :( hamclick ? "control_volume_Click" : "control_volume")} ></div> 
                </div>
            </div>
            <div className={hamclick ? "div_right_Click" : "" }>
                 {/* 본문 내용 출력부 */}
                 <div id={hamclick ? "contents" : ""} style={{ opacity: hamclick ? 1 : 0 }}>
                    <div id={"contents_text"} style={{ overflow: "auto" }}>
                    {/* 배열로 된 텍스트를 맵 함수를 사용하여 출력 */}
                    {contents.map((text, index) => (
                            <span key={index}>{text}<br /></span>
                    ))}
                    </div>

                    <div id={"contents_page"}>{page} / {final_page}</div> 
                </div>
            </div>            
        </div>
    );
};

export default Render;