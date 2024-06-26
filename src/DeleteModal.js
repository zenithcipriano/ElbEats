import React  from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useState, useEffect } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import "./addrestomodal.css";
import axios from 'axios';
import "@fontsource/rubik";
import { useLocation, useNavigate } from 'react-router-dom';  
import { Alert } from 'react-bootstrap';
import AlertModal from './alertModal';

function DeleteModal ({open, handleClose, userInfo, ID, type, name, rname, setIsLoggedIn, cookies}) {
    const style = {
        position: 'absolute',
        fontFamily: "Rubik",
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: window.innerWidth-40,
        maxWidth: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        // height: 3*height/4,
        // overflowY: "scroll",
        padding: 2
    };

    const userID = userInfo.id;
    const location = useLocation();
    const navigate = useNavigate();

    const [openAlert, setOpenAlert] = useState(false);
    const [alertMess, setAlertMess] = useState("");
    const alertClose = () => {setOpenAlert(false)};

    const [ret, setRet] = useState(false);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if(!ret) {
            setRet(true);
            const { pathname } = location;

            if(type == "restaurant") {
                await axios({
                    method: 'post',
                    url: process.env.REACT_APP_API_URL+"/deleteResto",
                    data: {
                        userID, restoID: ID
                    },
                }).then((res) => {
                    // alert(res.data.message);
                    
                    if(res.data.success){
                        // alert(res.data.message);
                        if(pathname == "/profile" || type == "review") {
                            window.location.reload();
                        } else {
                            navigate('/profile');
                        }
                        handleClose();
                    } else {
                        setOpenAlert(true);
                        setAlertMess('Having trouble deleting this restaurant. Please try again later.');
                        setRet(false);
                        // alert("Deletion failed.");
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
                    
                    if(res.data.success){
                        // alert(res.data.message);
                        // navigate("/profile");
                        // window.location.reload();
                        if(pathname == "/profile" || type == "review") {
                            window.location.reload();
                        } else {
                            navigate('/profile');
                            handleClose();
                        }
                    } else {
                        setOpenAlert(true);
                        setAlertMess('Having trouble deleting this dish. Please try again later.');
                        setRet(false);
                        // alert("Deletion failed.");
                    }
                })
            } else if (type == "review") {
                await axios({
                    method: 'post',
                    url: process.env.REACT_APP_API_URL+"/deleteReview",
                    data: {
                        userID, reviewID: ID
                    },
                }).then((res) => {
                    // alert(res.data.message);
                    if(res.data.success){
                        // alert(res.data.message);
                        // navigate("/profile");
                        // window.location.reload();
                        if(pathname == "/profile" || type == "review") {
                            window.location.reload();
                        } else {
                            navigate('/profile');
                            handleClose();
                        }
                    } else {
                        setOpenAlert(true);
                        setAlertMess('Having trouble deleting this review. Please try again later.');
                        setRet(false);
                        // alert("Deletion failed.");
                    }
                })
            } else if (type == "user") {
                await axios({
                    method: 'post',
                    url: process.env.REACT_APP_API_URL+"/deleteUser",
                    data: {
                        userID
                    },
                }).then((res) => {
                    // alert(res.data.message);
                    if(res.data.success){
                        // alert(res.data.message);
                        setIsLoggedIn(0);
                        cookies.remove("authToken");
                        localStorage.removeItem("user_reference");
                        localStorage.removeItem("user_type");
                        handleClose();
                        // navigate("/profile");
                        // window.location.reload();
                        // if(pathname == "/profile" || type == "review") {
                        //     window.location.reload();
                        // } else {
                        //     navigate('/profile');
                        // }
                    } else {
                        setOpenAlert(true);
                        setAlertMess('Having trouble deleting this review. Please try again later.');
                        // alert("Deletion failed.");
                    }
                    setRet(false);
                })
            } else {
                setRet(false);
                console.log("hi");
            }
        }
    }

    return <div><Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
        <Box sx={style}>
            <table className='modalTable'>
                <tr>
                    <td>
                        {type == "review" ?
                            <h2>Delete Review</h2>:
                            <h2>Delete '{name}'</h2>}
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
                               : type == "dish" ? <p>Deleting this dish will also <b>delete all its reviews</b>.</p>
                               : type == "review" ? <p>You are deleting your review on <b> {name}</b> of <b>{rname}</b>.</p>
                               : <p>You are deleting your account and all of its contents.</p>
                            }
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{textAlign: "center", paddingBottom: 10}}> <input style={{maxWidth: 235, width: 2*window.innerWidth/5}} type="reset" value="Cancel" onClick={handleClose}  disabled={ret}/></td>
                        <td colSpan={2} style={{textAlign: "center", paddingBottom: 10}}> <input style={{maxWidth: 235, width: 2*window.innerWidth/5}} type="submit" value="Continue" disabled={ret}/></td>
                    </tr>
                </table>
            </form>
        </Box>
    </Modal>
    <AlertModal open={openAlert} handleClose={alertClose} message={alertMess} isSuccess={false}/>
    </div>
}
export default DeleteModal;