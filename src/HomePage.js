import React  from 'react';
import HomePageCard from './HomePageCard';
import { useState, useEffect } from "react";
import "./HomePage.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProgressBar1 from './progress';
import "@fontsource/rubik";
import { IoMdArrowDroprightCircle } from "react-icons/io";
import { height } from '@mui/system';
import { FaSearch } from "react-icons/fa";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function HomePage({isMobile, submittedInput, keywords}) {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isSet, setIsSet] = useState(0);
    const [sampleData, setSampleData] = useState([]);

    const tableBorder = 20;
    const perCard = 300 + tableBorder;
    const tempCol = Math.floor((window.innerWidth - tableBorder) / perCard);
    const [border, setBorder] = useState((window.innerWidth - ((tempCol * perCard) + (tableBorder*3))) / 2 - 10);

    const setDataWithRows = (samp, col) => {
        const temp = [];
        const sampTemp = [...samp];

        while(sampTemp.length) temp.push(sampTemp.splice(0,col));
        setData(temp);
    }

    window.onresize = function(event) {
        const columns = Math.floor((window.innerWidth - tableBorder) / perCard);
        setBorder((window.innerWidth - ((columns * perCard) + (tableBorder*3))) / 2 - 10);
        setDataWithRows(sampleData, columns);
    };

    const [retDishes, setRetDishes] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reloaded, setReload] = useState(false);
    const [showFilters, setshowfilters] = useState(false);

    useEffect(() => {
        // if (submittedInput) {
            // console.log(submittedInput);
            setRetDishes(false);
            SearchDishes();
        // }
    }, [submittedInput])

    const SearchDishes = async () => {
        await axios({
            method: 'post',
            url: process.env.REACT_APP_API_URL+"/searchDish",
            data: {
                input: submittedInput,
                userID: userInfo.id
            },
        }).then((res) => {
            setRetDishes(true);
            if(res.data.success){
                const dishList = res.data.dishList

                setSampleData(dishList);
                // setSampleData(Array(1).fill(dishList));

                setDataWithRows(dishList, tempCol);
                // setDataWithRows(Array(1).fill(dishList));
            } else {
                alert(res.data.message);
            }
        })
    }

    const userInfo = {
        id: localStorage.getItem("user_reference"),
        type: localStorage.getItem("user_type")
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const min = event.target.minPrice.value;
        const max = event.target.maxPrice.value; 
        if( min != "" && max != "") {
            if( !(parseInt(max) > parseInt(min))) {
                alert("Maximum Price should be greater than Minimum Price.")
                return
            }
        }

        setRetDishes(false);
        const input = {
            minPrice: min,
            maxPrice: max,
            distance: event.target.distance.value,
            protein: event.target.protein.value,
            exdish: event.target.exdish.value,
            input: keywords,
            userID: userInfo.id
        } 
        console.log(input);

        await axios({
            method: 'post',
            url: process.env.REACT_APP_API_URL+"/filterDish",
            data: input
        }).then((res) => {
            console.log(res);
            setRetDishes(true);
            if(res.data.success){
                const dishList = res.data.dishList

                setSampleData(dishList);
                // setSampleData(Array(1).fill(dishList));

                setDataWithRows(dishList, tempCol);
                // setDataWithRows(Array(1).fill(dishList));
            } else {
                alert(res.data.message);
            }
        })
    }

    if (!retDishes) {
        return <div className='divH'
        style={{
            height: isMobile ? window.innerHeight - (95+68.36) + 18 : window.innerHeight - (98) + 18,
        }}
        >

            <div style={{backgroundColor: "white", position: 'relative', position: 'absolute', marginLeft: showFilters ? 225 : -23, width: 50, height: 55, borderRadius: 50, marginTop: isMobile ? (3*(window.innerHeight)/8) - 40 : (3*(window.innerHeight)/8) +10, zIndex: 2}} onClick={() => setshowfilters(!showFilters)}>
                <IoMdArrowDroprightCircle size={80} color={"rgb(110, 35, 35)"} style={{marginLeft: -10, marginTop: -15}} />
            </div>
            {showFilters ? 
            <div className="filterDiv" style={{height: "100%"}}>
                <form onSubmit={handleSubmit} >
                <table className="priceTable1" style={{fontFamily: "Rubik", marginTop: isMobile ? (window.innerHeight - (95+68.36) + 18)/2 -180 : (window.innerHeight - (98) + 18)/2 - 180}} align='center'>
                    <tr>
                        <td colSpan={6}>Price</td>
                    </tr>
                    <tr>
                        <td colSpan={2}><input type="number" className='hmInput' name='minPrice'/></td>
                        <td colSpan={2}> - </td>
                        <td colSpan={2}><input type="number" className='hmInput' name='maxPrice'/></td>
                    </tr>
                    <tr>
                        <td colSpan={6}>Distance from me:</td>
                    </tr>
                    <tr>
                        <td colSpan={6}><input type="number" className='hmInput' name='distance'/></td>
                    </tr>
                    <tr>
                        <td colSpan={6}>Protein:</td>
                    </tr>
                    <tr>
                        <td colSpan={6}><input type="text" className='hmInput' style={{width: 150}} name='protein'/></td>
                    </tr>
                    <tr>
                        <td colSpan={6}>Exclude dishes with:</td>
                    </tr>
                    <tr>
                        <td colSpan={6}><input type="text" className='hmInput' style={{width: 150}} name='exdish'/></td>
                    </tr>
                    <tr>
                        <td colSpan={3}><input type='reset' value="Clear" style={{width: 100}}/> </td>
                        <td colSpan={3}><input type='submit' value="Submit" style={{width: 100}}/></td>
                    </tr>
                </table> 
                </form>
            </div> : null}
            <ProgressBar1 height={200}/>
        </div>
    } else {
        return <div className='divH'
        style={{
            height: isMobile ? window.innerHeight - (95+68.36) + 18 : window.innerHeight - (98) + 18,
        }}
        >

            <div style={{backgroundColor: "white", position: 'relative', position: 'absolute', marginLeft: showFilters ? 225 : -23, width: 50, height: 55, borderRadius: 50, marginTop: isMobile ? (3*(window.innerHeight)/8) - 40 : (3*(window.innerHeight)/8) +10, zIndex: 2}} onClick={() => setshowfilters(!showFilters)}>
                <IoMdArrowDroprightCircle size={80} color={"rgb(110, 35, 35)"} style={{marginLeft: -10, marginTop: -15}} />
            </div>
            {showFilters ? 
            <div className="filterDiv" style={{height: "100%"}}>
                <form onSubmit={handleSubmit} >
                <table className="priceTable1" style={{fontFamily: "Rubik", marginTop: isMobile ? (window.innerHeight - (95+68.36) + 18)/2 -180 : (window.innerHeight - (98) + 18)/2 - 180}} align='center'>
                    <tr>
                        <td colSpan={6}>Price</td>
                    </tr>
                    <tr>
                        <td colSpan={2}><input type="number" className='hmInput' name='minPrice'/></td>
                        <td colSpan={2}> - </td>
                        <td colSpan={2}><input type="number" className='hmInput' name='maxPrice'/></td>
                    </tr>
                    <tr>
                        <td colSpan={6}>Distance from me:</td>
                    </tr>
                    <tr>
                        <td colSpan={6}><input type="number" className='hmInput' name='distance'/></td>
                    </tr>
                    <tr>
                        <td colSpan={6}>Protein:</td>
                    </tr>
                    <tr>
                        <td colSpan={6}>
                            {/* <table className='prtTBL' align='center'>
                                <tr>
                                    <td style={{marginRight: -100}}><input type="text" className='hmInputSearch' name='protein'/></td>
                                    <td><FaSearch size={18} style={{marginTop: 2, color: "rgb(110, 35, 35)", paddingRight: 5}}/></td>
                                </tr>
                            </table> */}
                            <input type="text" className='hmInput' style={{width: 150}} name='protein'/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={6}>Exclude dishes with:</td>
                    </tr>
                    <tr>
                        <td colSpan={6}>
                            {/* <table className='prtTBL' align='center'>
                                <tr>
                                    <td style={{marginRight: -100}}><input type="text" className='hmInputSearch' name='exdish'/></td>
                                    <td><FaSearch size={18} style={{marginTop: 2, color: "rgb(110, 35, 35)", paddingRight: 5}}/></td>
                                </tr>
                            </table> */}
                            <input type="text" className='hmInput' style={{width: 150}} name='exdish'/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={3}><input type='reset' value="Clear" style={{width: 100, marginTop: 10}}/> </td>
                        <td colSpan={3}><input type='submit' value="Submit" style={{width: 100, marginTop: 10}}/></td>
                    </tr>
                </table> 
                </form>
            </div> : null}
            <table className="HomePage" align='center'
            style={{
                borderSpacing: `${tableBorder}px 5px`,
                marginBottom: 10
            }}>
                { data.length > 0 ?
                    data.map((row) => {
                        return <tr> 
                            <td>{
                                row.map((dish) => {
                                    return  <td>
                                        <HomePageCard data={dish} navigate={navigate} userInfo={userInfo}/> </td>
                                })    
                            }</td>
                        </tr>
                    }) : "No dish matched your search."
                }
            </table>
        </div>
    }
}

export default HomePage;