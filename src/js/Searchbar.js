// npm i props-types 설치
import PropTypes from "prop-types"
// npm install @mui/material @emotion/react @emotion/styled 설치!!
import NativeSelect from "@mui/material/NativeSelect";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
// npm install @mui/icons-material 모듈 설치!
import TextField from "@mui/material/TextField";
import { memo } from "react";


const SearchBar = memo(({ text, onChange, option, handleChange }) => {
    return (
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "row",
          '& .MuiTextField-root': { m: 1, width: '35vw'},
        }}
        noValidate
        autoComplete="off"
      >
        <FormControl sx={{ minWidth: "8vw", marginLeft: "2vw" , float: "left"}}>
          <NativeSelect
            sx={{ marginTop: "3vh" }}
            defaultValue={"*"}
            inputProps={{
              id: "uncontrolled-native",
            }}
            onChange={handleChange}
            value={option}
          >
            <option value={"*"}>통합검색</option>
            <option value={"title"}>제목</option>
            <option value={"author"}>작가</option>
            <option value={"genre"}>장르</option>
          </NativeSelect>
        </FormControl>
        <TextField
          sx={{ marginTop: "1vh", minWidth: "10vw", maxWidth: "35vw", marginLeft: "1vw" }}
          label="책이나 내용를 검색"
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
    option: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
};

export default SearchBar;