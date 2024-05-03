import React  from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useState, useEffect } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import "./addrestomodal.css";
import axios from 'axios';
import "@fontsource/rubik";
import ProgressBar1 from './progress';
import { useNavigate } from 'react-router-dom';  

function DeleteModal ({open, handleClose, userInfo, ID, type, name}) {
    const style = {
        position: 'absolute',
        fontFamily: "Rubik",
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        // height: 3*height/4,
        // overflowY: "scroll",
        padding: 2
    };

    const userID = userInfo.id;
    const navigate = useNavigate();

    const [ret, setRet] = useState(false);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if(!ret) {
            setRet(true);

            if(type == "restaurant") {
                await axios({
                    method: 'post',
                    url: process.env.REACT_APP_API_URL+"/deleteResto",
                    data: {
                        userID, restoID: ID
                    },
                }).then((res) => {
                    // alert(res.data.message);
                    setRet(false);
                    if(res.data.success){
                        alert(res.data.message);
                        handleClose();
                        navigate("/profile");
                        // window.location.reload();
                    } else {
                        alert("Deletion failed.");
                    }
                })
            } else if (type == "dish") {
                await axios({
                    method: 'post',
                    url: process.env.REACT_APP_API_URL+"/deleteDish",
                    data: {
                        userID, dishID: ID
                    },
                }).then((res) => {
                    // alert(res.data.message);
                    setRet(false);
                    if(res.data.success){
                        alert(res.data.message);
                        handleClose();
                        navigate("/profile");
                        // window.location.reload();
                    } else {
                        alert("Deletion failed.");
                    }
                })
            } else {
                setRet(false);
            }
        }
    }

    return <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
        <Box sx={style}>
            <table className='modalTable'>
                <tr>
                    <td>
                        <h2>Delete '{name}'</h2>
                    </td>
                    <td style={{textAlign: "right"}}> <IoIosCloseCircleOutline size={40} onClick={handleClose}/> </td>
                </tr>
            </table>
            <form onSubmit={handleSubmit} style={{fontFamily: "Rubik", marginBottom: -15}}>
                <table className="inputTables">
                    <tr>
                        <td colSpan={4} style={{fontSize: 25, textAlign: "center"}}>Are you sure?</td>
                    </tr>
                    <tr>
                        <td colSpan={4} style={{fontSize: 15, textAlign: "center", paddingBottom: 15}}>
                            {
                               type == "restaurant" ?
                               <p>Deleting this restaurant will also <b>delete all its listed dishes and reviews</b>.</p>
                               : <p>Deleting this dish will also <b>delete all its reviews</b>.</p>
                            }
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{textAlign: "center", paddingBottom: 10}}> <input type="reset" value="Cancel" onClick={handleClose}  disabled={ret}/></td>
                        <td colSpan={2} style={{textAlign: "center", paddingBottom: 10}}> <input type="submit" value="Continue" disabled={ret}/></td>
                    </tr>
                </table>
            </form>
        </Box>
    </Modal>
}
export default DeleteModal;