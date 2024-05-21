import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useState, useEffect, useCallback } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
// import "./addrestomodal.css";
// import "./addDishModal.css";
import axios from 'axios';
import "@fontsource/rubik";
import ProgressBar1 from './progress';
import {useDropzone} from 'react-dropzone'
import { Carousel } from "react-responsive-carousel";
import { colors } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import "./addReview.css";
import { FaRegStar, FaStarHalfAlt, FaStar } from "react-icons/fa";

function AddReview ({open, handleClose, height, action, dishID, curRev}) {
    const style = {
        position: 'absolute',
        fontFamily: "Rubik",
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        // width: 600,
        width: window.innerWidth-40,
        maxWidth: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        height: 350,
        // overflowY: "scroll",
        padding: 2
    };

    const userInfo = {
        id: localStorage.getItem("user_reference"),
        type: localStorage.getItem("user_type")
    }
    const userID = userInfo.id;
    // const [dishID, setdishID] = useState(-1);
    
    useEffect(() => {
        changeStarNum(curRev.rate-1);
        if(curRev.review) setCount(curRev.review.length);
        setReview(curRev.review);
    }, [open]);

    const [ret, setRet] = useState(false);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if(!ret) {
            // YYYY-MM-DD HH:MI:SS
            const now = new Date();
            const YYYY = now.getFullYear();
            const MM = now.getMonth() < 10 ? "0"+now.getMonth() : now.getMonth();
            const DD = now.getDate() < 10 ? "0"+now.getDate() : now.getDate();
            const HH = now.getHours() < 10 ? "0"+now.getHours() : now.getHours();
            const MI = now.getMinutes() < 10 ? "0"+now.getMinutes() : now.getMinutes();
            const SS = now.getSeconds() < 10 ? "0"+now.getSeconds() : now.getSeconds();

            const reviewbody = {
                userID,
                dishID,
                reviewText: review,
                rating: numStar,
                posted: `${YYYY}-${MM}-${DD} ${HH}:${MI}:${SS}`
            }
            // console.log(reviewbody);

            if(action == "Add") {
                await axios({
                    method: 'post',
                    url: process.env.REACT_APP_API_URL+"/createReview",
                    data: reviewbody,
                }).then((res) => {
                    alert(res.data.message);
                    setRet(false);
                    if(res.data.success){
                        resetButton();
                        handleClose();
                        window.location.reload();
                    }
                })
            } else if (action = "Edit"){
                reviewbody.reviewID = curRev.reviewID
                await axios({
                    method: 'post',
                    url: process.env.REACT_APP_API_URL+"/updateReview",
                    data: reviewbody,
                }).then((res) => {
                    alert(res.data.message);
                    setRet(false);
                    if(res.data.success){
                        resetButton();
                        handleClose();
                        window.location.reload();
                    }
                })
            } else {
                setRet(false);
            }
        }
    }

    const outlined0 = <FaRegStar size={40}/>;
    const filled0 = <FaStar size={40}/>;
    const [star, setStar] = useState(Array(5).fill(outlined0));
    const [numStar, setNumStar] = useState(0);
    const changeStarNum = (index) => {
        if(index > -1) {
            setNumStar(index+1);
            const filled = Array(index+1).fill(filled0);
            const outlined = Array(5-(index+1)).fill(outlined0);
            setStar([...filled, ...outlined]);
        }
    }

    const [reviewCount, setCount] = useState(0);
    const [review, setReview] = useState("");

    const resetButton = () => {
        setStar(Array(5).fill(outlined0));
        setNumStar(0);
        setCount(0);
        setReview("");
    }

    const handleReview = (event) => {
        const val = event.target.value;
        setReview(val);
        setCount(val.length);
    }

    // const searchIng = async () => {
    //     await axios({
    //             method: 'post',
    //             url: process.env.REACT_APP_API_URL+"/searchIng",
    //             data: {ingName: ingSearch},
    //         }).then((res) => {
    //             if(res.data.success){
    //                 setSearchPushed(true);
    //                 setResults(res.data.results);
    //             } else {
    //                 alert(res.data.message);
    //             }
    //         })
    // }

    const [loadingModal, setLoadingModal] = useState(false);

    if(loadingModal || ret) {
        return <Modal 
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
            <Box sx={style}>
                <div style={{alignContent: 'center', height: "100%", marginTop: -30}}>
                    <ProgressBar1 height={200}/>
                </div>
            </Box>
        </Modal>
    } else {
        return <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div style={{width: "100%", position: "relative", marginTop: -15}}>
                    <table className='reviewTable' align='center' style={{marginBottom: -62}}>
                        <tr>
                            <td> 
                                <h2> {action} Review </h2>
                            </td>
                        </tr>
                    </table>
                    <table className='reviewTable' align='right' >
                        <tr>
                            <td>
                                <td style={{textAlign: "right"}}> <IoIosCloseCircleOutline size={40} onClick={handleClose}/> </td>
                            </td>
                        </tr>
                    </table>
                    <table className='reviewTable' align="center" style={{marginTop: 50, paddingLeft: 40}}>
                        <tr>
                            {
                                star.map((starIcon, index) => {
                                    return <td onClick={() => changeStarNum(index)} >{starIcon}</td>
                                })
                            }
                        </tr>
                    </table>
                    <form onSubmit={handleSubmit}>
                    <table className='reviewTable' align='center'>
                        <tr colSpan={4}>
                            <textarea value={review} onChange={handleReview} rows={7} className='textAreaModal1' style={{width: window.innerWidth-40 > 600 ? 600 - 70 : window.innerWidth-100, fontFamily: "Rubik", marginBottom: -28}} maxLength={300}/>
                            <div style={{width: window.innerWidth-40 > 600 ? 600 - 40 : window.innerWidth-70, textAlign: "right"}}>{reviewCount} / 300</div>
                        </tr>
                    </table>
                    <table className='reviewTable' align='center' style={{marginTop: 20}}>
                        <tr>
                            <td style={{textAlign: "center", paddingBottom: 10}}> <input style={{maxWidth: 235, width: 2*window.innerWidth/5}} type="reset" value="Reset" onClick={resetButton}  disabled={ret}/></td>
                            <td style={{textAlign: "center", paddingBottom: 10}}> <input style={{maxWidth: 235, width: 2*window.innerWidth/5}} type="submit" value="Submit" disabled={ret}/></td>
                        </tr>
                    </table>
                    </form>
                </div>
            </Box>
        </Modal>
    }
}
export default AddReview;