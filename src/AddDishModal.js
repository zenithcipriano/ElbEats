import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useState, useEffect, useCallback } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import "./addrestomodal.css";
import "./addDishModal.css";
import axios from 'axios';
import "@fontsource/rubik";
import ProgressBar1 from './progress';
import {useDropzone} from 'react-dropzone'
import { Carousel } from "react-responsive-carousel";
import { colors } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import AlertModal from './alertModal';

function AddDishModal ({open, handleClose, height, action, restoID, dishData, loadingModal, isMobile}) {
    const style = {
        position: 'absolute',
        fontFamily: "Rubik",
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        // width: 600,
        width: window.innerWidth-40,
        maxWidth: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        height: 3*height/4,
        overflowY: "scroll",
        padding: 2,
        // paddingRight: 0
        // marginRight: -30
    };

    const resetButton = () => {
        setDishname("");
        setwalkinPrice("");
        setonlinePrice("");
        clearIng();
        setIngList([]);
        setServings("");
        setPermissionGiven(false);
        setMainPicture([]);
    }

    const userInfo = {
        id: localStorage.getItem("user_reference"),
        type: localStorage.getItem("user_type")
    }
    const userID = userInfo.id;
    const [dishID, setdishID] = useState(-1);
    
    useEffect(() => {
        setDishname(dishData.dishname);
        setwalkinPrice(dishData.walkinprice);
        setonlinePrice(dishData.onlineprice);
        setdishID(dishData.dishID);
        clearIng();

        // setIngSearch("");
        // setSearchPushed(false);
        // setResults([]);
        const tempIngs = [];
        if(dishData.ings) {
            dishData.ings.forEach((ing, index) => {
                const temp = {};
                temp.amount = dishData.amounts[index];
                temp.ingNameDesc = ing;
                temp.ingType = dishData.types[index];
                tempIngs.push(temp);
                //     fidList.push(ing.ingFID);
            })
        }

        setIngList(tempIngs);
        setServings(dishData.servings);
        setPermissionGiven(dishData.permission == 1);
        setMainPicture(dishData.images ? dishData.images : []);
        setAvail(dishData.available);
    }, [open]);

    const [ret, setRet] = useState(false);
    const [findIng, setfindIng] = useState(false);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if(!findIng && !ret) {
            setRet(true);

            if(ingList.length == 0) {
                setOpenAlert(true);
                setAlertMess("Ingredients Missing");
                // alert("Missing:\n Ingredients");
                setRet(false);
                return;
            }

            const ingList1 = [];
            const fidList = [];
            const weightList = [];
            const typeList = [];
            const FilIngList = [];

            ingList.forEach((ing) =>{
                ingList1.push(ing.ingNameDesc);
                fidList.push(ing.ingFID);
                weightList.push(ing.amount);
                typeList.push(ing.ingType);
                FilIngList.push(ing.ingAltName);
            })

            const newDish = {
                userID,
                ingList: ingList1,
                fidList,
                weightList,
                servings,
                restoID,
                dishname,
                walkinprice: walkinPrice,
                onlineprice: onlinePrice,
                typeList,
                permission: permissionGiven ? 1 : 0,
                avail,
                FilIngList
            }

            if(mainPicture.length == 0) {   
                setOpenAlert(true);
                setAlertMess("Images Missing");

                // alert("Missing:\n Images");
                setRet(false);
                return;
            }
            const formData = new FormData();
            mainPicture.forEach((image) => {
                if (image.preview) {
                    formData.append("file", image);
                }
            });

            let counter = 0;
            const tempImages = [];
            // console.log("start");
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/saveImages`, formData);
            mainPicture.forEach((image) => {
                if (image.preview) {
                    tempImages.push(response.data.imageUrl[counter]);
                    counter += 1;
                } else {
                    tempImages.push(image);
                }
            });
            newDish.images = tempImages;

            // console.log(newDish);
            // setRet(false);
            if(action == "Add") {
                await axios({
                    method: 'post',
                    url: process.env.REACT_APP_API_URL+"/createDish",
                    data: newDish,
                }).then((res) => {
                    setRet(false);
                    if(res.data.success){
                        // setOpenAlert(true);
                        // setAlertMess(res.data.message);
                        // setIsSuccess(true);

                        // alert(res.data.message);
                        handleClose();
                        window.location.reload();
                    } else {
                        setOpenAlert(true);
                        setAlertMess(`Dish '${dishname}' already exist in the system.`);
                        // alert(`Dish '${dishname}' already exist in the system.`)
                    }
                })
            } else if (action = "Edit"){
                newDish.dishID = dishID;
                await axios({
                    method: 'post',
                    url: process.env.REACT_APP_API_URL+"/updateDish",
                    data: newDish,
                }).then((res) => {
                    // alert(res.data.message);
                    setRet(false);
                    if(res.data.success){
                        // alert(res.data.message);
                        handleClose();
                        window.location.reload();
                    } else {
                        setOpenAlert(true);
                        setAlertMess(`Updating Dish '${dishname}' failed.`);
                        // alert(`Dish '${dishname}' already exist in the system.`)
                        // alert(`Updating Dish '${restoname}' failed.`)
                    }
                })
            } else {
                setRet(false);
            }
        }
    }

    const [dishname, setDishname] = useState("");
    const handleNameChange = (event) => setDishname(event.target.value);

    const [walkinPrice, setwalkinPrice] = useState("");
    const handlewalkinChange = (event) => setwalkinPrice(event.target.value);
    const [onlinePrice, setonlinePrice] = useState("");
    const handleonlineChange = (event) => setonlinePrice(event.target.value);

    const [ingSearch, setIngSearch] = useState("");
    const [ingSearchFinal, setIngSearchFinal] = useState("");
    const handleIngSearch = (event) => setIngSearch(event.target.value);

    const [ingList, setIngList] = useState([]);;
    // const [fidList, setFidList] = useState([]);
    // const [weightList, setWeightList] = useState([]);
    const [servings, setServings] = useState("");;
    const [searchPushed, setSearchPushed] = useState(false);
    const [permissionGiven, setPermissionGiven] = useState(false);;
    const [results, setResults] = useState([]);
    const [avail, setAvail] = useState(1);
    const onAvailable = (event) => {
        // console.log(event.target.value);
        setAvail("Yes" == event.target.value ? 1 : 0);
    }

    const selectIng = (index) => {
        setIngList([...ingList, results[index]]);
        clearIng();
    }

    const removeIng = (index) => {
        ingList.splice(index, 1);
        setIngList([...ingList]);
    }

    const handleAmount = (event, index) => {
        ingList[index].amount = event.target.value;
        setIngList([...ingList]);
    }

    const searchIng = async () => {
        setfindIng(true);
        setIngSearchFinal(ingSearch);
        if (ingSearch) {
            await axios({
                    method: 'post',
                    url: process.env.REACT_APP_API_URL+"/searchIng",
                    data: {ingName: ingSearch},
                }).then((res) => {
                   setfindIng(false);
                    if(res.data.success){
                        setSearchPushed(true);
                        setResults(res.data.results);
                    } else {
                        setOpenAlert(true);
                        setAlertMess('Having trouble retrieving the ingredient list. Please try again later.');
                        // alert(res.data.message);
                    }
                })
        } else {
            await new Promise(res => setTimeout(res, 100));
            setfindIng(false);
        }
    }

    const clearIng = () => {
        setIngSearch("");
        setSearchPushed(false);
        setResults([]);
    }

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
        }
    })

    const [openAlert, setOpenAlert] = useState(false);
    const [alertMess, setAlertMess] = useState("");
    const alertClose = () => {setOpenAlert(false)};

    if(loadingModal || ret) {
        return <Modal 
        open={open}
        onClose={handleClose}
        // style={{backgroundColor: "cyan"}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
            <Box sx={style}>
                <div style={{alignContent: 'center', height: "100%", marginTop: -30}}>
                    <ProgressBar1 height={200}/>
                </div>
                </Box>
        </Modal>
    } else if(!isMobile) {
        return <div><Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <table className='modalTable'>
                    <tr>
                        <td>
                            <h2>Dish Information </h2>
                        </td>
                        <td style={{textAlign: "right"}}> <IoIosCloseCircleOutline size={40} onClick={handleClose}/> </td>
                    </tr>
                </table>
                <form style={{fontFamily: "Rubik", marginBottom: -15}} onSubmit={handleSubmit}>
                    <table className="inputTables">
                        <tr>
                            <td colSpan={2}>
                                <fieldset>
                                    <legend>Dish Name: </legend>
                                    <input required type="text" value={dishname} onChange={handleNameChange} className='inputModal' placeholder='Adobo'/>
                                </fieldset>
                            </td>
                            <td colSpan={2} rowSpan={4}>
                                <fieldset>
                                    <legend>Images: </legend>
                                        {mainPicture.length > 0 ? 
                                            <Carousel useKeyboardArrows={true} showArrows={true} swipeable={true} showThumbs={false} {...getRootProps()}
                                                statusFormatter={(current, total) => {
                                                    return (
                                                        <div style={{fontSize: 15, 
                                                            width: 250,
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
                                                    <div key={index} className="img-wrap" style={{border: "1px solid rgba(0, 0, 0, 0.2)"}}>
                                                        <img src={upFile.preview ? upFile.preview : upFile} alt="..."/>
                                                    </div>
                                                ))}
                                            </Carousel>
                                        : <div {...getRootProps()} style={{border: "1px solid rgba(0, 0, 0, 0.2)", padding: 5, position: 'relative', marginBottom: 10, padding: 75}}>
                                            No images.
                                        </div>
                                        }
                                        <div {...getRootProps()} >
                                        <input {...getInputProps()} />
                                            <div style={{border: "1px solid rgba(0, 0, 0, 0.2)", padding: 5, position: 'relative'}}>
                                                {/* {"Drag 'n drop images here, or click to select files"}  */}
                                                Click to select files
                                            </div>
                                        </div>
                                </fieldset>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <fieldset>
                                    <legend>Walk-in Price: </legend>
                                    <input required type="number" value={walkinPrice} onChange={handlewalkinChange} className='inputModal' placeholder='0'/>
                                </fieldset>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <fieldset>
                                    <legend>Online Price (Optional): </legend>
                                    <input type="number" value={onlinePrice} onChange={handleonlineChange} className='inputModal' placeholder='0'/>
                                </fieldset>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                            <fieldset>
                                <legend>Available Today: </legend>
                                <table style={{position: 'relative'}} align='center'>
                                    <tr>
                                        <td style={{width: "10px"}}>
                                            <label htmlFor='availYes'>
                                                Yes
                                            </label>
                                        </td>
                                        <td style={{width: "10px"}}>
                                            <input required type="radio" id="availYes" value="Yes" onChange={onAvailable} className='checkbox' name="available" checked={avail == 1}/>
                                        </td>
                                        <td style={{width: "50px"}}>

                                        </td>
                                        <td style={{width: "10px"}}>
                                            <label htmlFor='availNo'>
                                                No
                                            </label>
                                        </td>
                                        <td style={{width: "10px"}}>
                                            <input required type="radio" id="availNo" value="No" onChange={onAvailable} className='checkbox' name="available" checked={avail == 0}/>
                                        </td>
                                    </tr>
                                </table>
                            </fieldset>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={4}>
                                <fieldset>
                                    <legend>Ingredients: </legend>
                                    { ingList.length > 0 ?
                                    <table className='resultsTable'>
                                        <tr>
                                            <td colSpan={3} style={{border: "1px solid white", paddingBottom: 0}}>
                                                <fieldset>
                                                    <legend>Permissions: </legend>
                                                    <input type="checkbox" className='checkbox' id="show_inglist" checked={permissionGiven} onChange={() => setPermissionGiven(!permissionGiven)}/>
                                                    <label htmlFor="show_inglist" style={{fontSize: 15, marginTop: -10}}>Show Ingredients to Other Users</label>
                                                </fieldset>
                                            </td>
                                            <td style={{border: "1px solid white", paddingBottom: 0}}>
                                                <fieldset style={{textAlign: "right", padding: 5}}>
                                                    <legend>Servings: </legend>
                                                    <input required type="number" className='inputModal' placeholder='1' value={servings} onChange={(e) => setServings(e.target.value)} step="any" min="1" style={{width: "90%"}}/>
                                                </fieldset>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Amount (g)</th>
                                            <th>Ingredient</th>
                                            <th>Food Type</th>
                                            <th>Remove</th>
                                        </tr>
                                        {
                                            ingList.map((ing, index) => {
                                                return <tr>
                                                    <td style={{width: "30%"}}>
                                                        <input required type="number" className='inputModal' placeholder='0' value={ing.amount} onChange={(e) => handleAmount(e, index)} step="any"/>
                                                    </td>
                                                    <td style={{width: "30%"}}> {ing.ingNameDesc} </td>
                                                    <td style={{width: "30%"}}> {ing.ingType} </td>
                                                    <td style={{width: "10%", textAlign: "center"}}><IoIosCloseCircleOutline size={30} onClick={() => removeIng(index)}/></td>
                                                </tr>
                                            })
                                        }
                                    </table> 
                                    : "No ingredients listed yet." }
                                    {/* <input required type="text" value={""} onChange={handleonlineChange} className='inputModal' placeholder='0'/> */}
                                </fieldset>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={4}>
                                <fieldset>
                                    <legend>Search Ingredient: </legend>
                                    <table style={{position: 'relative', width: "100%"}}>
                                        <tr>
                                            <td style={{width: "100%"}}>
                                            <input type="text" value={ingSearch} onChange={handleIngSearch} className='inputModal' placeholder='asin' 
                                            onKeyDown={(event) => {
                                                if(event.key.includes("Enter")) searchIng()
                                            }}
                                            />
                                            </td>
                                            <td style={{padding: 5}}><IoIosCloseCircleOutline size={25} onClick={clearIng}/></td>
                                            <td style={{padding: 5}}><FaSearch size={25} onClick={searchIng}/></td>
                                        </tr>
                                    </table>
                                </fieldset>
                            </td>
                        </tr>
                        { searchPushed && ingSearch == ingSearchFinal ? <tr>
                            <td colSpan={4}>
                                <fieldset>
                                    <legend>Results: (Click row to select.)</legend>
                                        {results.length > 0 ? <div className='resultsDiv'>
                                            <table className='resultsTable'>
                                            <tr>
                                                <th style={{width: "35%"}}>Name</th>
                                                <th style={{width: "35%"}}>Alternative Name</th>
                                                <th style={{width: "30%"}}>Type</th>
                                            </tr>
                                            {
                                                results.map((reslt, index) => {
                                                    return <tr onClick={() => selectIng(index)}>
                                                        <td>{reslt.ingNameDesc}</td>
                                                        <td>{reslt.ingAltName}</td>
                                                        <td>{reslt.ingType}</td>
                                                    </tr>
                                                })
                                            }
                                        </table></div>: `'${ingSearchFinal}' is not found in this system. Please try an alternative name.` }
                                </fieldset>
                            </td>
                        </tr> : null
                        }
                    {/* </table>
                </form>
                    <table className="inputTables"> */}
                        <tr>
                            <td colSpan={2} style={{textAlign: "center", paddingBottom: 10}}> <input style={{maxWidth: 235, width: 2*window.innerWidth/5}} type="reset" value="Reset" onClick={resetButton}  disabled={ret}/></td>
                            <td colSpan={2} style={{textAlign: "center", paddingBottom: 10}}> <input style={{maxWidth: 235, width: 2*window.innerWidth/5}} type="submit" value="Submit" disabled={ret}/></td>
                        </tr>
                    </table>
                </form>
            </Box>
        </Modal>
        <AlertModal open={openAlert} handleClose={alertClose} message={alertMess} isSuccess={false}/>
        </div>
    } else {
        return <div><Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <table className='modalTable'>
                    <tr>
                        <td>
                            <h2>Dish Information </h2>
                        </td>
                        <td style={{textAlign: "right"}}> <IoIosCloseCircleOutline size={40} onClick={handleClose}/> </td>
                    </tr>
                </table>
                <form style={{fontFamily: "Rubik", marginBottom: -15}} onSubmit={handleSubmit}>
                    <table className="inputTables">
                        <tr>
                            <td colSpan={2}>
                                <fieldset>
                                    <legend>Dish Name: </legend>
                                    <input required type="text" value={dishname} onChange={handleNameChange} className='inputModal' placeholder='Adobo'/>
                                </fieldset>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <fieldset>
                                    <legend>Images: </legend>
                                        {mainPicture.length > 0 ? 
                                            <Carousel useKeyboardArrows={true} showArrows={true} swipeable={true} showThumbs={false} {...getRootProps()}
                                                statusFormatter={(current, total) => {
                                                    return (
                                                        <div style={{fontSize: 15, 
                                                            width: 250,
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
                                                    <div key={index} className="img-wrap" style={{border: "1px solid rgba(0, 0, 0, 0.2)"}}>
                                                        <img src={upFile.preview ? upFile.preview : upFile} alt="..."/>
                                                    </div>
                                                ))}
                                            </Carousel>
                                        : <div {...getRootProps()} style={{border: "1px solid rgba(0, 0, 0, 0.2)", padding: 5, position: 'relative', marginBottom: 10, padding: 75}}>
                                            No images.
                                        </div>
                                        }
                                        <div {...getRootProps()} >
                                        <input {...getInputProps()} />
                                            <div style={{border: "1px solid rgba(0, 0, 0, 0.2)", padding: 5, position: 'relative'}}>
                                                Click to select files
                                            </div>
                                        </div>
                                </fieldset>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <fieldset>
                                    <legend>Walk-in Price: </legend>
                                    <input required type="number" value={walkinPrice} onChange={handlewalkinChange} className='inputModal' placeholder='0'/>
                                </fieldset>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <fieldset>
                                    <legend>Online Price (Optional): </legend>
                                    <input type="number" value={onlinePrice} onChange={handleonlineChange} className='inputModal' placeholder='0'/>
                                </fieldset>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                            <fieldset>
                                <legend>Available Today: </legend>
                                <table style={{position: 'relative'}} align='center'>
                                    <tr>
                                        <td style={{width: "10px"}}>
                                            <label htmlFor='availYes'>
                                                Yes
                                            </label>
                                        </td>
                                        <td style={{width: "10px"}}>
                                            <input required type="radio" id="availYes" value="Yes" onChange={onAvailable} className='checkbox' name="available" checked={avail == 1}/>
                                        </td>
                                        <td style={{width: "50px"}}>

                                        </td>
                                        <td style={{width: "10px"}}>
                                            <label htmlFor='availNo'>
                                                No
                                            </label>
                                        </td>
                                        <td style={{width: "10px"}}>
                                            <input required type="radio" id="availNo" value="No" onChange={onAvailable} className='checkbox' name="available" checked={avail == 0}/>
                                        </td>
                                    </tr>
                                </table>
                            </fieldset>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2} style={{border: "1px solid white", paddingBottom: 0}}>
                                <fieldset>
                                    <legend>Permissions: </legend>
                                    <input type="checkbox" className='checkbox' id="show_inglist" checked={permissionGiven} onChange={() => setPermissionGiven(!permissionGiven)}/>
                                    <label htmlFor="show_inglist" style={{fontSize: 15, marginTop: -10}}>Show Ingredients to Other Users</label>
                                </fieldset>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <fieldset>
                                    <legend>Ingredients: </legend>
                                    { ingList.length > 0 ?
                                    <table className='resultsTable'>
                                        <tr>
                                            <td colSpan={2} style={{border: "1px solid white"}}>
                                            </td>
                                            <td colSpan={1} style={{border: "1px solid white", padding: 0}}>
                                                <fieldset style={{textAlign: "right", padding: 5}}>
                                                    <legend>Servings: </legend>
                                                    <input required type="number" className='inputModal' placeholder='1' value={servings} onChange={(e) => setServings(e.target.value)} step="any" min="1" style={{width: "90%"}}/>
                                                </fieldset>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Amount (g)</th>
                                            <th>Ingredient</th>
                                            {/* <th>Food Type</th> */}
                                            <th>Remove</th>
                                        </tr>
                                        {
                                            ingList.map((ing, index) => {
                                                return <tr>
                                                    <td style={{width: "30%"}}>
                                                        <input required type="number" className='inputModal' placeholder='0' value={ing.amount} onChange={(e) => handleAmount(e, index)} step="any"/>
                                                    </td>
                                                    <td style={{width: "30%"}}> {ing.ingNameDesc} </td>
                                                    {/* <td style={{width: "30%"}}> {ing.ingType} </td> */}
                                                    <td style={{width: "10%", textAlign: "center"}}><IoIosCloseCircleOutline size={30} onClick={() => removeIng(index)}/></td>
                                                </tr>
                                            })
                                        }
                                    </table> 
                                    : "No ingredients listed yet." }
                                </fieldset>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <fieldset>
                                    <legend>Search Ingredient: </legend>
                                    <table style={{position: 'relative', width: "100%"}}>
                                        <tr>
                                            <td style={{width: "100%"}}>
                                            <input type="text" value={ingSearch} onChange={handleIngSearch} className='inputModal' placeholder='asin' 
                                            onKeyDown={(event) => {
                                                if(event.key.includes("Enter")) searchIng()
                                            }}
                                            />
                                            </td>
                                            <td style={{padding: 5}}><IoIosCloseCircleOutline size={25} onClick={clearIng}/></td>
                                            <td style={{padding: 5}}><FaSearch size={25} onClick={searchIng}/></td>
                                        </tr>
                                    </table>
                                </fieldset>
                            </td>
                        </tr>
                        { searchPushed && ingSearch == ingSearchFinal ? <tr>
                            <td colSpan={2}>
                                <fieldset>
                                    <legend>Results: (Click row to select.)</legend>
                                        {results.length > 0 ? 
                                        <div className='resultsDiv'>
                                            <table className='resultsTable' style={{tableLayout: 'fixed', width: "100%"}}>
                                            <tr>
                                                <th>Name</th>
                                                <th>Alternative Name</th>
                                            </tr>
                                            {
                                                results.map((reslt, index) => {
                                                    return <tr onClick={() => selectIng(index)}>
                                                        <td>{reslt.ingNameDesc}</td>
                                                        <td>{reslt.ingAltName}</td>
                                                    </tr>
                                                })
                                            }
                                        </table></div>: `'${ingSearchFinal}' is not found in this system. Please try an alternative name.` }
                                </fieldset>
                            </td>
                        </tr> : null
                        }
                        <tr >
                            <td style={{textAlign: "center", paddingBottom: 10}}> <input style={{maxWidth: 235, width: 2*window.innerWidth/5}} type="reset" value="Reset" onClick={resetButton}  disabled={ret}/></td>
                            <td style={{textAlign: "center", paddingBottom: 10}}> <input style={{maxWidth: 235, width: 2*window.innerWidth/5}} type="submit" value="Submit" disabled={ret}/></td>
                        </tr>
                    </table>
                </form>
            </Box>
        </Modal>
        <AlertModal open={openAlert} handleClose={alertClose} message={alertMess} isSuccess={false}/>
        </div>
    } 
}
export default AddDishModal;