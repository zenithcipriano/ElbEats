import React  from 'react';
import { useState, useEffect } from "react";
import "./ProfilePage.css";
import "./OwnerPage.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CgProfile } from "react-icons/cg";

import { FiPlusCircle } from "react-icons/fi";
import DishCardTable from './DishCardTable';
import AddRestoModal from './AddRestoModal';
import "@fontsource/rubik";
import ProgressBar1 from './progress';
import { BiEditAlt } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiOutlineCursorClick } from "react-icons/hi";
import DeleteModal from './DeleteModal';
import AlertModal from './alertModal';

function OwnerPage({isMobile}) {
    const navigate = useNavigate();
    const [width, setWidth] = useState(window.innerWidth)
    const [height, setHeight] = useState(window.innerHeight)
    const CardWidth = 320;
    const ProfWidth = 237;

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

        const col = Math.floor( tableWidth/ CardWidth);
        resizeDishes(col, dishes, 1);
    }

    const [username, setuname] = useState("");
    const [aboutYou, setDesc] = useState("");
    const [restos, setRestos] = useState([]);
    const [dishes, setDishes] = useState([0]);
    const [resizeDishesV, setRD] = useState([[0]]);
    const [curResto, setResto] = useState(0);
    const [action, setAction] = useState("");

    const changeResto = async (index) => {
        if(index != curResto) {
            setResto(index)
            setRetDish(false);
            
            await axios({
                method: 'post',
                url: process.env.REACT_APP_API_URL+"/retrieveDishesOwnedbyResto",
                data: {
                    restoID: restos[index].restoID,
                }
            }).then((res) => {
                if(res.data.success){
                    // alert(JSON.stringify(res.data));
                    const dishes = res.data.dishList;

                    if(dishes.length > 0) {
                        const tempDishes = dishes;
                        const placeholderCard = [0];
                        setDishes(placeholderCard.concat(tempDishes));
                        let tableWidth = 0;

                        if(isMobile) {
                            tableWidth = width-10
                        } else if(width / 4 < ProfWidth) {
                            tableWidth = width-ProfWidth;
                        } else {
                            tableWidth = 3*width/4
                        }
                        
                        resizeDishes(Math.floor(tableWidth / CardWidth), placeholderCard.concat(tempDishes), 0);
                    } else {
                        setDishes([0]);
                        setRD([[0]]);
                    }
                } else{
                    setOpenAlert(true);
                    setAlertMess("Having trouble retrieving dish information. Please try again later.");
                    // alert(res.data.message);
                }
                setRetDish(true);
    })}}

    const userInfo = {
        id: localStorage.getItem("user_reference"),
        type: localStorage.getItem("user_type")
    }
    const [retDish, setRetDish] = useState(false);
    const [loading, setLoading] = useState(false);

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
            url: process.env.REACT_APP_API_URL+"/retrieveUserById",
            data: {
                userID: userInfo.id,
            }
        }).then((res) => {
            if(res.data.success){
                const user = res.data.user;

                setuname(user.username);
                setDesc(user.aboutYou);

                const restos = res.data.restos;
                setRestos(restos);
                setOpen(restos.length > 0 ? false : true)
                setLoadingModal(restos.length > 0 ? true : false);
                setAction(restos.length > 0 ? "" : "Add");

                const dishes = res.data.dishes;

                if(dishes.length > 0) {
                    const tempDishes = dishes;
                    const placeholderCard = [0];
                    setDishes(placeholderCard.concat(tempDishes));
                    let tableWidth = 0;

                    if(isMobile) {
                        tableWidth = width-10
                    } else if(width / 4 < ProfWidth) {
                        tableWidth = width-ProfWidth;
                    } else {
                        tableWidth = 3*width/4
                    }
                    
                    resizeDishes(Math.floor(tableWidth / CardWidth), placeholderCard.concat(tempDishes), 0);
                } else {
                    setDishes([0]);
                    setRD([[0]]);
                }
            } else{
                setOpenAlert(true);
                setAlertMess("Having trouble retrieving user and restaurant information. Please try again later.");
                // alert(res.data.message);
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

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [openDel, setOpenDel] = useState(false);
    const handleOpenDel = () => setOpenDel(true);
    const handleCloseDel = () => setOpenDel(false);

    const [loadingModal, setLoadingModal] = useState(true);
    const [loadingModalDish, setLoadingModalDish] = useState(false);
    const [restoData, setRestoData] = useState({});

    const [openAlert, setOpenAlert] = useState(false);
    const [alertMess, setAlertMess] = useState("");
    const alertClose = () => {setOpenAlert(false)};

    const retrieveRestoInfo =  async (act) => {
        setAction(act)
        if (act == "Add") {
            setRestoData({});
            setLoadingModal(false);
            handleOpen();
        } else if (act == "Edit"){
            await axios({
                method: 'post',
                url: process.env.REACT_APP_API_URL+"/retrieveRestoById",
                data: {
                    restoID: restos[curResto].restoID
                },
            }).then((res) => {
                if(res.data.success){
                    const data = res.data.resto;
                    // console.log(data);
                    setRestoData(data);
                    handleOpen();
                } else {
                    setOpenAlert(true);
                    setAlertMess("Having trouble retrieving restaurant information. Please try again later.");
                    // alert(res.data.message);
                }
                setLoadingModal(false);
            })
        }
    }

    if (!retDish) {
        return <div
            style={{
                height: isMobile ? height-233 : height-158,
                alignContent: 'center'
            }}>
            <ProgressBar1 height={200}/>
        </div>
    } else {
        return <div className="OwnerPage">
            <table className='ProfileTable'>
                    <tr>
                        {!isMobile ? <td style={{width: width/4, padding: 20, paddingTop: 0}}>
                            <div id='profileIcon'><CgProfile size={150}/></div>
                            <div className='userProfile'>
                                <h1 style={{paddingBottom: 20}}>{username}</h1>
                            </div>
                        </td> : null}
                        {/* isMobile ? {paddingTop: 20} : {padding: 20, paddingRight: 0} */}
                        <td style={isMobile ? {} : {padding: 20, paddingRight: 10, paddingTop: 0}}>
                            <table className='OwnerTable'>
                                {/* {isMobile ? <tr><td style={{padding: 10}}>
                                    <div id='profileIcon'><CgProfile size={150}/></div>
                                    <div className='userProfile'>
                                        <h1 style={{paddingBottom: 20}}>{username}</h1>
                                    </div>
                                    </td></tr> : null } */}
                                <tr>
                                    <td>
                                        {restos.length == 0 ? <table 
                                        // align={width <= 805 ? "center" : (restos.length == 0 ? "left" : "right")}
                                         align='left'
                                         className='restoTabs' style={{borderSpacing: 5, marginTop: -5, marginBottom: (width/4 < ProfWidth ? 0 : -10)}}>
                                            <tr>
                                                <td>
                                                {/* <button className='restoCardtd' style={{padding: 10, fontFamily: "Rubik"}}>
                                                    <table style={{position: 'relative'}}>
                                                        <tr>
                                                            <td><b className='restoName' onClick={() => navigate('/restaurant/'+restos[curResto].restoID)}>View</b></td>
                                                            <td style={{paddingTop: 5}}><HiOutlineCursorClick size={20} /></td>
                                                        </tr>
                                                    </table></button> */}
                                                <button className='restoCardtd' style={{padding: 10, fontFamily: "Rubik"}}>
                                                    <table style={{position: 'relative'}} onClick={() => {retrieveRestoInfo("Add")}}>
                                                        <tr>
                                                            <td><b className='restoName'>Enter Your Restaurant Details</b></td>
                                                            <td style={{paddingTop: 5}}><FiPlusCircle size={20} /></td>
                                                        </tr>
                                                    </table></button>
                                                {/* <button className='restoCardtd' style={{padding: 10, fontFamily: "Rubik"}}>
                                                <table style={{position: 'relative'}} onClick={() => {retrieveRestoInfo("Edit")}}>
                                                        <tr>
                                                            <td><b className='restoName'>Edit Your Restaurant Details</b></td>
                                                            <td style={{paddingTop: 5}}><BiEditAlt size={20}/></td>
                                                        </tr>
                                                    </table> </button>
                                                <button className='restoCardtd' style={{padding: 10, fontFamily: "Rubik"}}>
                                                    <table style={{position: 'relative'}} onClick={handleOpenDel}>
                                                        <tr>
                                                            <td><b className='restoName'>Delete Restaurant</b></td>
                                                            <td style={{paddingTop: 5}}><RiDeleteBin6Line size={20}/></td>
                                                        </tr>
                                                    </table></button> */}
                                                </td>
                                            </tr>
                                        </table> : null}
                                                    {
                                                        restos.map((rest, index) => {
                                                            return (
                                                            <table className='restoCardtd' style={{padding: 10, borderBottom: "3px solid white"}}> 
                                                                <tr>
                                                                    <td> 
                                                                        <button className='restoCard' 
                                                                        // onClick={() => changeResto(index)} 
                                                                        style={{fontFamily: "Rubik", textAlign: "left"
                                                                        // maxWidth: width <= 805 ? 500 : 200
                                                                        }} onClick={() => navigate('/restaurant/'+restos[curResto].restoID)}>
                                                                        <b className='restoName'>{rest.restoname}</b><br/>
                                                                        <a className='restoLoc'>{rest.restoLocation}</a>
                                                                        </button></td>
                                                                        <td onClick={() => {retrieveRestoInfo("Edit")}}>
                                                                            <BiEditAlt size={30} />
                                                                        </td>
                                                                        <td onClick={handleOpenDel}>
                                                                            <RiDeleteBin6Line size={30} />
                                                                        </td>
                                                                    {/* <td><HiOutlineCursorClick size={20} /></td> */}
                                                                </tr>
                                                            </table>

                                                            )
                                                        })
                                                    }
                                    </td>
                                </tr>
                                </table>
                                {
                                    restos.length > 0 ?
                                        <div className='dishdiv' style={{
                                            height: isMobile ? height-233 : height-158, 
                                            // height: width <= 805 ? height-293 : (isMobile ? height-233 : height-158), 
                                            width: isMobile? width-10 : (width/4 > ProfWidth ? (3*width/4) : width-ProfWidth),
                                            marginLeft: 2.5,
                                            // marginLeft: "auto", marginRight: "auto"
                                            }}>
                                            <table style={{position: "relative", borderSpacing: "20px 10px", paddingRight: 20}}>
                                                <DishCardTable dishList={resizeDishesV} navigate={navigate} privilege={true} loadingModalDish={loadingModalDish} height={height} restoID={restos[curResto].restoID} isMobile={isMobile}/>
                                            </table>
                                        </div> : null
                                }
                        </td>
                    </tr>
                </table>
            <AddRestoModal open={open} handleOpen={handleOpen} handleClose={handleClose} userInfo={userInfo} height={height} action={action} restoID={restos.length > 0 ? restos[curResto].restoID : null} restoData={restoData} loadingModal={loadingModal} width={width}/>  
            <DeleteModal open={openDel} handleClose={handleCloseDel} userInfo={userInfo} ID={restos.length > 0 ? restos[curResto].restoID : null} type={"restaurant"} name={restos.length > 0 ? restos[curResto].restoname : null}/>
            <AlertModal open={openAlert} handleClose={alertClose} message={alertMess} isSuccess={false}/>
        </div>
    }
}

export default OwnerPage;