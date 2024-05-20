import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useState, useEffect, useCallback } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import "./addrestomodal.css";
import axios from 'axios';
import "@fontsource/rubik";
import ProgressBar1 from './progress';
import {useDropzone} from 'react-dropzone'
import { Carousel } from "react-responsive-carousel";
import { colors } from '@mui/material';
import GMaps from './locationModal';
import { MdLocationPin } from "react-icons/md";

function AddRestoModal ({open, handleClose, userInfo, height, action, restoID, restoData, loadingModal, width}) {
    const style = {
        position: 'absolute',
        fontFamily: "Rubik",
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        height: 3*height/4,
        overflowY: "scroll",
        padding: 2
    };

    const resetButton = () => {
        setAddress("");
        setDaysOpen(Array(7).fill(false));
        setDesc("");
        setEmail("");
        setFB("");
        setMainPicture([]);
        setInsta("");
        setNum("");
        setX("");
        setopenT("");
        setcloseT("");
        setpay(new Array(pays.length).fill(false));
        setname("");
        setMainPicture([]);
    }

    const userID = userInfo.id;
    const [restoname, setname] = useState("");
    const handleNameChange = (event) => setname(event.target.value);
    const [location, setAddress] = useState("");
    const handleAddChange = (event) => setAddress(event.target.value);
    const [restoDesc, setDesc] = useState("");
    const handleDescChange = (event) => setDesc(event.target.value);

    const [openingTime, setopenT] = useState("");
    const handleOpenT = (event) => setopenT(event.target.value);
    const [closingTime, setcloseT] = useState("");
    const handleCloseT = (event) => setcloseT(event.target.value);
    const dow = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const [days, setDaysOpen] = useState(new Array(dow.length).fill(false));
    const handleDays = (position) => {
        const updated = days.map((item, index) =>
            index === position ? !item : item
        );

        setDaysOpen(updated);
    }

    const pays = ["Cash", "GCash", "Debit/Credit Card", "Bank Transfer"]
    const [paymentOptions, setpay] = useState(new Array(pays.length).fill(false));
    // const [days, setDaysOpen] = useState(new Array(7).fill(false));
    const handlePays = (position) => {
        const updated = paymentOptions.map((item, index) =>
            index === position ? !item : item
        );

        setpay(updated);
    }

    const [cpNum, setNum] = useState("");
    const handleNum = (event) => setNum(event.target.value);
    const [email, setEmail] = useState("");
    const handleEmail = (event) => setEmail(event.target.value);
    const [facebook, setFB] = useState("");
    const handleFB = (event) => setFB(event.target.value);
    const [instagram, setInsta] = useState("");
    const handleInsta = (event) => setInsta(event.target.value);
    const [twitter, setX] = useState("");
    const handleX = (event) => setX(event.target.value);

    const [coordinates, setCoordinates] = useState({lat: 14.1673913, lng: 121.2430767});
    const [openMaps, setOpenMaps] = useState(false);
    const handleOpenMaps = () => setOpenMaps(true);
    const handleCloseMaps = () => setOpenMaps(false);

    // const [images, setImages] = useState([
    //     "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"
    // ]);
  

    const [ret, setRet] = useState(false);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if(!ret) {
            setRet(true);

            const formData = new FormData();
            mainPicture.forEach((image) => {
                if (image.preview) {
                    // console.log(image);
                    formData.append("file", image);
                }
            });

            let dotw = ""
            days.forEach((dy, index) => {
                if(dy) {
                    dotw += (index+1)
                }
            })
            
            let pm = [];
            paymentOptions.forEach((py, index) => {
                if(py) {
                    pm.push(pays[index]);
                }
            })

            if(pm.length == 0 && !dotw) {
                alert("Missing:\n Days of the Week\n Modes of Payment");
                setRet(false);
                return
            }else if(!dotw) {
                alert("Missing: Days of the Week");
                setRet(false);
                return
            } else if (pm.length == 0) {
                alert("Missing: Modes of Payment");
                setRet(false);
                return
            }

            if (!location) {
                alert("Missing: Restaurant Address");
                setRet(false);
                return
            }

            const newResto = {
                userID,
                restoname,
                location,
                restoDesc,
                openingTime: openingTime+":00",
                closingTime: closingTime+":00",
                days: dotw,
                paymentOptions: pm,
                cpNum, 
                email,       
                facebook,        
                instagram,       
                twitter,
                lat: coordinates.lat,
                lng: coordinates.lng
            }
            
            let counter = 0;
            const tempImages = [];
            console.log("start");
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/saveImages`, formData);
            mainPicture.forEach((image) => {
                if (image.preview) {
                    tempImages.push(response.data.imageUrl[counter]);
                    counter += 1;
                } else {
                    tempImages.push(image);
                }
            });
            newResto.images = tempImages;
            // console.log(tempImages);
            // setRet(false);
            if(action == "Add") {
                await axios({
                    method: 'post',
                    url: process.env.REACT_APP_API_URL+"/createResto",
                    data: newResto,
                }).then((res) => {
                    setRet(false);
                    if(res.data.success){
                        alert(res.data.message);
                        handleClose();
                        window.location.reload();
                    } else {
                        alert(`Restaurant '${restoname}' already exist in the system.`)
                        // alert("Creating New Restaurant Failed.")
                    }
                })
            } else if (action = "Edit"){
                newResto.restoID = restoID;
                await axios({
                    method: 'post',
                    url: process.env.REACT_APP_API_URL+"/updateResto",
                    data: newResto,
                }).then((res) => {
                    // alert(res.data.message);
                    setRet(false);
                    if(res.data.success){
                        alert(res.data.message);
                        handleClose();
                        window.location.reload();
                    } else {
                        alert(`Restaurant '${restoname}' already exist in the system.`)
                        // alert(`Updating Restaurant '${restoname}' failed.`)
                    }
                })
            } else {
                setRet(false);
            }
        }
    }

    useEffect(() => {
        if (restoData.restoID) {
            setCoordinates({lng: parseFloat(restoData.lng), lat: parseFloat(restoData.lat)})
            setname(restoData.restoname);
            setAddress(restoData.restoLocation);

            const tempDays = [];
            const dys = restoData.daysOfTheWeek;
            for (let i=0; i<7; i++) {
                tempDays.push(dys.includes((i+1).toString()));
            }
            setDaysOpen(tempDays);

            setDesc(restoData.restoDesc);
            setEmail(restoData.email);
            setFB(restoData.facebook);
            setMainPicture(restoData.images);
            // console.log(restoData.images);
            setInsta(restoData.instagram);
            setNum(restoData.cpNum);
            setX(restoData.twitter);
            setopenT(restoData.openingTime.substring(0,5));
            setcloseT(restoData.closingTime.substring(0,5));

            const tempPay = [];
            const pys = restoData.paymentOptions;
            for (let i=0; i<pays.length; i++) {
                tempPay.push(pys.includes(pays[i]));
            }

            setpay(tempPay);
        } else {
            resetButton()
        }
    }, [restoData]);
    // const [files, setFiles] = useState([]);
    // const selectFileHandler = (e) => {
    //     setFiles([...e.target.files]);
    //     console.log([...e.target.files]);
    // }

    // const onDrop = useCallback(acceptedFiles => {
    //     acceptedFiles.forEach((file) => {
    //         // console.log("hi");
    //         const reader = new FileReader()
      
    //         // reader.onabort = () => console.log('file reading was aborted')
    //         // reader.onerror = () => console.log('file reading has failed')
    //         // reader.onload = () => {
    //         // // // Do whatever you want with the file contents
    //         //   const binaryStr = reader.result
    //         //   console.log(binaryStr)
    //         // }
    //         console.log(file);
    //         console.log(reader.readAsArrayBuffer(file));
    //       })
    // }, [])
    const [mainPicture, setMainPicture] = useState([]);
    const removeImage = (index) => {
        const newList = [...mainPicture];
        newList.splice(index, 1);
        setMainPicture(newList);
    }

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.svg']
        },
        onDrop: (acceptedFiles) => {
            setMainPicture(mainPicture.concat(
                acceptedFiles.map((upFile) => Object.assign(upFile, {
                    preview: URL.createObjectURL(upFile)
                })))
            );
            // console.log(mainPicture);
        }
    })

    if(loadingModal || ret) {
        return <Modal 
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
                <Box sx={style}>
                        <ProgressBar1 height={200}/>
                    </Box>
            </Modal>
    } else if(openMaps) {
        return <GMaps open={openMaps} handleClose={handleCloseMaps} coordinates={coordinates} address={location} height={height} width={width} permissionGiven={true} restoName={restoname} setAddress={setAddress} setCoordinates={setCoordinates}/>
    } else {
        return <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        // style={{marginTop: 100}} 
        >
            <Box sx={style}>
                <table className='modalTable'>
                    <tr>
                        <td>
                            <h2>Restaurant Information </h2>
                        </td>
                        <td style={{textAlign: "right"}}> <IoIosCloseCircleOutline size={40} onClick={handleClose}/> </td>
                    </tr>
                </table>
                <form onSubmit={handleSubmit} style={{fontFamily: "Rubik", marginBottom: -15}}>
                    <table className="inputTables">
                        <tr>
                            <td colSpan={2}>
                                <fieldset>
                                    <legend>Restaurant Name: </legend>
                                    <input required type="text" value={restoname} onChange={handleNameChange} className='inputModal' placeholder='Kahit Saan'/>
                                </fieldset>
                                <fieldset onClick={handleOpenMaps}>
                                    <legend>Restaurant Address: </legend>
                                    <div className='inputModal' style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: 250}}><MdLocationPin/>{location ? location : "Click Me"}</div>
                                    {/* <input required type="text" value={location} className='inputModal' placeholder='Brgy. Batong Malake' disabled onChange={handleOpenMaps}/> */}
                                </fieldset>
                            </td>
                            <td colSpan={2} rowSpan={2}>
                                <fieldset>
                                    <legend>Images: </legend>
                                        {mainPicture.length > 0 ? 
                                            <Carousel useKeyboardArrows={true} showArrows={true} swipeable={true} showThumbs={false}
                                                statusFormatter={(current, total) => {
                                                    return (
                                                        <div style={{fontSize: 15, 
                                                            width: 250,
                                                            // border: "1px solid black",
                                                            marginTop: -18,
                                                            marginRight: -5,
                                                        }}>
                                                            <table style={{position: 'relative', width: "100%"}}>
                                                                <tr>
                                                                    <td style={{position: 'relative', width: 200, textAlign: "left"}}>{current} of {total}</td>
                                                                    <td style={{textAlign: "left", paddingTop: 5, zIndex: 100, }}> <IoIosCloseCircleOutline size={20} onClick={() => removeImage(current-1)} style={{backgroundColor: "rgba(255, 255, 255)", color: "#6e2323", borderRadius: 10}}/> </td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                    )
                                                }}
                                            >
                                                { mainPicture.map((upFile, index) => (
                                                    <div key={index} className="img-wrap">
                                                        <img src={upFile.preview ? upFile.preview : upFile} alt="..."/>
                                                    </div>
                                                ))}
                                            </Carousel>
                                        : <div style={{border: "1px solid #6e2323", padding: 5, position: 'relative', marginBottom: 10, padding: 75}}>
                                            No images.
                                        </div>
                                        }
                                        <div {...getRootProps()} >
                                        <input {...getInputProps()} />
                                            <div style={{border: "1px solid #6e2323", padding: 5, position: 'relative'}}>
                                                Drag 'n drop images here, or click to select files
                                            </div>
                                        </div>
                                        
                                </fieldset>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}><fieldset>
                                <legend>Restaurant Description (Optional): </legend>
                                <textarea rows={4} style={{fontFamily: "Rubik"}} value={restoDesc} onChange={handleDescChange} className='textAreaModal' placeholder="Description here."/>
                            </fieldset></td>
                        </tr>
                        <tr>
                            <td colSpan={1}><fieldset>
                                <legend>Opening time: </legend>
                                <input required type="time" className='timeI' style={{fontFamily: "Rubik"}} value={openingTime} onChange={handleOpenT}/>
                            </fieldset></td>
                            <td colSpan={1}><fieldset>
                                <legend>Closing time: </legend>
                                <input required type="time" className='timeI' style={{fontFamily: "Rubik"}} value={closingTime} onChange={handleCloseT} />
                            </fieldset></td>
                            <td colSpan={2}><fieldset>
                                <legend>Days of the Week: </legend>
                                <table style={{position: "relative", width: "100%", tableLayout: "fixed", marginBottom:-2}}><tr>
                                {
                                    days.map((dw, index) =>{
                                        return (
                                            <td>
                                                <input type="checkbox" className='checkbox' id={dow[index]} checked={dw} onChange={() =>handleDays(index)}/><br/>
                                                <label htmlFor={dow[index]}>{dow[index]}</label>
                                            </td>
                                        )
                                    })
                                }</tr></table>
                            </fieldset></td>
                        </tr>
                        <tr>
                            <td colSpan={4}><fieldset>
                                <legend>Modes of Payment: </legend>
                                <table style={{position: "relative", width: "100%"}}><tr>
                                {
                                    paymentOptions.map((dw, index) =>{
                                        return (
                                            <td style={{width:0}}>
                                                <input type="checkbox" className='checkbox' id={pays[index]} checked={dw} onChange={() =>handlePays(index)}/><br/>
                                                <label htmlFor={pays[index]}>{pays[index]}</label>
                                            </td>
                                        )
                                    })
                                }</tr></table>
                            </fieldset></td>
                        </tr>
                        <tr>
                            <td colSpan={2}><fieldset>
                                <legend>Contact Number (Optional): </legend>
                                <input type="text" value={cpNum} onChange={handleNum} className='inputModal' placeholder='09*********'/>
                            </fieldset></td>
                            <td colSpan={2}><fieldset>
                                <legend>Email Address (Optional): </legend>
                                <input type="email" value={email} onChange={handleEmail} className='inputModal' placeholder='juan@gmail.com'/>
                            </fieldset></td>
                        </tr>
                        <tr>
                            <td colSpan={2}><fieldset>
                                <legend>Facebook (Optional):</legend>
                                <input type="text" value={facebook} onChange={handleFB} className='inputModal' placeholder='facebook.com/kahitsaan'/>
                            </fieldset></td>
                            <td colSpan={2}><fieldset>
                                <legend>Instagram (Optional): </legend>
                                <input type="text" value={instagram} onChange={handleInsta} className='inputModal' placeholder='instagram.com/kahitsaan'/>
                            </fieldset></td>
                        </tr>
                        <tr>
                            <td colSpan={2}><fieldset>
                                <legend>X (Optional): </legend>
                                <input type="text" value={twitter} onChange={handleX} className='inputModal' placeholder='twitter.com/kahitsaan'/>
                            </fieldset></td>
                        </tr>
                        <tr>
                            <td colSpan={2} style={{textAlign: "center", paddingBottom: 10}}> <input type="reset" value="Reset" onClick={resetButton}  disabled={ret}/></td>
                            <td colSpan={2} style={{textAlign: "center", paddingBottom: 10}}> <input type="submit" value="Submit" disabled={ret}/></td>
                        </tr>
                    </table>
                </form>
            </Box>
        </Modal>
    }
}
export default AddRestoModal;