import React  from 'react';
import HomePageCard from './HomePageCard';
import { useState, useEffect } from "react";
import "./HomePage.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProgressBar1 from './progress';
    
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function HomePage({isMobile}) {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isSet, setIsSet] = useState(0);
    const [sampleData, setSampleData] = useState([]);

    const tableBorder = 15;
    const perCard = 282 + tableBorder;
    const tempCol = Math.floor((window.innerWidth - tableBorder) / perCard);
    const [border, setBorder] = useState((window.innerWidth - ((tempCol * perCard) + (tableBorder*3))) / 2 - 10);

    const setDataWithRows = (samp, col) => {
        const temp = [];
        const sampTemp = JSON.parse(JSON.stringify(samp));

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

    const Retrieving = async () => {
        await axios({
            method: 'post',
            url: process.env.REACT_APP_API_URL+"/retrieveAllDishes",
        }).then((res) => {
            if(res.data.success){
                console.log(Array(10).fill(res.data.dishList[0]));
                setSampleData(Array(10).fill(res.data.dishList[0]));
                setDataWithRows(Array(10).fill(res.data.dishList[0]), tempCol);
            } else{
                alert(res.data.message);
            }
            setRetDishes(true);
            setLoading(false);
    })}

    useEffect(() => {
        if(!retDishes && !loading) {
            setLoading(true);
            Retrieving();
        }
    }, []);

    if (!retDishes) {
        <ProgressBar1 />
    } else {
        return <div >
            <table className="HomePage"
            style={{
                left: border+"px",
                paddingRight: border+"px",
                borderSpacing: tableBorder+"px",
                height: isMobile ? window.innerHeight - (95+68.36) + 23 : window.innerHeight - (98) + 28,
            }}>
                {
                    data.map((row) => {
                        return <tr> 
                            <td>{
                                row.map((dish) => {
                                    return  <td>
                                        <HomePageCard data={dish} navigate={navigate} /> </td>
                                })    
                            }</td>
                        </tr>
                    })
                }
            </table>
        </div>
    }
}

export default HomePage;