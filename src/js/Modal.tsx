import styled from '@emotion/styled'

// 모달 창 뒷배경
export const SearchModalBox = styled.div`
	position: fixed;
	top: 0;
    left: 0;
    width: 100%;
    height: 100%;
	background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    z-index: 999;
    justify-content: center;
    align-items: center;
`

// 여기에 만들고 싶은 모달 스타일 구현
export const SearchModalContent = styled.div`
    padding: 1.0rem 1.0rem;
    width: 42.5rem;
    border-radius: 0.8rem;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    justify-content: center;
    align-items: center;
}
`