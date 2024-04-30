import React  from 'react';
import "./ProfilePage.css";
import { CgProfile } from "react-icons/cg";
import { useState } from "react";
import { FaRegStar, FaStarHalfAlt, FaStar } from "react-icons/fa";

const Reviews = [
    {
        username: "sample name1",
        rate: 4,
        review: "Hi! ",
        // HiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHi
        datePosted: new Date()
    },
    {
        username: "sample name",
        rate: 4,
        review: "Hi! ",
        // HiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHi
        datePosted: new Date()
    }
]

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const rateFun = (rate, iconSize) => {
    const numFilled = Math.floor(rate, 1)
    const filled = Array(numFilled).fill(<FaStar size={iconSize}/>)
    const halfed = Array(rate-numFilled == 0 ? 0 : 1).fill(<FaStarHalfAlt size={iconSize}/>)
    const tempstars = filled.concat(halfed)
    const outlined = Array(5-tempstars.length).fill(<FaRegStar size={iconSize}/>)
    return tempstars.concat(outlined)
}

function ProfilePage() {

    const [width, setWidth] = useState(window.innerWidth)
    const [height, setHeight] = useState(window.innerHeight)
    const username = "sample name1"
    const aboutYou = "Hi"

    window.onresize = function(event) {
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
    }

    const ReviewsRet = () => {
        return Reviews.map((rev) => {
                    return <table id='revTable'> <tr>
                        <td style={{width: "30px"}}>
                            <div style={{left: "4px", position: "relative"}}>< CgProfile size={25}/></div>
                        </td>
                        <td className='rp1'>
                            <table style={{position: "relative", marginTop: "-6px", width: "100%"}}><tr>
                                <td> <div style={{ marginLeft: "-2px", textAlign: "left"}}>{rev.username}</div></td>
                                <td style={{textAlign: "right", paddingRight: "5px", fontSize: "15px"}}> {months[rev.datePosted.getMonth()]} {rev.datePosted.getDate()} {rev.datePosted.getFullYear()} {rev.datePosted.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</td>
                                </tr></table>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td className='rp2'>
                            <div style={{marginTop: "-13px", marginLeft: "-2px"}}><table style={{position: "relative"}}><tr>
                                <td>{rateFun(rev.rate, 15)}</td>
                                <td><p style={{margin: "0px", marginTop: "-2px"}}>{rev.rate}</p></td></tr></table></div>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td className='rp3'><p style={{margin: "0px", marginTop: "-5px", marginBottom: "5px", textAlign: "left"}}>{rev.review}</p></td>
                    </tr>
                    {/* <tr>
                        <td></td>
                        <td className='rp4'>
                        </td>
                    </tr> */}
                    </table>
                })
    }

    return (
        <div className='ProfilePage'>
            <table className='ProfileTable'>
                <tr>
                    <td style={{width: width/4}}>
                        <div id='profileIcon'><CgProfile size={150}/></div>
                        <div className='userProfile'>
                            <h1>{username}</h1>
                            <h3>{aboutYou}</h3>
                            {/* gender
                            weight */}
                        </div>
                    </td>
                    <td><div>
                        {ReviewsRet()}
                    </div></td>
                </tr>
            </table>
        </div>
    );
}

export default ProfilePage;