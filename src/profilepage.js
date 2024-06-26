import React, { useEffect }  from 'react';
import "./ProfilePage.css";
import { CgProfile } from "react-icons/cg";
import { useState } from "react";
import { FaRegStar, FaStarHalfAlt, FaStar } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  
import DishCardTable from './DishCardTable';
import ProgressBar1 from './progress';
import AlertModal from './alertModal';
import DeleteModal from './DeleteModal';
import { RiDeleteBin6Line } from 'react-icons/ri';

// const Reviews = [
//     {
//         username: "sample name1",
//         rate: 4,
//         review: "Hi! ",
//         // HiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHi
//         datePosted: new Date()
//     },
//     {
//         username: "sample name",
//         rate: 4,
//         review: "Hi! ",
//         // HiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHi
//         datePosted: new Date()
//     }
// ]

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const rateFun = (rate, iconSize) => {
    const numFilled = Math.floor(rate, 1)
    const filled = Array(numFilled).fill(<FaStar size={iconSize}/>)
    const halfed = Array(rate-numFilled == 0 ? 0 : 1).fill(<FaStarHalfAlt size={iconSize}/>)
    const tempstars = filled.concat(halfed)
    const outlined = Array(5-tempstars.length).fill(<FaRegStar size={iconSize}/>)
    return tempstars.concat(outlined)
}

function ProfilePage({isMobile, setIsLoggedIn, cookies}) {
    const navigate = useNavigate();
    const [width, setWidth] = useState(window.innerWidth)
    const [height, setHeight] = useState(window.innerHeight)
    const CardWidth = 320;
    const ProfWidth = 237;

    const [username, setUsername] = useState("");
    const [dishList, setDishList] = useState([]);
    // const username = "sample name1"
    // const aboutYou = "Hi"

    window.onresize = function(event) {
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)

        let tableWidth = 0;
        if(isMobile) {
            tableWidth = window.innerWidth-10
        } else if(window.innerWidth / 4 < ProfWidth) {
            tableWidth = window.innerWidth-ProfWidth;
        } else {
            tableWidth = 3*window.innerWidth/4
        }

        // console.log(tableWidth);
        const col = Math.floor( tableWidth/ CardWidth);
        console.log(col)
        resizeDishes(col, dishList, 1);
    }

    const userInfo = {
        id: localStorage.getItem("user_reference"),
        type: localStorage.getItem("user_type")
    }
    const [loading, setLoading] = useState(true);
    const [resizeDishesV, setRD] = useState([[]]);

    const [openDel, setOpenDel] = useState(false);
    const handleOpenDel = () => setOpenDel(true);
    const handleCloseDel = () => setOpenDel(false);

    const resizeDishes = (col, samp, isResize) => {
        if (col == 0) {
            col = 1;
        }
        
        if (isResize == 0) {
            const temp = [];
            const sampTemp = JSON.parse(JSON.stringify(samp));

            while(sampTemp.length) temp.push(sampTemp.splice(0,col));
            setRD(temp);
        } else if(resizeDishesV.length > 0) {
            if (resizeDishesV[0].length != col) {
                
                const temp = [];
                const sampTemp = JSON.parse(JSON.stringify(samp));

                while(sampTemp.length) temp.push(sampTemp.splice(0,col));
                setRD(temp);
            }
        }
    }

    const Retrieving = async () => {
        await axios({
            method: 'post',
            url: process.env.REACT_APP_API_URL+"/retrieveDishesReviewed",
            data: {
                userID: userInfo.id,
            }
        }).then((res) => {
            if(res.data.success){
                const data = res.data;
                // console.log(data);
                setUsername(data.username);

                if(data.dishList.length > 0) {
                    setDishList(data.dishList);
                    
                    let tableWidth = 0;
                    if(isMobile) {
                        tableWidth = width-10
                    } else if(width / 4 < ProfWidth) {
                        tableWidth = width-ProfWidth;
                    } else {
                        tableWidth = 3*width/4
                    }
                    
                    resizeDishes(Math.floor(tableWidth / CardWidth), data.dishList, 0);
                } else {
                    setDishList([]);
                    setRD([[]]);
                }
                // const user = res.data.user;
            } else{
                setOpenAlert(true);
                setAlertMess("Having trouble retrieving your reviews. Please try again later.");
                // alert(res.data.message);
            }
            setLoading(false);
        })
    }
    useEffect(() => {
        Retrieving();
    }, []);

    const [openAlert, setOpenAlert] = useState(false);
    const [alertMess, setAlertMess] = useState("");
    const alertClose = () => {setOpenAlert(false)};

    if (loading) {
        return <div style={{
            marginTop: isMobile ? -35 : -85, 
            height: isMobile ? window.innerHeight - (118.36) : window.innerHeight,
            alignContent: 'center'}}>
            <ProgressBar1 height={200}/>
        </div>
    } else {
        return (
            <div className='ProfilePage'>
                <table className='ProfileTable'>
                    <tr>
                        {!isMobile ? <td style={{width: width/4, padding: 20}}>
                            <div id='profileIcon'><CgProfile size={150}/></div>
                            <div className='userProfile' style={{position: 'relative', zIndex: 100}}>
                                <table style={{position: 'relative'}} align='center'>
                                    <tr>
                                        <td><h1 style={{paddingBottom: 20}}>{username}</h1></td>
                                        <td onClick={handleOpenDel}><RiDeleteBin6Line size={30} style={{marginTop: -30}}/></td>
                                    </tr>
                                </table>
                            </div>
                        </td> : null }
                        <td style={isMobile ? {paddingTop: 20} : {padding: 10, paddingRight: 0}}><div>
                            {isMobile ? <div className='userProfile' style={{marginBottom: 5, paddingBottom: 10, maxWidth: width-10, marginLeft: 0, width: width-10, zIndex: 100, marginTop: -75}}>
                                <table align='center' style={{position: 'relative'}}>
                                    <tr>
                                        <td>
                                            <CgProfile size={30}/>
                                        </td>
                                        <td><h1>{username}</h1></td>
                                        <td onClick={handleOpenDel}><RiDeleteBin6Line size={30} style={{marginTop: 0}}/></td>
                                    </tr>
                                </table>
                            </div> : null }
                            {
                                dishList.length > 0 ?
                                    <div className='dishdiv' 
                                    style={{
                                        height: isMobile ? height-215 : height-90, 
                                        width: isMobile? width-10 : (width/4 > ProfWidth ?(3*width/4) + 20 : width-ProfWidth),
                                        marginLeft: isMobile ? 0 : 2.5
                                    }}
                                    >
                                        <table align={isMobile? "center" : "left"} style={{position: "relative", borderSpacing: "20px 10px", paddingRight: 20, marginLeft: isMobile ? -23 : 0}}>
                                            <DishCardTable dishList={resizeDishesV} navigate={navigate} privilege={false} loadingModalDish={loading} height={height} reviewFlag={true} isMobile={isMobile}/>
                                        </table>
                                    </div> : <div style={{marginTop: 20}}>You have not reviewed any dish</div>
                            }
                        </div></td>
                    </tr>
                </table>
                <AlertModal open={openAlert} handleClose={alertClose} message={alertMess} isSuccess={false}/>
                <DeleteModal open={openDel} handleClose={handleCloseDel} userInfo={userInfo} type={"user"} setIsLoggedIn={setIsLoggedIn} cookies={cookies} name={username}/>
            </div>
        );
    }
}

export default ProfilePage;