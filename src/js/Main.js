import "../css/Main.css"
import logo_main from '../logo/Livebook.png'
import SearchBookCount from "./SearchBookCount";
import SearchBookList from "./SearchBookList";
import SearchBar from "./Searchbar";
import { useState, useCallback } from "react";

// 첫화면 컴포넌트
const Main=() => {
  // 상태값
  const [text, setText] = useState("");
  const [isInput, setIsInput] = useState(false);
  
  // 검색 창 검색시 이벤트 핸들러 함수.
  const onChange = useCallback(
    (e) => {
      setText(e.target.value.toLowerCase());
      setIsInput(!!e.target.value);
    },
    [setText, setIsInput]
  );
  // 로고 아이콘 클릭 시 이벤트 핸들러 함수.
  const logo_Click = useCallback(() => {
    setText("");
    setIsInput(false);
  }, [setText, setIsInput]);

  return (
    <div className={isInput? "input_main" : "main"}>
      <div className={isInput? "input_top_box": null}>
        <div className={isInput ? "input_logo" : "logo"}>
          <div>
            <input type={"image"}id={isInput ? "input_logo_livebook" : "logo_livebook"} 
                   src={logo_main} aria-label="logo" onClick={logo_Click}></input>
          </div>
        </div>
          {/* 검색창 */}
          <div className={isInput ? "input_search" : "search"}>
            <SearchBar text={text} onChange={onChange}/>
            {/* 검색결과갯수 */}
            {isInput ? 
              <div className={isInput ? "input_searchValue" : null}>
                  <SearchBookCount text={text}/>
              </div>
              :
              <div></div>}
          </div>
      </div>
      <div className={isInput? "input_down_box" : null}>
        {/* 검색목록카드 */}
        {isInput? 
          <div className={isInput ? "input_searchListBox" : null}>
            <SearchBookList text={text}/>
          </div>
          :
          <div></div>}
      </div>
    </div>
    );
};

export default Main;