import out from '../logo/out.jpg';
import ham from '../logo/hambuger.jpg';
import back from '../logo/backward.jpg';
import play from '../logo/play.jpg';
import forward from '../logo/forward.jpg';
import book from '../logo/book.jpg';
import set from '../logo/speed.png';
import "../css/Render.css";
import { useState } from 'react';

const Render=() => {
    const [modal,setModal] = useState(true)
    const modalhandle = () => {
        setModal(!modal);
    };
    const [clickd,setClicked] = useState(false);
    const handleClick = () => {
        setClicked(!clickd);
    };
    return (
        <div class={"divmom"}>
            <div class={clickd ? 'div1' : 'dived1'}>
                <input type={"image"} id={"out"} src={out} alt="out" />
                <input type={"image"} id={"ham"} src={ham} alt="tag" onClick={handleClick}/>
            </div>
            <div class={clickd ? "div2" : "dived2"}>
                <div id={"main"}></div>
                <div class={"divbox"}>
                    <div class={"div3"}>
                        <section id={"bar"}>
                            <div id={"controllbar"}></div>
                        </section>
                    </div>
                    <div class={"div4"}>
                        <div id={"setting"}>
                            <div><input type={"image"} id={"backward"} src={back} alt="back" /></div>
                            <div><input type={"image"} id={"book"} src={book} alt="book" /></div>
                            <div><input type={"image"} id={"play"} src={play} alt="play" /></div>
                            <div><input type={"image"} id={"forward"} src={forward} alt="forward" /></div>
                            <div><input type={"image"} id={"set"} src={set} alt="set" onClick={modalhandle}/>
                                <div class={modal ? "" : "container"}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class={clickd ? "" : "dived3"}>
                <div id={"text"}></div>
            </div>
        </div>
    );
};

export default Render;