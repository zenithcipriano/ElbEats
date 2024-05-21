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
        if(window.innerWidth / 4 < ProfWidth) {
            tableWidth = window.innerWidth-ProfWidth;
        } else {
            tableWidth = 3*window.innerWidth/4
        }

        const col = Math.floor( tableWidth/ CardWidth);
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
                    if(width / 4 < ProfWidth) {
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
        return <ProgressBar1 height={200}/>
    } else {
        return (
            <div className='ProfilePage'>
                <table className='ProfileTable'>
                    <tr>
                        <td style={{width: width/4}}>
                            <div id='profileIcon'><CgProfile size={150}/></div>
                            <div className='userProfile'>
                                <h1 style={{paddingBottom: 20}}>{username}</h1>
                                {/* <h3>{aboutYou}</h3> */}
                                {/* gender
                                weight */}
                            </div>
                        </td>
                        <td style={{paddingRight: 0}}><div>
                            {
                                dishList.length > 0 ?
                                    <div className='dishdiv' 
                                    style={{
                                        height: isMobile ? height-155 : height-90, 
                                        width: width/4 > ProfWidth ?(3*width/4) + 20 : width-ProfWidth}}
                                    >
                                        <table style={{position: "relative", borderSpacing: "20px 10px", paddingRight: 20}}>
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