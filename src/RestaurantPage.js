import React  from 'react';
import { useState, useEffect } from "react";
import "./RestaurantPage.css";
import HomePageCard from './HomePageCard';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { FaRegStar, FaStarHalfAlt, FaStar, FaFacebookF, FaFacebookMessenger, FaInstagram } from "react-icons/fa";
import { MdLocationPin, MdEmail } from "react-icons/md";
import { FaPhoneVolume, FaXTwitter } from "react-icons/fa6";
import "@fontsource/rubik";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { BiEditAlt } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import AddRestoModal from './AddRestoModal';
import DishCardTable from './DishCardTable';
import DeleteModal from './DeleteModal';
import ProgressBar1 from './progress';
import GMaps from './locationModal';

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function RestaurantPage({isMobile}) {
    const navigate = useNavigate();
    // const imgList = [
    //     "https://assets.bonappetit.com/photos/610aa6ddc50e2f9f7c42f7f8/master/pass/Savage-2019-top-50-busy-restaurant.jpg",
    //     "https://cdn.sortiraparis.com/images/80/100789/834071-too-restaurant-too-hotel-paris-photos-menu-entrees.jpg",
    //     "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
    // ]

    const [userID, setID] = useState(-1);
    const [restoname, setRN] = useState("");
    const numRev = 30
    const [bhours, setBH] = useState(["", ""]); 
    const [rdesc, setRdesc] = useState("");
    const [priceRange, setWalkPrices] = useState([]);
    const [onlinePriceRange, setOnlinePrices] = useState([]);
    const [address, setAddress] = useState("");
    const [cpnumber, setCP] = useState("");
    const [email, setEmail] = useState("");
    const [socials, setSocials] = useState([]);
    const [data1, setData] = useState([]);
    // const data1 = sampleData.filter((data) => {return data.resName == restoname});
    const [daysOfTheWeek, setDays] = useState("");
    // "123456";
    const [payment, setPayment] = useState([]);
    // ["Cash", "GCash", "Debit/Credit Card", "Bank Transfer"];
    const [imgList, setImages] = useState([]);

    const location = useLocation();
    const { pathname } = location;
    const restoID = parseInt(pathname.split("/")[2]);

    const [retDish, setRetDish] = useState(false);
    const [loading, setLoading] = useState(false);
    const Retrieving = async () => {
        await axios({
            method: 'post',
            url: process.env.REACT_APP_API_URL+"/retrieveRestoById",
            data: {
                restoID: restoID,
            }
        }).then(async (res) => {
            if(res.data.success){
                const data = res.data.resto;
                setCoordinates({lat: parseFloat(data.lat), lng: parseFloat(data.lng)})
                setWalkPrices(data.walkPrices);
                setOnlinePrices(data.onlinePrices);
                setRestoData(data);
                setID(data.userID);
                setRN(data.restoname);
                setRdesc(data.restoDesc);
                setAddress(data.restoLocation);
                setCP(data.cpNum);
                setEmail(data.email);
                setSocials([data.facebook, data.instagram, data.twitter]);
                setDays(data.daysOfTheWeek);
                setPayment(data.paymentOptions);
                setImages(data.images);

                const openT = data.openingTime.split(":");
                console.log(openT);

                let openP = parseInt(openT[0]) < 12 ? "AM" : "PM";
                const openHours = openP == "AM" ? (openT[0] == "00" ? 12 : (openT[0][0] == "0" ? openT[0][1] : openT[0])) : (parseInt(openT[0]) == 12 ? openT[0] : parseInt(openT[0])-12)

                const closeT = data.closingTime.split(":");
                let closeP = parseInt(closeT[0]) < 12 ? "AM" : "PM";
                const closeHours = closeP == "AM" ? (closeT[0] == "00" ? 12 : (closeT[0][0] == "0" ? closeT[0][1] : closeT[0])) : (parseInt(closeT[0]) == 12 ? closeT[0] : parseInt(closeT[0])-12)

                setBH([`${openHours}:${openT[1]} ${openP}`, `${closeHours}:${closeT[1]} ${closeP}`]);
                if(data.dishes.length > 0) {
                    // setData(Array(10).fill(data.dishes[0]));
                    // setTempData(rearrangeData((isMobile ? width : width/2), Array(10).fill(data.dishes[0])));

                    setData(data.dishes);
                    setTempData(rearrangeData((isMobile ? width : width/2), data.dishes));
                }
            } else{
                alert(res.data.message);
                navigate('/');
            }
            setRetDish(true);
            setLoading(false);
    })}

    useEffect(() => {
        if(!retDish && !loading) {
            setLoading(true);
            Retrieving();
        }
    }, []);

    const daysOpen = [];
    for (let i = 0; i < daysOfTheWeek.length; i++) {
        daysOpen.push(days[daysOfTheWeek[i]-1]);
    }
    
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


    const rearrangeData = (width, dat) => {
        const tempDataRowSize = Math.floor(width/320);
        const tempData1 = []
        let tempRow = []
        let counter = 0

        for (let i=0; i < dat.length; i+=1) {
            tempRow.push(dat[i])
            counter += 1
            if(tempDataRowSize == counter || i+1 == dat.length) {
                tempData1.push(tempRow)
                counter = 0
                tempRow = []
            }
        }
        return tempData1
    }

    const [tempData, setTempData] = useState(rearrangeData(isMobile ? width : width/2, data1))

    window.onresize = function(event) {
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
        setTempData(rearrangeData((isMobile ? window.innerWidth-30 : window.innerWidth/2-10), data1))
    }

    useEffect(() => {
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
        setTempData(rearrangeData((isMobile ? window.innerWidth-30 : window.innerWidth/2-10), data1))
    }, [isMobile]);

    const [openDel, setOpenDel] = useState(false);
    const handleOpenDel = () => setOpenDel(true);
    const handleCloseDel = () => setOpenDel(false);

    const [openMaps, setOpenMaps] = useState(false);
    const handleOpenMaps = () => setOpenMaps(true);
    const handleCloseMaps = () => setOpenMaps(false);
    // const [coordinates, setCoordinates] = useState();
    const [coordinates, setCoordinates] = useState({});

    const style1 = {
        height: height-(isMobile? 160 : 93), 
        textAlign: isMobile ? 'center' : 'left',
        fontFamily: "Rubik",
        overflowY: isMobile ? "scroll" : "hidden",
        // overflowY: "hidden",
        overflowX: "hidden"
    }

    // const style2 = {
    //     marginLeft: width/2+40,
    // }

    const style3 = {
        marginLeft: "auto",
        marginRight: "auto",
        // paddingRight: 20
    }

    const style4 = {
        fontFamily: "Rubik"
    }

    const handleChange = (event) => {
        event.preventDefault();
        setRdesc(event.target.value)
    }
    
    const [switch2, setSwitch2] = useState(true);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [restoData, setRestoData] = useState({});

    const userInfo = {
        id: localStorage.getItem("user_reference"),
        type: localStorage.getItem("user_type")
    }

    const [walkdel, setWalkDel] = useState(true);


    if (loading) {
        return <div style={{
            marginTop: isMobile ? -35 : -85, 
            height: isMobile ? window.innerHeight - (118.36) : window.innerHeight,
            alignContent: 'center'}}>
            <ProgressBar1 height={200}/>
        </div>
    } else {
        return (
            <div className='RP' style={style1}>
                <div style={{width: isMobile ? width-15 : width/2, marginLeft: isMobile ? 0 : width/2-60}} 
                className={isMobile ? "" : "Carousel1"}>

                    {!isMobile?<button className='rswitch' style={{
                        opacity: switch2 ? 1:0.5,
                        borderBottom: switch2 ? "1px solid rgba(0, 0, 0, 0)": "1px solid #ededed",
                        marginTop: isMobile ? 0 : 5,
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
                    style={{width: (width/2)+30, height: height-120}}
                    >
                    <table className='rdishtable'>
                        <DishCardTable dishList={tempData} navigate={navigate}/>
                    </table></div>}
                </div>
                <div className='restoBody' style={{
                    width: isMobile ? width-65 : (width/2)-122,
                    position: isMobile? "relative": "fixed",
                    // border: "1px solid black",
                    marginLeft: 2,
                    marginTop: isMobile ? -30 : 0
                }}>
                    <table align={isMobile ? "center" : "left"} style={{position: 'relative'}}>
                        <tr>
                            <td><p id='rpname' style={{
                                paddingRight: 10, 
                                // border: "1px solid black",
                                textAlign: userID == userInfo.id ? "right" : "center" }}>{restoname} </p></td>
                            {userID == userInfo.id ? 
                            <td style={{paddingTop: 5}}><BiEditAlt size={40} onClick={handleOpen}/></td>
                            : null}
                            {userID == userInfo.id ? 
                            <td style={{paddingTop: 5}}><RiDeleteBin6Line size={40} onClick={handleOpenDel}/></td>
                            : null}
                        </tr>
                    </table>
                    <table id='rateTable' align={isMobile ? "center" : "left"} style={isMobile ? style3 : {left: "-6px"}}>
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
                    <table className='tableHours' align={isMobile ? "center" : "left"} style={isMobile ? style3 :{}}>
                        <tr>
                            <td>{bhours[0]}</td>
                            <td>-</td>
                            <td>{bhours[1]}</td>
                            {!isMobile ? <td style={{paddingLeft: 10}}></td> : null}
                            {
                                !isMobile ? daysOpen.map((d) => {
                                    if(d == daysOpen.slice(-1)[0]) {
                                        return <td> {d} </td>
                                    } else {
                                        return <td> {d} - </td>
                                    }
                                }) : null
                            }
                        </tr>
                    </table>
                    {
                        isMobile ? <table className='tableHours' align={isMobile ? "center" : "left"} style={isMobile ? style3 :{}}>
                            <tr>
                            {daysOpen.map((d) => {
                                if(d == daysOpen.slice(-1)[0]) {
                                    return <td> {d} </td>
                                } else {
                                    return <td> {d} - </td>
                                }
                            })}
                        </tr></table> : null
                    }
                    <textarea id="descTextarea" value={rdesc} rows={2} 
                    style={{
                        fontFamily: "Rubik", 
                        width: isMobile ? width-100 : (width/2)-122-40,
                        textAlign: isMobile ? "center": "left",
                        // marginLeft: isMobile ? -20 : 0,
                    }} maxlength="300" onChange={handleChange} disabled/>
                    
                    <table className='priceTable' style={isMobile ? style3 : {marginLeft: "-10px", fontSize: 25}}>
                        <tr>
                            <td>{walkdel ? "Walk-in Price:" : "Price Online:"}</td>
                            <td>P{walkdel ? priceRange[0] : onlinePriceRange[0]}</td>
                            {
                                walkdel ? 
                                (priceRange.length > 1 ? <td>-</td> : null)
                                :(onlinePriceRange.length > 1 ? <td>-</td> : null)
                            }
                            {
                                walkdel ? 
                                (priceRange.length > 1 ? <td>P{priceRange[1]}</td> : null)
                                :(onlinePriceRange.length > 1 ? <td>P{onlinePriceRange[1]}</td> : null)
                            }
                            {
                                onlinePriceRange[0] ?
                                <td>
                                    <button onClick={() => setWalkDel(!walkdel)}> Check Prices </button>
                                </td> : null
                            }
                        </tr>
                    </table>

                    <table style={isMobile ? style3 : {marginLeft: -1}}>
                        <tr>
                            <td style={{paddingRight: 5}}>Payment Options:</td>
                            <td style={{textAlign: "left"}}>
                            {
                                payment.map((pay) => {
                                    return <button className='paymentTags'> {pay} </button>
                                    // return <td className="paymentBut"> {pay} </td>
                                })
                            }</td>
                        </tr>
                    </table>
                    
                    <div onClick={handleOpenMaps} className='Raddress' style={isMobile ? 
                        {width: width-45,
                        marginLeft: -15, 
                        marginTop: 10, border: "1px solid #ededed"} : 
                        {width: (width/2)-125,
                        marginLeft: -5, marginTop: 10, border: "1px solid #ededed"}}
                    ><MdLocationPin /> <u>{address}</u> </div>
                    <table className='socialsTable' style={isMobile ? {width: width-28, marginLeft: -18} : {width: (width/2)-112, marginLeft: -5}}>
                        <tr>
                            <td style={{border: "1px solid #ededed"}}>
                            { cpnumber ?
                                <div className='Raddress' 
                                style={isMobile ? {width: (width-60)/2, overflowWrap: 'break-word', height: "100%"} : {}}
                                > <FaPhoneVolume /> {cpnumber}</div>
                                : <div className='Raddress' 
                                style={isMobile ? {width: (width-60)/2, overflowWrap: 'break-word', height: "100%"} : {}}
                                > No Contact Number Provided </div>
                            }
                            </td>
                            <td style={{border: "1px solid #ededed"}}>
                                { email ?
                                    <div className='Raddress' 
                                    style={isMobile ? {width: (width-60)/2, overflowWrap: 'break-word', height: "100%"} : {}}
                                    ><MdEmail /> {email}</div>
                                    : <div></div>
                                }
                            </td>
                        </tr>
                        <tr>
                            <td style={{border: "1px solid #ededed"}}>
                                {socials[0] ?
                                <div className='Raddress' 
                                style={isMobile ? {width: (width-60)/2, overflowWrap: 'break-word', height: "100%"} : {}}
                                ><FaFacebookF /> {socials[0]}</div>
                                : <div></div>}
                            </td>
                            <td style={{border: "1px solid #ededed"}}>
                                {socials[1] ?
                                <div className='Raddress' 
                                style={isMobile ? {width: (width-60)/2, overflowWrap: 'break-word', height: "100%"} : {}}
                                ><FaInstagram /> {socials[1]}</div>
                                : <div></div>}
                            </td>
                        </tr>
                        <tr>
                            <td style={{border: "1px solid #ededed"}}>
                                {socials[2] ?
                                <div className='Raddress' 
                                style={isMobile ? {width: (width-60)/2, overflowWrap: 'break-word', height: "100%"} : {}}
                                ><FaXTwitter /> {socials[2]}</div>
                                : <div></div>}
                            </td>
                        </tr>
                    </table>
                </div>
                { isMobile?
                <div style={{position: 'relative', marginLeft: -10}}>
                    <table className='rdishtable' align='center'>
                        <DishCardTable dishList={tempData} navigate={navigate}/>
                    </table>
                </div>
                : <div></div>}
                <GMaps open={openMaps} handleClose={handleCloseMaps} coordinates={coordinates} address={address} height={height} width={width} permissionGiven={false} restoName={restoname} />
                {userID == userInfo.id ? (
                    <div>
                        <AddRestoModal open={open} handleOpen={handleOpen} handleClose={handleClose} userInfo={userInfo} height={height} action={"Edit"} restoID={restoID} restoData={restoData} loadingModal={loading} width={width}/>  
                        <DeleteModal open={openDel} handleClose={handleCloseDel} userInfo={userInfo} ID={restoID} type={"restaurant"} name={restoname}/>
                    </div>)
                : null }
            </div>
        );
    }
}

export default RestaurantPage;