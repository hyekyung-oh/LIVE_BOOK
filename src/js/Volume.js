import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
// import "../css/Volume.css";

export default function VerticalSlider() {
  function preventHorizontalKeyboardNavigation(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
    }
  }

  return (
    <Box sx={{  /* 음량조절 창 크기 */
    width: "8vw",
    height: "20vh",
  
    /* 위치 */
    
    
    /* 중앙 배치 */
    /* top, bottom, left, right 는 브라우저 기준으로 작동한다. */
    /* translate는 본인의 크기 기준으로 작동한다. */
    position: "absolute",
    bottom: "80%",
    right: "8vw",
    transform: "translate(30%, 0%)",
    opacity: 0,
    ":hover": { opacity: 1 }}}>
      <Slider
        sx={{
          '& input[type="range"]': {
            WebkitAppearance: 'slider-vertical',
          },
        }}
        orientation="vertical"
        defaultValue={30}
        aria-label="Temperature"
        valueLabelDisplay="auto"
        onKeyDown={preventHorizontalKeyboardNavigation}
      />
    </Box>
  );
}
