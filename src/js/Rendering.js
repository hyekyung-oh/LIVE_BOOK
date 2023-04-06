import out from '../logo/out.jpg';
import ham from '../logo/hambuger.jpg';
import back from '../logo/backward.jpg';
import play from '../logo/play.jpg';
import forward from '../logo/forward.jpg';
import book from '../logo/book.jpg';
import volume from '../logo/volume.jpg';
import speed from '../logo/speed.png';
import stop from '../logo/stop.jpg';
import img from '../logo/sindaerella.jpg';
import "../css/Render.css";
import { useState, useEffect } from 'react';

const Render=() => {
    // 상태값 
    const [modal,setModal] = useState(true)
    const [hamclickd,sethamClicked] = useState(false);
    const [isMouseMoving, setIsMouseMoving] = useState(false);
    const [opacity, setOpacity] = useState(1);
    const [delay, setDelay] = useState(2000); // 딜레이 상태 추가
    const [playing,setPlaying] = useState(true);
    
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

    const modalhandle = () => {
        setModal(!modal);
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
                            <div><input type={"image"} id={"backward"} src={back} alt="back" /></div>
                            <div><input type={"image"} id={"play"} src={playing ? play : stop} alt="play" 
                                onClick={playClick}/></div>
                            <div><input type={"image"} id={"forward"} src={forward} alt="forward" /></div>
                            <div><input type={"image"} id={"book"} src={book} alt="book" /></div>
                            
                            <div><input type={"image"} id={"speed"} src={speed} alt="speed" onClick={modalhandle}/>
                                <div class={modal ? "" : "container_speed"} ></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class={"Ofpages"} style={{opacity: isMouseMoving ? 1 : opacity }}>
                    <div id={"page"}>10</div>
                    <div id={"pages"}>20</div>
                </div>
            </div>
            <div class={hamclickd ? "dived3" : "" }>
                <div id={hamclickd? "text" : "" }></div>
            </div>            
        </div>
    );
};

export default Render;