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


// 책 재생 컴포넌트
// 책에 대한 고유값을 가져와 그 책에 대한 이미지와 tts, bgm을 재생할 수 있다.
const Render=() => {
    // 책에 대한 고유값
    const BookID = window.location.href.split("=")[1];

    const synthRef = React.useRef(window.speechSynthesis);

    // 상태값 
    const [clicks, setClicks] = useState({
        speedclick: true, // tts 속도 조절 이벤트 함수
        hamclick: false, // 텍스트 박스 on/off 이벤트 함수
        isMouseMoving: false, // 마우스의 움직임 이벤트 감지
        opacity: 1, // 투명도 조절
        delay: 2000, // 딜레이 상태 추가
        playing: true, // 재생 여부
        contents: [], // 텍스트 상태 추가
        page: 1, // 첫 페이지
        img_path: "", // 이미지 주소
        final_page:111, // 마지막 페이지
        state:0, // 책에대한 진행률
        bgm: false, // bgm 재생 여부
        audio: null, // bgm 소리
        tense: "", // 책의 분위기
        playbackSpeed: 0.9,
        playVol: 1.0,
        playstate: 1,
    });
    
    // 상태값 정의
    const { speedclick, hamclick, isMouseMoving,
         opacity, delay, playing, contents, page, 
         img_path,final_page,state, tense, bgm, audio
         , playbackSpeed , playVol, playstate } = clicks;
    
    // tts 기능                                                     
    //서버로부터 json파일을 불러옴
    useEffect(() => {
        axios
            .get(`http://localhost:4000/play?id=${BookID}`)
            .then((response) => {
                const Tense = response.data[page-1]["team3_textTense"];
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
                    playstate: 0,
                }));
            });
    }, [page]); // end useEffect()

    //볼륨 설정기능
    useEffect(() => {
        if(playing){
            synthRef.current.pause();
            synthRef.current.volume = playVol;
            synthRef.current.rate = playbackSpeed;
            synthRef.current.resume();
        }
        // volume 또는 playbackSpeed 상태가 변경될 때마다 호출됨
    }, [playVol, playbackSpeed]);

    useEffect(() => {
        if (playing) {
            // 말하기 시작
            if(contents[playstate]){
                synthRef.current.cancel();
                const utterance = new SpeechSynthesisUtterance(contents[playstate]); 
                utterance.volume = playVol;
                utterance.rate = playbackSpeed;
                synthRef.current.speak(utterance);
                utterance.onend = function (event) {
                    if(playstate === contents.length + 1){
                        nextPage();
                    }else{
                        setClicks(prevState => ({
                            ...prevState,
                            playstate: prevState.playstate + 1,
                            state: (page)/final_page*100 + (prevState.playstate + 1)/contents.length*(1/final_page*100)
                        }));
                    }
                };
            }else{
                setClicks(prevState => ({
                    ...prevState,
                    playstate: prevState.playstate + 1,
                    state: (page)/final_page*100 + (prevState.playstate + 1)/contents.length*(1/final_page*100)
                }));
            }
        }
    }, [playstate, playing]);

    // bgm 기능
    // 음악 파일 리스트를 받아온다.
    useEffect(() => {

        if(audio){
            audio.pause();
        }
        let setTense = "";
        if(tense === "슬픔") {setTense = "sad";} 
        else if(tense === "고요") {setTense = "slience";}
        else if(tense === "공포") {setTense = "scary";} 
        else if(tense === "긴장") {setTense = "nervous";} 
        else if(tense === "신남") {setTense = "exciting";} 
        else if(tense === "실패") {setTense = "fail";} 
        else if(tense === "신비") {setTense = "mystery";} 
        else if(tense === "행복") {setTense = "happy";}
        axios
        .get(`http://localhost:4000/bgm?mood=${setTense}`) // Tense 값을 사용하여 요청
        .then((response) => {

            const bgmFiles = response.data;
            let music = "";
            let Index = Math.floor(Math.random() * bgmFiles.length);
            music = bgmFiles[Index];
            music = music.slice(12);

            const newAudio = new Audio(music);
            newAudio.autoplay = false;
            newAudio.loop = true;
            newAudio.volume = 0.4;
            setClicks(prevState => ({
                ...prevState,
                audio: newAudio,
            }));
        });
        
    }, [tense]); // end useEffect()

    useEffect(() => {
        if (bgm) {
            if(audio){
                audio.play();
            }
        } else {
          if (audio) {
            audio.pause();
          }
        }
    }, [audio]);
    // 이벤트 핸들링
    useEffect(() => {

        // 변수
        let timeid;

        // 마우스 움직임이 있을 때 이벤트
        // 투명도가 없다. -> 불투명함
        const handleMouseMove = () => {
            setClicks(prevState => ({
                ...prevState,
                isMouseMoving: true,
                opacity: 1
            }));

            // 움직임이 2초 이상 없을 시 작동 이벤트
            // 투명도를 0.1 -> 투명하게 보인다.
            clearTimeout(timeid);
            timeid = setTimeout(() => {
                setClicks(prevState => ({
                    ...prevState,
                    isMouseMoving: false,
                    opacity: 0.1
                }));
                // 딜레이 시간이 5초이면 2초로 만들어줌.
                if (delay === 5000) {
                    setClicks(prevState => ({
                        ...prevState,
                        delay: 2000
                    }));
                  }
            }, delay);
        };
    // 마우스 움직임에 대한 이벤트 핸들러
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        clearTimeout(timeid);
        };
    }, [delay]); // end useEffect()
    
    // 다음 페이지 버튼에 대한 핸들러 함수.
    const nextPage = () => {
        // 페이지가 마지막페이지가 아니면 page + 1을 하고 진행률도 업데이트
        // 페이지가 마지막페이지이면 else문 작동
        if(page < final_page){
            setClicks(prevState => ({
                ...prevState,
                page: prevState.page + 1,
                state: (page)/final_page*100,
                playstate: 100
            }));
            synthRef.current.cancel();
        } else{
            setClicks(prevState => ({
                ...prevState,
                state: 100
            }));
            alert("마지막 페이지 입니다.")
        }
    };
    // 이전 페이지 버튼에 대한 핸들러 함수.
    const beforePage = () => {
        // 페이지가 1보다 크면 page - 1을 하고 진행률 업데이트
        // 페이지가 1 미만이면 else문 작동
        if (page > 1) {
            setClicks(prevState => ({
                ...prevState,
                page: prevState.page - 1,
                state: (page)/final_page*100,
                playstate: 100
            }));
            synthRef.current.cancel();
        } else{
            alert("첫 페이지 입니다.")
        }
    };

    const speedhandle = () => {
        setClicks(prevState => ({
            ...prevState,
            speedclick: !prevState.speedclick
        }));
    };

    // 햄버거 아이콘 클릭시 이벤트 핸들러 함수.
    // hamclick : true 이면 텍스트 박스를 보여준다. 그리고 delay를 5초로 만들어줌.
    // hamclick : false이면 텍스트 박스를 가린다.
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
    
    // 재생 아이콘 클릭시 이벤트 핸들러 함수.
    // tts를 통해 책 내용을 들려줌.
    // 재생과 중지 기능이 있다.
    const playClick = () => {
        if(playing){
            synthRef.current.cancel();
        }
        setClicks(prevState => ({
            ...prevState,
            playing: !prevState.playing
        }));
    };

    // 소리 아이콘 클릭 시 이벤트 핸들러 함수.
    // bgm 소리를 출력해줌.
    const playBgm = () => {
        if (bgm) {
            if(audio){
                audio.pause();
            }
        } else {
          if (audio) {
            audio.play();
          }
        }
        setClicks(prevState => ({
            ...prevState,
            bgm: !prevState.bgm,
        }));
      };

    // 나가기 아이콘 클릭시 이벤트 핸들러 함수.
    // bgm을 종료시켜줌.
    const movePageMusicOff = () => {
        synthRef.current.cancel();
        if(audio) {
            audio.pause();
            setClicks(prevState => ({
                ...prevState,
                audio: null,
            }));
        }
    }
    const handleVolumeChange = (event) => {
        const newVolume = event.target.value;
        setClicks(prevState => ({
            ...prevState,
            playVol: newVolume
        }));
        // 음악 재생 컴포넌트에게 소리 크기 업데이트 전달
    };

    const handlePlaybackSpeedChange = (event) => {
        const newPlaybackSpeed = parseFloat(event.target.value);
        setClicks(prevState => ({
            ...prevState,
            playbackSpeed: newPlaybackSpeed
        }));
        // 음악 재생 컴포넌트에게 재생 속도 업데이트 전달
    };

    return (
        <div className={"divRender"}>
            <div className={hamclick ? 'div_top_Click' : 'div_top_UnClick'}>
                <Link to={"/"}>
                    <LogoutRoundedIcon id={"out"} onClick={movePageMusicOff} style={{opacity: isMouseMoving ? 1 : opacity}} sx={{marginLeft: "0.5vw", fontSize: 65, color: "white", cursor: "pointer"}} />
                </Link>
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
                            {playing ? <PauseRoundedIcon id={"play"} onClick={playClick} sx={{fontSize: 73, color: "white", cursor: "pointer"}} />
                            : 
                            <PlayArrowRoundedIcon id={"play"} onClick={playClick} sx={{fontSize: 73, color: "white", cursor: "pointer"}} /> }
                            
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
                        <div className={speedclick ? "" : ( hamclick ? "control_speed_Click" : "control_speed")} style={{display: "flex", flexDirection: "row"}} >
                            <input className={speedclick ? "note" : ( hamclick ? "" : "")}
                                type="range" min="0.2" max="2" step="0.1" value={playbackSpeed} onChange={handlePlaybackSpeedChange} style={{appearance: "slider-vertical", width: "33px"}}/>
                            <input className={speedclick ? "note" : ( hamclick ? "" : "")}
                                type="range" min="0" max="1" step="0.01" value={playVol} onChange={handleVolumeChange} style={{appearance: "slider-vertical", width: "33px"}}/>
                        </div>
                        <div className={playBgm ? "" :( hamclick ? "control_volume_Click" : "control_volume")} ></div> 
                </div>
            </div>
            <div className={hamclick ? "div_right_Click" : "" }>
                 {/* 본문 내용 출력부 */}
                 <div id={hamclick ? "contents" : ""} style={{ opacity: hamclick ? 1 : 0 }}>
                    <div id={"contents_text"} style={{ overflow: "auto", fontFamily: 'NanumBarunGothic'}}>
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