import { styled, alpha } from '@mui/material/styles';
import PropTypes from "prop-types"
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { memo } from "react";

// NAVER 스타일의 검색창 적용 시 사용
const Search1 = styled('div')(({ theme }) => ({
    position: 'relative',
    // borderRadius: theme.shape.borderRadius,
    borderRadius: 32,
    boxShadow: "0 0 0 3px #eede69",
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    width: "100%",
    padding: "5px",
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      padding: 0,
    },
  }));
  
// GOOGLE 스타일의 검색창 적용 시 사용(현재 적용)
const Search2 = styled('div')(({ theme }) => ({
    position: 'relative',
    // borderRadius: theme.shape.borderRadius,
    borderRadius: 32,
    boxShadow: theme.shadows[5],
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    width: "100%",
    padding: "5px",
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      padding: 0,
    },
  }));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'), // 해당 요소의 너비가 변경될 때 부드러운 전환 효과
    width: '500px',
    // placeholder fontSize 변경
    '::placeholder': {
      fontSize: '16px', 
    },
    [theme.breakpoints.down('sm')]: {
      adding: theme.spacing(0.5, 0.5, 0.5, 0),
      width: '250px',
      '::placeholder': {
        fontSize: '2px', 
      },
    },
   
  },
}));

const SearchBar = memo(({text, onChange})=> {
    return (
      <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Search2>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="책이나 내용을 검색"
                inputProps={{ 'aria-label': 'search' }}
                value={text}
                onChange={onChange}
              />
            </Search2>
      </Box>
    );
  });

  SearchBar.propTypes = {
    text: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default SearchBar;
export {Search1, Search2, SearchIconWrapper, StyledInputBase}