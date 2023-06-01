import PropTypes from "prop-types"
// npm install @mui/material @emotion/react @emotion/styled 설치!!
import Box from "@mui/material/Box";
// npm install @mui/icons-material 모듈 설치!
import TextField from "@mui/material/TextField";
import { memo } from "react";


const SearchBar = memo(({ text, onChange }) => {
    return (
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "row",
          '& .MuiTextField-root': { m: 1, width: '43vw', marginLeft:"3vw"},
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          sx={{ marginTop: "1vh", minWidth: "10vw", maxWidth: "45vw" }}
          label="책이나 내용을 검색"
          type="text"
          value={text}
          onChange={onChange}
        />
      </Box>
    );
  });
  
SearchBar.propTypes = {
    text: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default SearchBar;