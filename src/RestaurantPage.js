import React  from 'react';
import { useState } from "react";
import "./RestaurantPage.css";
import HomePageCard from './HomePageCard';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { FaRegStar, FaStarHalfAlt, FaStar, FaFacebookF, FaFacebookMessenger, FaInstagram } from "react-icons/fa";
import { MdLocationPin, MdEmail } from "react-icons/md";
import { FaPhoneVolume, FaXTwitter } from "react-icons/fa6";
import "@fontsource/rubik";
import { useNavigate } from 'react-router-dom';

const sampleData = [{
    dishName: "Dish Name1",
    rate: "unrated",
    resName: "Restaurant",
    distance: "0",
    status: "Closed",
    vitamins: "A, C, K",
    minerals: "iron, magnesium",
    tabs: "Pork, Fried",
    price: "200"
},
{
    dishName: "Dish Name2",
    rate: "unrated",
    resName: "Restaurant1",
    distance: "0",
    status: "Closed",
    vitamins: "A, C, K",
    minerals: "iron, magnesium",
    tabs: "Pork, Fried",
    price: "200"
},
{
    dishName: "Dish Name3",
    rate: "unrated",
    resName: "Restaurant",
    distance: "0",
    status: "Closed",
    vitamins: "A, C, K",
    minerals: "iron, magnesium",
    tabs: "Pork, Fried",
    price: "200"
},
{
    dishName: "Dish Name4",
    rate: "unrated",
    resName: "Restaurant",
    distance: "0",
    status: "Closed",
    vitamins: "A, C, K",
    minerals: "iron, magnesium",
    tabs: "Pork, Fried",
    price: "200"
},
{
    dishName: "Dish Name1",
    rate: "unrated",
    resName: "Restaurant",
    distance: "0",
    status: "Closed",
    vitamins: "A, C, K",
    minerals: "iron, magnesium",
    tabs: "Pork, Fried",
    price: "200"
},
{
    dishName: "Dish Name2",
    rate: "unrated",
    resName: "Restaurant1",
    distance: "0",
    status: "Closed",
    vitamins: "A, C, K",
    minerals: "iron, magnesium",
    tabs: "Pork, Fried",
    price: "200"
},
{
    dishName: "Dish Name3",
    rate: "unrated",
    resName: "Restaurant",
    distance: "0",
    status: "Closed",
    vitamins: "A, C, K",
    minerals: "iron, magnesium",
    tabs: "Pork, Fried",
    price: "200"
},
{
    dishName: "Dish Name4",
    rate: "unrated",
    resName: "Restaurant",
    distance: "0",
    status: "Closed",
    vitamins: "A, C, K",
    minerals: "iron, magnesium",
    tabs: "Pork, Fried",
    price: "200"
},
];

