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
import AddDishModal from './AddDishModal';

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
        if(window.innerWidth / 4 < ProfWidth) {
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

                        if(width / 4 < ProfWidth) {
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
                    alert(res.data.message);
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
                const dishes = res.data.dishes;

                if(dishes.length > 0) {
                    const tempDishes = dishes;
                    const placeholderCard = [0];
                    setDishes(placeholderCard.concat(tempDishes));
                    let tableWidth = 0;

                    if(width / 4 < ProfWidth) {
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
                alert(res.data.message);
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

    const retrieveRestoInfo =  async (act) => {
        handleOpen()
        setAction(act)
        if (act == "Add") {
            setRestoData({});
            setLoadingModal(false)
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
                } else {
                    alert(res.data.message);
                }
                setLoadingModal(false);
            })
        }
    }

    if (!retDish) {
        return <ProgressBar1 height={200}/>
    } else {
        return <div className="OwnerPage">
            <table className='ProfileTable'>
                    <tr>
                        <td style={{width: width/4}}>
                            <div id='profileIcon'><CgProfile size={150}/></div>
                            <div className='userProfile'>
                                <h1 style={{paddingBottom: 20}}>{username}</h1>
                                {/* <h3>{aboutYou ? aboutYou : "Edit Your Description Here"}</h3> */}
                            </div>
                        </td>
                        <td style={{paddingRight: 10}}>
                            <table className='OwnerTable'>
                                <tr>
                                    <td>
                                        <table align={width/4 < ProfWidth ||  restos.length == 0 ? "left" : "right"} className='restoTabs' style={{borderSpacing: 5, marginTop: -5, marginBottom: (width/4 < ProfWidth ? 0 : -10)}}>
                                            <tr>
                                            {/* marginLeft: width/4 < ProfWidth && width-ProfWidth < 353 ? width-ProfWidth - 353 : 0 */}
                                                {/* <td style={{padding: 10}}> 
                                                    <b className='restoName' onClick={handleOpen}>Restaurant: </b>
                                                </td> */}
                                                {restos.length > 0 ? <td className='restoCardtd' style={{padding: 10}}> 
                                                    <table style={{position: 'relative'}}>
                                                        <tr>
                                                            <td><b className='restoName' onClick={() => navigate('/restaurant/'+restos[curResto].restoID)}>View</b></td>
                                                            <td style={{paddingTop: 5}}><HiOutlineCursorClick size={20} /></td>
                                                        </tr>
                                                    </table>
                                                </td> : null}
                                                <td className='restoCardtd' style={{padding: 10}} onClick={() => {retrieveRestoInfo("Add")}}> 
                                                    <table style={{position: 'relative'}}>
                                                        <tr>
                                                            <td><b className='restoName'>Add</b></td>
                                                            <td style={{paddingTop: 5}}><FiPlusCircle size={20} /></td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                {restos.length > 0 ? <td className='restoCardtd' style={{padding: 10}} onClick={() => {retrieveRestoInfo("Edit")}}>
                                                <table style={{position: 'relative'}}>
                                                        <tr>
                                                            <td><b className='restoName'>Edit</b></td>
                                                            <td style={{paddingTop: 5}}><BiEditAlt size={20}/></td>
                                                        </tr>
                                                    </table> 
                                                </td> : null}
                                                {restos.length > 0 ? <td className='restoCardtd' style={{padding: 10}} onClick={handleOpenDel}> 
                                                    <table style={{position: 'relative'}}>
                                                        <tr>
                                                            <td><b className='restoName'>Delete</b></td>
                                                            <td style={{paddingTop: 5}}><RiDeleteBin6Line size={20}/></td>
                                                        </tr>
                                                    </table>
                                                </td> : null}
                                            </tr>
                                        </table>
                                            <table className='restoTabs'> 
                                                <tr>
                                                    {
                                                        restos.map((rest, index) => {
                                                            return (
                                                            <td className='restoCardtd' style={curResto == index ? {borderBottom: "3px solid white"} : {opacity: .3}}> 
                                                                <button className='restoCard' onClick={() => changeResto(index)} style={{fontFamily: "Rubik"}}>
                                                                <b className='restoName'>{rest.restoname}</b><br/>
                                                                <a className='restoLoc'>{rest.restoLocation}</a>
                                                                </button>
                                                            </td>
                                                            )
                                                        })
                                                    }
                                                </tr>
                                            </table>
                                    </td>
                                </tr>
                                </table>
                                {
                                    restos.length > 0 ?
                                        <div className='dishdiv' style={{height: isMobile ? height-253 : height-178, width: width/4 > ProfWidth ?(3*width/4) : width-ProfWidth}}>
                                            <table style={{position: "relative", borderSpacing: "20px 10px", paddingRight: 20}}>
                                                <DishCardTable dishList={resizeDishesV} navigate={navigate} privilege={true} loadingModalDish={loadingModalDish} height={height} restoID={restos[curResto].restoID}/>
                                            </table>
                                        </div> : null
                                }
                        </td>
                    </tr>
                </table>
            <AddRestoModal open={open} handleOpen={handleOpen} handleClose={handleClose} userInfo={userInfo} height={height} action={action} restoID={restos.length > 0 ? restos[curResto].restoID : null} restoData={restoData} loadingModal={loadingModal} width={width}/>  
            <DeleteModal open={openDel} handleClose={handleCloseDel} userInfo={userInfo} ID={restos.length > 0 ? restos[curResto].restoID : null} type={"restaurant"} name={restos.length > 0 ? restos[curResto].restoname : null}/>
        </div>
    }
}

export default OwnerPage;