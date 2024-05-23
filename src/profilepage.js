import React, { useEffect }  from 'react';
import "./ProfilePage.css";
import { CgProfile } from "react-icons/cg";
import { useState } from "react";
import { FaRegStar, FaStarHalfAlt, FaStar } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  
import DishCardTable from './DishCardTable';
import ProgressBar1 from './progress';

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

function ProfilePage({isMobile}) {
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

    const resizeDishes = (col, samp, isResize) => {
        console.log(col)

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
                alert(res.data.message);
            }
            setLoading(false);
        })
    }
    useEffect(() => {
        Retrieving();
    }, []);

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
                            <div className='userProfile'>
                                <h1 style={{paddingBottom: 20}}>{username}</h1>
                            </div>
                        </td> : null }
                        <td style={isMobile ? {paddingTop: 20} : {padding: 20, paddingRight: 0}}><div>
                            {
                                dishList.length > 0 ?
                                    <div className='dishdiv' 
                                    style={{
                                        height: isMobile ? height-155 : height-90, 
                                        width: isMobile? width-10 : (width/4 > ProfWidth ?(3*width/4) + 20 : width-ProfWidth),
                                        marginLeft: isMobile ? 0 : 2.5
                                    }}
                                    >
                                        <table align={isMobile? "center" : "left"} style={{position: "relative", borderSpacing: "20px 10px", paddingRight: 20}}>
                                            {/* {isMobile ? <tr><td >
                                            <div id='profileIcon'><CgProfile size={150}/></div>
                                            <div className='userProfile'>
                                                <h1 style={{paddingBottom: 20}}>{username}</h1>
                                            </div>
                                            </td></tr> : null } */}
                                            <DishCardTable dishList={resizeDishesV} navigate={navigate} privilege={false} loadingModalDish={loading} height={height} reviewFlag={true}/>
                                        </table>
                                    </div> : "You have not reviewed any dish"
                            }
                        </div></td>
                    </tr>
                </table>
            </div>
        );
    }
}

export default ProfilePage;