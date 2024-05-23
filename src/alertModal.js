import React  from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { IoIosCloseCircleOutline } from "react-icons/io";
import "./addrestomodal.css";
import "@fontsource/rubik";

function AlertModal ({open, handleClose, message, isSuccess}) {
    const style = {
        position: 'absolute',
        fontFamily: "Rubik",
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: window.innerWidth-40,
        maxWidth: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        // height: 3*height/4,
        // overflowY: "scroll",
        padding: 2
    };

    return <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
        <Box sx={style}>
            <table className='modalTable' style={{marginBottom: -15}}>
                <tr>
                    <td>
                        <h2 style={{color : isSuccess ? "#013b3f":"#6e2323"}}>{message}</h2>
                        {/* {type == "review" ? */}
                            {/* <h2>Delete Review</h2>: */}
                            {/* <h2>Delete '{name}'</h2>} */}
                    </td>
                    <td style={{textAlign: "right"}}> <IoIosCloseCircleOutline size={40} onClick={handleClose}/> </td>
                </tr>
            </table>
        </Box>
    </Modal>
}
export default AlertModal;