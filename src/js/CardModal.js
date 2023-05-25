import { useState } from 'react'
import Button from '@mui/material/Button';
import Modal from './Modal';


const CardModal = (props) => {

    const id = props.id;

    // 모달 버튼 클릭 유무를 저장할 state
    const [showModal, setShowModal] = useState(false)
  
  // 버튼 클릭시 모달 버튼 클릭 유무를 설정하는 state 함수
    const clickModal = () => setShowModal(!showModal)

    return (
        <>
            <Button size="small" onClick={clickModal}>더보기</Button>
            {showModal && <Modal id={id} clickModal={clickModal} />}
        </>
    )
}

export default CardModal