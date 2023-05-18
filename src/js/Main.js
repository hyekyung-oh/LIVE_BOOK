import "../css/Main.css"
import logo_main from '../logo/Live_Book.png'
import SearchBar from "./Searchbar";
import { useState, useCallback } from "react";

const Main=() => {
    const [text, setText] = useState("");
    const [option, setOption] = useState("");
    const [isInput, setIsInput] = useState(false);
  
    const onChange = useCallback(
      (e) => {
        setText(e.target.value.toLowerCase());
        setIsInput(!!e.target.value);
      },
      [setText, setIsInput]
    );
  
    const handleChange = useCallback((e) => {
      setOption(e.target.value);
    }, [setOption]);
  
    const logo_Click = useCallback(() => {
      setText("");
      setOption("");
      setIsInput(false);
    }, [setText, setOption, setIsInput]);
    

    return (
        <div className={isInput? "input_main" : "main"}>
            <div className={isInput ? "input_logo" : "logo"}>
                <div>
                    <input type={"image"}id={isInput ? "input_logo_livebook" : "logo_livebook"} src={logo_main} 
                            aria-label="logo" onClick={logo_Click}></input>
                </div>
            </div>
            <div className={isInput ? "input_search" : "search"}>
                <div id={isInput ? "input_searchbox" : "searchbox"}>
                    <SearchBar text={text} onChange={onChange} option={option} handleChange={handleChange}/>
                </div>
            </div>
            <div className={isInput ? "input_searchValue" : null}>
                <div>

                </div>
            </div>
            <div className={isInput ? "input_searchListBox" : ""}>

            </div>
        </div>
    );
};

export default Main;