import './DishPage.css';
import { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { MdLocationPin } from "react-icons/md";
import "@fontsource/rubik";
import { FaRegStar, FaStarHalfAlt, FaStar } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FiPlusCircle } from "react-icons/fi";
import axios from 'axios';
import { useLocation } from 'react-router-dom';  
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ProgressBar1 from './progress';
import { BiEditAlt } from 'react-icons/bi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import AddDishModal from './AddDishModal';
import DeleteModal from './DeleteModal';
import GMaps from './locationModal';
import AddReview from './addReview';
import AlertModal from './alertModal';


const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function DishPage({isMobile, navigate}) {
    // Regular Comp
    // const dname = "Filipino Chicken Adobo"
    // const rname = "RecipeTin Eats"
    // const coordinates = 0
    // const address = "F.O. Santos St., Los Baños, Philippines"
    // const walkinPrice = 80
    // const delPrice = 120
    // const numRev = 30
    // const restoID = 1;
    const userInfo = {
        id: localStorage.getItem("user_reference"),
        type: localStorage.getItem("user_type")
    }
    // console.log(userInfo.type);

    const location = useLocation();
    const { pathname } = location;
    const dishID = pathname.split("/")[2];

    const [restoID, setrestoID] = useState(0);
    const [dname, setdname] = useState("");
    const [rname, setrname] = useState("");
    const [coordinates, setCoordinates] = useState({});
    // const [coordinates, setCoordinates] = useState(0);
    const [address, setAddress] = useState("");
    const [walkinPrice, setWalkinprice] = useState(0);
    const [delPrice, setOnlineprice] = useState(0);
    const [numRev, setNumreviews] = useState(0);
    const [imgList, setImages] = useState([]);
    const [rating, setRatings] = useState(0);

    const [paymentTags, setPay] = useState([]); 
    const [Categories, setCat] = useState([]);
    const [catPercent, setcatper] = useState([]);
    const [nut, setNut] = useState({});
    const [ing, setIng] = useState([]);
    const [ingGrams, setAmount] = useState([]);
    const [ingType, setType] = useState([]);
    const [protein, setProtein] = useState([]);
    const [proteinType, setPType] = useState([]);
    const [Reviews, setreviews] = useState([]);
    const [servings, setServings] = useState(1);
    const [permission, setPermissionGiven] = useState(false);
    const [dishInfo, setDishInfo] = useState({});
    const [avail, setAvail] = useState(1);
    const [open, setOpen] = useState(false);
    const [userID, setUserID] = useState(-1);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [revAction, setrevAction] = useState("Add");
    const [curRev, setCurRev] = useState({});

    const [openDel, setOpenDel] = useState(false);
    const handleOpenDel = () => setOpenDel(true);
    const handleCloseDel = () => setOpenDel(false);

    const [openMaps, setOpenMaps] = useState(false);
    const handleOpenMaps = () => setOpenMaps(true);
    const handleCloseMaps = () => setOpenMaps(false);

    const [retDish, setRetDish] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showBreakDown, setShowBD] = useState(false);

    const [openAlert, setOpenAlert] = useState(false);
    const [alertMess, setAlertMess] = useState("");
    const alertClose = () => {
        setOpenAlert(false)
        navigate('/');
    };

    const Retrieving = async () => {
        await axios({
            method: 'post',
            url: process.env.REACT_APP_API_URL+"/retrieveDishByID",
            data: {
                dishID: dishID,
            }
        }).then((res) => {
            if(res.data.success){
                const data = res.data.dish;
                setUserID(data.userID);
                setCoordinates({lng: parseFloat(data.lng), lat: parseFloat(data.lat)})
                setAvail(data.available);
                setDishInfo(data);
                setPermissionGiven(data.permission == 1)
                setServings(data.servings);
                setrestoID(data.restoID);
                setdname(data.dishname);
                setrname(data.restoname);
                setImages(data.images);
                setAddress(data.address);
                setWalkinprice(data.walkinprice);
                setOnlineprice(data.onlineprice);
                setNumreviews(data.reviews.length);
                setNut(data.nut);
                setIng(data.ings);
                setAmount(data.amounts);
                setType(data.types);
                setProtein(data.protein);
                setPType(data.proteinSource);
                setreviews(data.reviews);

                const reviews = data.reviews;
                for (let k=0; k<reviews.length; k++) {
                    if(reviews[k].userID == userInfo.id) {
                        setrevAction("Edit");
                        setCurRev(reviews[k]);
                        break
                    }
                }

                setRatings(data.ratings);
                setPay(data.paymentOptions);
                
                const ingCount = data.types.length;
                const cat1 = []
                const catAmount = [] 
                let total = 0;

                for (let i=0; i<ingCount; i++) {
                    const dtype = data.types[i];
                    const amountsT = data.amounts[i] * 100;
                    const ind = cat1.indexOf(dtype);
                    total += amountsT;

                    if(ind == -1) {
                        cat1.push(dtype)
                        catAmount.push(amountsT)

                    } else {
                        catAmount[ind] += amountsT;
                    }
                }
                
                for (let i=0; i<cat1.length; i++) {
                    catAmount[i] = (catAmount[i]/total*100).toFixed(2);;
                }
                setCat(cat1);
                setcatper(catAmount);

                setRetDish(true);
                setLoading(false);
            } else{
                // alert(res.data.message);
                setOpenAlert(true);
                setAlertMess("Having trouble retrieving this dish's information. Please try again later.");
                // navigate('/');
            }
    })}

    useEffect(() => {
        if(!retDish && !loading) {
            setLoading(true);
            Retrieving();
        }
    }, []);

    // Rate Comp
    const rateFun = (rate, iconSize) => {
        const numFilled = Math.floor(rate, 1)
        const filled = Array(numFilled).fill(<FaStar size={iconSize}/>)
        const halfed = Array(rate-numFilled == 0 ? 0 : 1).fill(<FaStarHalfAlt size={iconSize}/>)
        const tempstars = filled.concat(halfed)
        const outlined = Array(5-tempstars.length).fill(<FaRegStar size={iconSize}/>)
        return tempstars.concat(outlined)
    }
    const stars = rateFun(rating, 25)

    const ReviewsRet = () => {
        if(Reviews.length == 0) {
            return "No reviews yet."
        } else {
            console.log(Reviews);
            return Reviews.map((rev) => {
                        return <table id='revTable'> <tr>
                            <td style={{width: "30px"}}>
                                <div style={{left: "4px", position: "relative"}}>< CgProfile size={25}/></div>
                            </td>
                            <td className='rp1'>
                                <table style={{position: "relative", marginTop: "-6px", width: "100%"}}><tr>
                                    <td> <div style={{ marginLeft: "-2px", textAlign: "left"}}>{rev.username}</div></td>
                                    <td style={{textAlign: "right", paddingRight: "5px", fontSize: "15px"}}> {months[parseInt(rev.datePosted.substring(5, 7))]} {rev.datePosted.substring(8, 10)} {rev.datePosted.substring(0, 4)} {
                                    parseInt(rev.datePosted.substring(11, 13)) < 10 ? "0"+(parseInt(rev.datePosted.substring(11, 13))) : (parseInt(rev.datePosted.substring(11, 13)))}
                                    {rev.datePosted.substring(13, 19)}</td>
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
                            <td className='rp3'><p style={{margin: "0px", marginBottom: "5px", textAlign: "left"}}>{rev.review}</p></td>
                        </tr>
                        {/* <tr>
                            <td></td>
                            <td className='rp4'>
                            </td>
                        </tr> */}
                        </table>
                    })
        }
    }

    // Ingredients Components
    const ingRet = () => {
        return <table className='ingTable'>
            <tr>
                {/* <th style={{width: "20%"}}>Amount (g)</th> */}
                <th style={{width: "60%"}}>Ingredient</th>
                <th style={{width: "40%"}}>Food Type</th>
            </tr>
            {
                ing.map((ing1, index) => {
                    return (
                        <tr>
                            {/* <td>{(ingGrams[index]/servings).toFixed(2)} g</td> */}
                            <td>{ing1}</td>
                            <td>{ingType[index]}</td>
                        </tr>
                    )
                })
            }
        </table>
    }

    const nutRet = () => {
        return <table className='nutTable'>
            <tr>
                <th>Energy, calculated (kcal)</th>
                <th>{nut.ingCalories} kcal</th>
            </tr>
            <tr><th colspan="2">Minerals</th></tr>
            <tr>
                <td>Sodium, Na</td>
                <td>{Number.isInteger(nut.ingSodium) ? nut.ingSodium+".0" : nut.ingSodium} mg</td>
            </tr>
            <tr>
                <td>Calcium, Ca</td>
                <td>{Number.isInteger(nut.ingCalcium) ? nut.ingCalcium+".0" : nut.ingCalcium} mg</td>
            </tr>
            <tr>
                <td>Phosphorus, P</td>
                <td>{Number.isInteger(nut.ingPhosphorus) ? nut.ingPhosphorus+".0" : nut.ingPhosphorus} mg</td>
            </tr>
            <tr>
                <td>Iron, Fe</td>
                <td>{Number.isInteger(nut.ingIron) ? nut.ingIron+".0" : nut.ingIron} mg</td>
            </tr>
            <tr>
                <td>Potassium, K</td>
                <td>{Number.isInteger(nut.ingK) ? nut.ingK+".0" : nut.ingK} mg</td>
            </tr>
            <tr>
                <td>Zinc, Zn</td>
                <td>{Number.isInteger(nut.ingZn) ? nut.ingZn+".0" : nut.ingZn} mg</td>
            </tr>
            <tr><th colspan="2">Water-Soluble Vitamins</th></tr>
            <tr>
                <td>Retinol, Vitamin A</td>
                <td>{Number.isInteger(nut.ingA) ? nut.ingA+".0" : nut.ingA} µg</td>
            </tr>
            <tr>
                <td>beta-Carotene</td>
                <td>{Number.isInteger(nut.ingBC) ? nut.ingBC+".0" : nut.ingBC} µg</td>
            </tr>
            <tr>
                <td>Retinol Activity Equivalent, RAE</td>
                <td>{Number.isInteger(nut.ingRAE) ? nut.ingRAE+".0" : nut.ingRAE} µg</td>
            </tr>
            <tr>
                <th colspan="2">Water-Soluble Vitamins</th>
            </tr>
            <tr>
                <td>Thiamin, Vitamin B1</td>
                <td>{Number.isInteger(nut.ingB1) ? nut.ingB1+".0" : nut.ingB1} mg</td>
            </tr>
            <tr>
                <td>Riboflavin, Vitamin B2</td>
                <td>{Number.isInteger(nut.ingB2) ? nut.ingB2+".0" : nut.ingB2} mg</td>
            </tr>
            <tr>
                <td>Niacin</td>
                <td>{Number.isInteger(nut.ingNiacin) ? nut.ingNiacin+".0" : nut.ingNiacin} mg</td>
            </tr>
            <tr>
                <td>Niacin from Trytophan</td>
                <td>{Number.isInteger(nut.ingNT) ? nut.ingNT+".0" : nut.ingNT} mg</td>
            </tr>
            <tr>
                <td>Ascorbic Acid, Vitamin C</td>
                <td>{Number.isInteger(nut.ingC) ? nut.ingC+".0" : nut.ingC} mg</td>
            </tr>
        </table>
    }

    const [NutIngRevTag, setNutIngRevTag] = useState(0);
    const [walkdel, setWalkDel] = useState(true);

    const [openDish, setOpenDish] = useState(false);
    const handleOpenDish = () => setOpenDish(true);
    const handleCloseDish = () => setOpenDish(false);

    const [width, setWidth] = useState(window.innerWidth)
    const [height, setHeight] = useState(window.innerHeight)

    window.onresize = function(event) {
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
    }
    const style1 = {
        height: height-(isMobile? 160 : 93), 
        textAlign: isMobile ? 'center' : 'left',
    }
    const style2 = {
        marginLeft: width/2+40,
    }

    const style3 = {
        marginLeft: "auto",
        marginRight: "auto",
        position: "relative"
    }

    const style4 = {
        borderBottom: "1px solid rgba(0, 0, 0, 0)",
        opacity: 1
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const cedReview = [
        "Add", "Edit", "Delete" 
    ]

    const [delAction, setDelAction] = useState("");
    const [delID, setDelID] = useState(-1);
    const cedReviewIndex = 0;

    if (!retDish) {
        return <div style={{
            marginTop: isMobile ? -35 : -85, 
            height: isMobile ? window.innerHeight - (118.36) : window.innerHeight,
            alignContent: 'center'}}>
            <ProgressBar1 height={200}/>
        </div>
    } else {
        return (
            <div className='DishPage' style={style1}>
                <div style={{width: isMobile ? width-15 : width/2}} className={isMobile ? "" : "Carousel"}>
                    <Carousel useKeyboardArrows={true} showArrows={true} swipeable={true}
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
                    </Carousel>
                </div>
                {/* {isMobile ? <button className='address' style={{
                        borderBottom: "1px solid #ededed", padding: 5,
                        maxWidth: 105, fontFamily: "Rubik", color: (avail == 1 ? "#013B3F": "#6e2323")}}>{avail == 1 ? "Available" : "Not Available"}</button> 
                        : null} */}
                <div className="dishBody" style={isMobile ? {} : style2}>
                    <table className='resto' style={isMobile? {marginTop: -20} : {}}>
                        <tr>
                            <td style={{maxWidth: 120}}>
                            <button onClick={() => navigate('/restaurant/'+restoID)}
                            className='address' style={{fontFamily: "Rubik", width: "100%"}}><u>{rname}</u></button> 
                            </td>
                            <td style={{maxWidth: width*2 < 200 ? (width/2)-10 : 200}}>
                                <button onClick={handleOpenMaps} className='address' style={{fontFamily: "Rubik", width: "100%"}}><MdLocationPin /> <u>{address}</u></button>
                            </td>
                            {!isMobile ? 
                            <td style={{maxWidth: 105}}>
                                <button className='address' style={{fontFamily: "Rubik", color: (avail == 1 ? "#013B3F": "#6e2323")}}>{avail == 1 ? "Available" : "Not Available"}</button>
                            </td> : null } 
                        </tr>
                        {/* {isMobile ? 
                        <tr>
                            <td style={{maxWidth: 105}}>
                                <button className='address' style={{fontFamily: "Rubik", color: (avail == 1 ? "#013B3F": "#6e2323")}}>{avail == 1 ? "Available" : "Not Available"}</button>
                            </td></tr> : null }  */}
                    </table>
                    <table style={ isMobile? {position: 'relative', marginLeft: "auto", marginRight: "auto", marginTop: 10} : {position: 'relative'}}>
                        {isMobile ? <tr>
                            <td colSpan={3} style={{fontFamily: "Rubik", color: (avail == 1 ? "#013B3F": "#6e2323")}}><p style={{margin: 0, marginTop: -5}}>{avail == 1 ? "Available" : "Not Available"}</p></td>
                        </tr> : null}
                        <tr>
                            <td><p id='dname' style={{marginTop: isMobile ? 0 : 3, textAlign: userInfo.id == userID ? "right" : "center"}}>{dname}</p></td>
                            {userInfo.id == userID ? <td style={{paddingTop: 5}}><BiEditAlt size={40} onClick={handleOpenDish}/></td> : null}
                            {userInfo.id == userID ? <td style={{paddingTop: 5}}><RiDeleteBin6Line size={40} onClick={() => {
                                handleOpenDel()
                                setDelAction("dish");
                                setDelID(dishID);
                                }}/></td> : null}
                        </tr>
                    </table>
                    <table id='rateTable' style={isMobile ? style3 : {left: "-8px"}}>
                        <tr>
                            <td>
                                <p id='stars'>{
                                    stars.map((star) => star)
                                }</p>
                            </td>
                            <td>
                                <p>{Number.isInteger(rating) ? rating+".0" : rating} ({numRev})</p>
                            {/* <td colSpan={3} style={{fontFamily: "Rubik", color: (avail == 1 ? "#013B3F": "#6e2323")}}>{avail == 1 ? "Available" : "Not Available"}</td> */}

                            </td>
                            {userInfo.type == "reviewer" && !isMobile ? 
                            <td><button style={{fontSize: 17}} onClick={ handleOpen }>{revAction == "Edit" ? "Edit" : "Write a"} Review {revAction == "Add" ? <FiPlusCircle /> : <BiEditAlt />}</button>
                            </td> : null}
                            {userInfo.type == "reviewer" && revAction == "Edit" && !isMobile ? 
                            <td><button style={{fontSize: 17}} onClick={ () => {
                                handleOpenDel();
                                setDelAction("review");
                                setDelID(curRev.reviewID);
                            }}>Delete Review <RiDeleteBin6Line /></button>
                            </td> : null}
                        </tr>
                    </table>
                    {isMobile ? 
                    <table id='rateTable' style={isMobile ? style3 : {left: "-8px"}}>
                        <tr>
                            <td><button style={{fontSize: 17}} onClick={ handleOpen }>{revAction == "Edit" ? "Edit" : "Write a"} Review {revAction == "Add" ? <FiPlusCircle /> : <BiEditAlt />}</button>
                            </td>

                            {userInfo.type == "reviewer" && revAction == "Edit" ? 
                            <td><button style={{fontSize: 17}} onClick={ () => {
                                handleOpenDel();
                                setDelAction("review");
                                setDelID(curRev.reviewID);
                            }}>Delete Review <RiDeleteBin6Line /></button>
                            </td >: null}

                        </tr>
                    </table> :null}

                    <table className='priceTable' style={isMobile ? style3 : {left: "-13px"}}>
                        <tr>
                            <td id="p0">
                                <p id='price'>{walkdel ? "Walk-in Price:" : "Price Online:"}</p> 
                            </td>
                            <td id="p1">
                                <p>P {walkdel ? walkinPrice : delPrice}</p>
                            </td>
                            {delPrice ? <td id="p2">
                                <button onClick={() => setWalkDel(!walkdel)}> Check Prices </button>
                            </td> : null}
                        </tr>
                    </table>
                    <p className='tags1'>Accepting Payments via: {
                        paymentTags.map((pay) => {
                            return (
                                <button className='paymentTags'> {pay} </button>
                            )
                        })
                    }</p>

                    {isMobile ? 
                        <button className="switch1" style={!showBreakDown ? style4 : {}} onClick={() => setShowBD(false)}>Protein</button> 
                        : null}
                    
                    {isMobile ? 
                        <button className="switch1" style={showBreakDown ? style4 : {}} onClick={() => setShowBD(true)}>Breakdown</button> 
                        : null}

                    <table className="BRTable" style={isMobile ? {maxWidth: 543, marginLeft: "auto", marginRight: "auto", position: "relative", marginTop: -3} : {}}>
                        <tr>
                            <td style={isMobile ? {border: "1px solid #ededed", padding: 15} : {}}>
                                {!isMobile ? <p className='tags'>Protein:</p> : null}
                                {!isMobile || !showBreakDown ? 
                                    <table className='proteinTable'>
                                        {
                                            protein.length > 0 ? protein.map((prot, index) => {
                                                return (
                                                    <tr>
                                                        <td> {prot} </td>
                                                        <td style={{width: "40%"}}> {proteinType[index]} </td>
                                                    </tr>
                                                )
                                            }) : "This dish has no proteins."
                                        }
                                    </table>
                                    : <table className="catTable">{
                                        Categories.map((cat, index) => {
                                            return (
                                                    <tr>
                                                        <td style={{width: "30%", textAlign: 'center'}}> {catPercent[index]}% </td>
                                                        <td style={{paddingLeft: 8, textAlign: 'center'}}> {cat} </td>
                                                    </tr>
                                            )
                                        })
                                    }</table>
                                }
                            </td>
                            {!isMobile ? <td>
                                <p className='tags'>Breakdown: </p>
                                <table className="catTable">{
                                    Categories.map((cat, index) => {
                                        return (
                                                <tr>
                                                    <td style={{width: 40}}> {catPercent[index]}% </td>
                                                    <td style={{paddingLeft: 8}}> {cat} </td>
                                                </tr>
                                        )
                                    })
                                }</table>
                            </td>:null}
                    </tr>
                    </table>
                    <button className="switch1" style={NutIngRevTag == 0 ? style4 : {}} onClick={() => setNutIngRevTag(0)}>Nutrition Table</button> 
                    <button className="switch1" style={NutIngRevTag == 1 ? style4 : {}} onClick={() => setNutIngRevTag(1)}>Reviews</button>
                    {permission ? <button className="switch1" style={NutIngRevTag == 2 ? style4 : {}} onClick={() => setNutIngRevTag(2)}>Ingredients</button> : null }
                    <div className='switchable-textarea'>
                        {
                            NutIngRevTag == 0 ? nutRet() :
                            NutIngRevTag == 1 ? ReviewsRet() :
                            NutIngRevTag == 2 && permission ? ingRet() :
                            ""
                        }
                    </div>
                    <AddReview open={open} handleClose={handleClose} height={height} dishID={dishID} action={revAction} curRev={curRev}/>
                    <GMaps open={openMaps} handleClose={handleCloseMaps} coordinates={coordinates} address={address} height={height} width={width} permissionGiven={false} restoName={rname} />
                    <AddDishModal open={openDish} handleClose={handleCloseDish} height={height} action={"Edit"} loadingModal={!retDish} restoID={restoID} dishData={dishInfo} isMobile={isMobile}/>
                    <DeleteModal open={openDel} handleClose={handleCloseDel} userInfo={userInfo} ID={delID} type={delAction} name={dname} rname={rname}/>
                    <AlertModal open={openAlert} handleClose={alertClose} message={alertMess} isSuccess={false}/>
                </div>
            </div>
        );
    }
}
    
export default DishPage;