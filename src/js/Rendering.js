import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/Render.css";
import { Link } from 'react-router-dom';

// icon 모음
import FastRewindRoundedIcon from '@mui/icons-material/FastRewindRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import FastForwardRoundedIcon from '@mui/icons-material/FastForwardRounded';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded';
import SlowMotionVideoRoundedIcon from '@mui/icons-material/SlowMotionVideoRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

const Render=() => {
    const BookID = window.location.href.split("=")[1];
    const synthRef = React.useRef(window.speechSynthesis);

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
         opacity, delay, playing, contents, page ,img_path,final_page,state, tense } = clicks;
    
    //서버로부터 json파일을 불러옴
    useEffect(() => {
        axios
            .get(`http://localhost:4000/play/${BookID}`)
            .then((response) => {
                const Tense = response.data[page-1]["team3_textTense"];
                console.log(Tense)
                const text = response.data[page - 1]["team3_text"];
                const slicedText = text.replace(/\. /g, '.\n\n')
                                        .replace(/\? /g, '?\n\n')
                                        .replace(/! /g, '!\n\n')
                                        .split("\n"); // 개행 문자를 기준으로 텍스트를 자름
                setClicks(prevState => ({
                    ...prevState,
                    
                    contents: slicedText,
                    img_path: "temp/"+response.data[page-1]["team3_imgPath"]
                    .split("temp/")[1].split("/")[0]+"/"+response.data[page-1]["team3_imgPath"]
                    .split("temp/")[1].split("/")[0]+"_"+response.data[page-1]["team3_imgPath"]
                    .split(response.data[page-1]["team3_imgPath"].split("temp/")[1].split("/")[0]+"/")[1],
                    final_page: response.data[response.data.length-1]["team3_page_number"] - response.data[0]["team3_page_number"] +1,
                    state: page/final_page*100,
                    tense: Tense,
                }));
                if (playing) {
                    // 말하기 시작
                    synthRef.current.cancel();
                    const utterance = new SpeechSynthesisUtterance(slicedText);
                    synthRef.current.speak(utterance);
                    utterance.onend = function (event) {
                        nextPage();
                    };
                }
            });
    }, [page]); // end useEffect()

    // 음악 파일 리스트를 받아온다.
    useEffect(() => {

        // 페이지 이동시 기존 음악 종료
        if (bgm && audio) {
            console.log("재생 종료!");
            audio.pause();
            setBgm(false);
          }

        let setTense = "";
        if(tense === "슬픔") {setTense = "sad";} 
        else if(tense === "고요") {setTense = "slience";}
        else if(tense === "공포") {setTense = "scary";} 
        else if(tense === "긴장") {setTense = "nervous";} 
        else if(tense === "신남") {setTense = "exciting";} 
        else if(tense === "실패") {setTense = "fail";} 
        else if(tense === "신비") {setTense = "mystery";} 
        else if(tense === "행복") { setTense = "happy";}
        axios
        .get(`http://localhost:4000/bgm/${setTense}`) // Tense 값을 사용하여 요청
        .then((response) => {

            const bgmFiles = response.data;
            console.log(bgmFiles)
            let music = "";
            let Index = Math.floor(Math.random() * bgmFiles.length);
            console.log(Index)
            music = bgmFiles[Index];
            music = music.slice(12);

            console.log(music)

            const newAudio = new Audio(music);
            newAudio.autoplay = true;
            newAudio.loop = true;
            setBgm(true);
            setAudio(newAudio);
        });
    }, [tense, page]); // end useEffect()

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
            synthRef.current.cancel();
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
            synthRef.current.cancel();
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
        if(!playing){
            synthRef.current.cancel();
            const utterance = new SpeechSynthesisUtterance(contents);
            synthRef.current.speak(utterance);
            utterance.onend = function(event) {
                nextPage();
            };
        }else{
            synthRef.current.cancel();
        }
        setClicks(prevState => ({
            ...prevState,
            playing: !prevState.playing
        }));
    };
    
    const [bgm, setBgm] = useState(false);
    const [audio, setAudio] = useState(null);

    const playBgm = () => {
        if (bgm && audio) {
          console.log("재생 정지!");
          audio.pause();
          setBgm(false);
        } else {
          if (audio) {
            console.log("재생 중!");
            audio.play();
            setBgm(true);
          }
        }
      };

    const movePageMusicOff = () => {
        synthRef.current.cancel();
        if(audio) {
            console.log("재생 종료!");
            audio.pause();
            setAudio(null);
        }
        else {

        }
    }

    return (
        <div className={"divRender"}>
            <div className={hamclick ? 'div_top_Click' : 'div_top_UnClick'}>
                <Link to={"/"}>
                    <LogoutRoundedIcon id={"out"} onClick={movePageMusicOff} style={{opacity: isMouseMoving ? 1 : opacity}} sx={{marginLeft: "0.5vw", fontSize: 65, color: "white", cursor: "pointer"}} />
                </Link>

                <div>
                {/* <button id='playbgm' onClick={playBgm}>
                    {bgm ? '음악 정지' : '음악 재생'}
                </button> */}
                </div>
                {/* 햄버거 버튼 */}
                <MenuRoundedIcon id={"ham"} onClick={handleClick} style={{opacity: isMouseMoving ? 1 : opacity}} sx={{fontSize: 65, color: "white", cursor: "pointer"}} />
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
                            <FastRewindRoundedIcon id={"backward"} onClick={beforePage} sx={{marginLeft: "0.5vw", fontSize: 70, color: "white", cursor: "pointer"}} />
                            
                            {/* 재생 / 일시정지 */}
                            {playing ? <PlayArrowRoundedIcon id={"play"} onClick={playClick} sx={{fontSize: 73, color: "white", cursor: "pointer"}} /> 
                            : 
                            <PauseRoundedIcon id={"play"} onClick={playClick} sx={{fontSize: 73, color: "white", cursor: "pointer"}} />}
                            
                            {/* 한 페이지 다음으로 넘기기 */}
                            <FastForwardRoundedIcon id={"forward"} onClick={nextPage} sx={{fontSize: 70, color: "white", cursor: "pointer"}} />
                            
                            {/* 배속 조절 */}
                            <SlowMotionVideoRoundedIcon id={"speed"} onClick={speedhandle} sx={{marginLeft: "2vw", marginRight: "0.5vw", fontSize: 65, color: "white", cursor: "pointer"}} />
                                
                            {/* 볼륨 조절 */}
                            {bgm ? <VolumeUpRoundedIcon id={"volume"} onClick={playBgm} sx={{fontSize: 65, color: "white", cursor: "pointer"}} /> 
                            : 
                            <VolumeOffRoundedIcon id={"volume"} onClick={playBgm} sx={{fontSize: 65, color: "white", cursor: "pointer"}} />}
                            
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