function RestaurantPage({isMobile}) {
    const navigate = useNavigate();
    const imgList = [
        "https://assets.bonappetit.com/photos/610aa6ddc50e2f9f7c42f7f8/master/pass/Savage-2019-top-50-busy-restaurant.jpg",
        "https://cdn.sortiraparis.com/images/80/100789/834071-too-restaurant-too-hotel-paris-photos-menu-entrees.jpg",
        "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
    ]

    const restoname = "Restaurant1"
    const numRev = 30
    const bhours = ["08:00 AM", "10:00PM"]
    const rdesc0 = "The best Korean BBQ Grill in Pansol, Laguna that also offers a private hotspring resort for you to enjoy and stay overnight."
    const [rdesc, setRdesc] = useState(rdesc0);
    const priceRange = [10, 200]
    const address = "F.O. Santos St., Los Baños, Philippines"
    const cpnumber = "0908 811 2302"
    const email = "dummy@gmail.com"
    const socials = ["facebook0", "messenger0", "instagran", "twitter"]
    const data1 = sampleData.filter((data) => {return data.resName == restoname});

    // Rate Comp
    const rating = 2
    const rateFun = (rate, iconSize) => {
        const numFilled = Math.floor(rate, 1)
        const filled = Array(numFilled).fill(<FaStar size={iconSize}/>)
        const halfed = Array(rate-numFilled == 0 ? 0 : 1).fill(<FaStarHalfAlt size={iconSize}/>)
        const tempstars = filled.concat(halfed)
        const outlined = Array(5-tempstars.length).fill(<FaRegStar size={iconSize}/>)
        return tempstars.concat(outlined)
    }
    const stars = rateFun(rating, 25)

    const [width, setWidth] = useState(window.innerWidth)
    const [height, setHeight] = useState(window.innerHeight)


    const rearrangeData = (width) => {
        const tempDataRowSize = Math.floor(width/310);
        const tempData1 = []
        let tempRow = []
        let counter = 0

        for (let i=0; i < data1.length; i+=1) {
            tempRow.push(data1[i])
            counter += 1
            if(tempDataRowSize == counter || i+1 == data1.length) {
                tempData1.push(tempRow)
                counter = 0
                tempRow = []
            }
        }
        return tempData1
    }

    const [tempData, setTempData] = useState(rearrangeData(isMobile ? width : width/2))

    window.onresize = function(event) {
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
        setTempData(rearrangeData(isMobile ? window.innerWidth : window.innerWidth/2))
    }

    const style1 = {
        height: height-(isMobile? 160 : 93), 
        textAlign: isMobile ? 'center' : 'left',
        fontFamily: "Rubik",
        overflowY: isMobile ? "scroll" : "hidden",
        overflowX: "hidden"
    }

    // const style2 = {
    //     marginLeft: width/2+40,
    // }

    const style3 = {
        marginLeft: "auto",
        marginRight: "auto"
    }

    const style4 = {
        fontFamily: "Rubik"
    }

    const handleChange = (event) => {
        event.preventDefault();
        setRdesc(event.target.value)
    }
    
    const [switch2, setSwitch2] = useState(true);

    return (
        <div className='RP' style={style1}>
            <div style={{width: isMobile ? width-15 : width/2, marginLeft: isMobile ? 0:width/2-60}} 
            className={isMobile ? "" : "Carousel1"}>

                {!isMobile?<button className='rswitch' style={{
                    opacity: switch2 ? 1:0.5,
                    borderBottom: switch2 ? "1px solid rgba(0, 0, 0, 0)": "1px solid #ededed",
                    marginTop: isMobile ? 0 : -10,
                }} onClick={() => setSwitch2(true)}>Images</button>:<div></div>}
                {!isMobile?<button className='rswitch' style={{
                    opacity: switch2 ? 0.5:1,
                    borderBottom: switch2 ? "1px solid #ededed": "1px solid rgba(0, 0, 0, 0)",
                    marginTop: isMobile ? 0 : -10,
                }} onClick={() => setSwitch2(false)}>Dishes</button>:<div></div>}
                {!isMobile?<hr/>:<div></div>}

                {switch2 || isMobile ? <Carousel useKeyboardArrows={true} showArrows={true} swipeable={true} className='car'
                    statusFormatter={(current, total) => {
                        return (
                            <p className='status' 
                            style={{fontSize: 13, 
                                // textShadow: "0 0 1px grey"
                            }}>{current} of {total}</p>
                        )
                    }}
                    renderArrowPrev={(clickHandler, hasPrev) => {
                        return (
                            <div className='ArrowBack' onClick={clickHandler} style={{opacity: hasPrev ? 1 : 0}}>
                                <IoIosArrowBack size={50}/>
                            </div>
                        );
                    }}
                    
                    renderArrowNext={(clickHandler, hasNext) => {
                        return (
                            <div onClick={clickHandler} className='ArrowNext' style={{opacity: hasNext ? 1 : 0}}>
                                <IoIosArrowForward size={50}/>
                            </div>
                        );
                    }}
                >
                    {imgList.map((URL, index) => (
                        <div>
                            <img className="slideImg" alt="sample_file" src={URL} key={index} />
                        </div>
                    ))}
                </Carousel>:<div className="scrollable1" 
                style={{width: (width/2)+30, height: height-140}}
                >
                <table className='rdishtable' style={style3}>
                    {
                        tempData.map((row1) => {
                            return <tr> {
                                    row1.map((dish) => {
                                        return <td><HomePageCard data={dish} navigate={navigate} /></td>
                                    })
                                }
                            </tr>
                        })
                    }
                </table></div>}
            </div>
            <div className='restoBody' style={{
                width: isMobile ? width-15 : (width/2)-122,
                position: isMobile? "relative": "fixed",
            }}>
                <p id='rpname'>{restoname}</p>
                <table id='rateTable' style={isMobile ? style3 : {left: "-6px"}}>
                    <tr>
                        <td>
                            <p id='stars'>{
                                stars.map((star) => star)
                            }</p>
                        </td>
                        <td>
                            <p>{Number.isInteger(rating) ? rating+".0" : rating} ({numRev}) </p>
                        </td>
                    </tr>
                </table>
                <table className='tableHours' style={isMobile ? style3 :{}}>
                    <tr>
                        <td>{bhours[0]}</td>
                        <td>-</td>
                        <td>{bhours[1]}</td>
                    </tr>
                </table>
                <textarea id="descTextarea" value={rdesc} 
                style={{
                    fontFamily: "Rubik", 
                    width: isMobile ? width-150 : (width/2)-122-40,
                    textAlign: isMobile ? "center": "left"
                }} maxlength="300" onChange={handleChange} disabled/>
                
                <table className='priceTable' style={isMobile ? style3 : {marginLeft: "-10px"}}>
                    <tr>
                        <td>P{priceRange[0]}</td>
                        <td>-</td>
                        <td>P{priceRange[1]}</td>
                    </tr>
                </table>

                <div className='Raddress'><MdLocationPin /> {address} </div>
                <table className='socialsTable'>
                    <tr>
                        <td>
                            <div className='Raddress'><FaPhoneVolume /> {cpnumber}</div>
                        </td>
                        <td>
                            <div className='Raddress'><MdEmail /> {email}</div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {socials[0] ?
                            <div className='Raddress'><FaFacebookF /> {socials[0]}</div>
                            : <div></div>}
                        </td>
                        <td>
                            {socials[1] ?
                            <div className='Raddress'><FaFacebookMessenger /> {socials[1]}</div>
                            : <div></div>}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {socials[2] ?
                            <div className='Raddress'><FaInstagram /> {socials[2]}</div>
                            : <div></div>}
                        </td>
                        <td>
                            {socials[3] ?
                            <div className='Raddress'><FaXTwitter /> {socials[3]}</div>
                            : <div></div>}
                        </td>
                    </tr>
                </table>
            </div>
            { isMobile?
                <table className='rdishtable' style={style3}>
                {
                    tempData.map((row1) => {
                        return <tr> {
                                row1.map((dish) => {
                                    return <td><HomePageCard data={dish} navigate={navigate} /></td>
                                })
                            }
                        </tr>
                    })
                }
            </table>
            : <div></div>}
        </div>
    );
}

export default RestaurantPage;