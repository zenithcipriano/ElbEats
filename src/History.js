import React, { useEffect }  from 'react';
import { useState } from "react";
import { PieChart } from '@mui/x-charts/PieChart';
import "./History.css";
import HomePageCard from './HomePageCard';
import { useNavigate } from 'react-router-dom';
import ProgressBar1 from './progress';
import axios from 'axios';
import MicroModal from './MicroModal';
import { IoCaretBackOutline, IoCaretForwardOutline } from 'react-icons/io5';
import AlertModal from './alertModal';

function History({data, isMobile}) {
    const navigate = useNavigate();
    // const [isPortrait, setIsPortrait] = useState(data.isPortrait)
    // const [gender, setGender] = useState(data.gender)
    // const [weight, setWeight] = useState(data.weight)
    const [calories, setCalories] = useState(0);
    const [sodium, setSodium] = useState(0);
    const [calcium, setcalcium] = useState(0);
    const [phosphorus, setphosphorus] = useState(0);
    const [iron, setiron] = useState(0);
    const [zinc, setzinc] = useState(0);
    const [A, setA] = useState(0);
    const [B1, setB1] = useState(0);
    const [B2, setB2] = useState(0);
    const [B3, setB3] = useState(0);
    const [C, setC] = useState(0);
    const [K, setK] = useState(0);
    const [micro, setmicro] = useState(0);
    // const [vitamins, setVitamins] = useState(data.vitamins)
    // const [minerals, setMinerals] = useState(data.minerals)
    const [standardCalories, setStandardCalories] = useState(2000);
    // useState(data.gender.localeCompare("man") == 0 ? 2500:2000)
    const [standardSodium, setStandardSodium] = useState(2000)
    const [stancalcium, setstancalcium] = useState(1000);
    const [stanphosphorus, setstanphosphorus] = useState(700);
    const [staniron, setstaniron] = useState(8);
    const [stanzinc, setstanzinc] = useState(8);
    const [stanA, setstanA] = useState(700);
    const [stanB1, setstanB1] = useState(1.1);
    const [stanB2, setstanB2] = useState(1.1);
    const [stanB3, setstanB3] = useState(14);
    const [stanC, setstanC] = useState(75);
    const [stanK, setstanK] = useState(90);
    const [stanmicro, setstanmicro] = useState(1000);
    // useState(stancalcium + stanphosphorus + staniron + stanzinc + stanA + stanB1 + stanB2 + stanB3 + stanC, + stanK);

    const [width, setWidth] = useState(window.innerWidth)
    const [height, setHeight] = useState(window.innerHeight)

    const diff = 300 - (window.innerWidth/3);
    const [adjustLeft, setAdjustLeft] = useState(diff > 0 ? "-"+Math.ceil((diff)/2)+"px": "0px")

    window.onresize = function(event) {
        const diff1 = 300 - (window.innerWidth/3);
        setAdjustLeft(diff > 0 ? "-"+Math.ceil((diff)/2)+"px": "0px");
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }

    const pieSettings = (progress, standard) => {
        const percent = progress/standard * 100
        const data1 = {data: [
            { value: progress, color: percent < 20 ? "#6e2323" : percent < 40 ? "orange" : percent < 60 ? "yellow" : percent < 80 ? "#9ACD32" : percent > 110 ? "#6e2323" : "#337357"},
            { value:standard-progress < 0 ? 
                0 : standard-progress, 
                color: "#C0D6E8" },
        ],
        highlightScope: { faded: 'global', highlighted: 'item' },
        faded: { innerRadius: 30, additionalRadius: -10, color: 'gray' },
        innerRadius: 30,
        outerRadius: 80,
        paddingAngle: 1,
        cornerRadius: 4,
        startAngle: 180,
        endAngle: -180,
        cx: 150,
        cy: 150,}
        return data1
    }

    const [loading, setLoading] = useState(false);
    const userInfo = {
        id: localStorage.getItem("user_reference"),
        type: localStorage.getItem("user_type")
    }

    const [openAlert, setOpenAlert] = useState(false);
    const [alertMess, setAlertMess] = useState("");
    const alertClose = () => {
        setOpenAlert(false)
        navigate('/');
    };

    const Retrieving = async () => {
        const tempDay = day + dayDisplayed
        const time = `${year}-${monthD < 10 ? "0" + monthD : monthD}-${tempDay < 10 ? "0" + tempDay : tempDay} 00:00:00`;
        const nextTime = `${year}-${monthD < 10 ? "0" + monthD : monthD}-${tempDay+1 < 10 ? "0" + tempDay+1 : tempDay+1} 00:00:00`;
        console.log(time);

        await axios({
            method: 'post',
            url: process.env.REACT_APP_API_URL+"/retrieveMealHistory",
            data: {
                userID: userInfo.id,
                date: time,
                nextDate: nextTime
            }
        }).then((res) => {
            if(res.data.success){
                const dishList = res.data.dishList
                // console.log(dishList);

                setSampleData(dishList);
                let caltotal = 0;
                let ingSodiumFinal = 0;
                let calcium1 = 0;
                let phosphorus1 = 0;
                let iron1 = 0;
                let zinc1 = 0;
                let A1 = 0;
                let B11 = 0;
                let B21 = 0;
                let B31 = 0;
                let C1 = 0;
                let K1 = 0;

                dishList.forEach((dish) => {
                    caltotal += parseFloat(dish.ingCaloriesFinal);
                    ingSodiumFinal += parseFloat(dish.ingSodiumFinal);
                    calcium1 += parseFloat(dish.ingCalciumFinal); 
                    phosphorus1 += parseFloat(dish.ingPhosphorusFinal); 
                    iron1 += parseFloat(dish.ingIronFinal); 
                    zinc1 += parseFloat(dish.ingZnFinal); 
                    A1 += parseFloat(dish.ingAFinal); 
                    B11 += parseFloat(dish.ingB1Final); 
                    B21 += parseFloat(dish.ingB2Final); 
                    B31 += parseFloat(dish.ingNiacinFinal); 
                    C1 += parseFloat(dish.ingCFinal); 
                    K1 += parseFloat(dish.ingKFinal); 
                });

                setCalories(caltotal);
                setSodium(ingSodiumFinal);

                setcalcium(calcium1);
                setphosphorus(phosphorus1)
                setiron(iron1)
                setzinc(zinc1)
                setA(A1)
                setB1(B11)
                setB2(B21)
                setB3(B31)
                setC(C1)
                setK(K1)
                setmicro(
                    Math.floor(calcium1/stancalcium * 100 >= 100 ? 100 : calcium1/stancalcium * 100) + 
                    Math.floor(phosphorus1/stanphosphorus * 100 >= 100 ? 100 : phosphorus1/stanphosphorus * 100) + 
                    Math.floor(iron1/staniron * 100 >= 100 ? 100 : iron1/staniron * 100) + 
                    Math.floor(zinc1/stanzinc * 100 >= 100 ? 100 : zinc1/stanzinc * 100) + 
                    Math.floor(A1/stanA * 100 >= 100 ? 100 : A1/stanA * 100) + 
                    Math.floor(B11/stanB1 * 100 >= 100 ? 100 : B11/stanB1 * 100) + 
                    Math.floor(B21/stanB2 * 100 >= 100 ? 100 : B21/stanB2 * 100) + 
                    Math.floor(B31/stanB3 * 100 >= 100 ? 100 : B31/stanB3 * 100) + 
                    Math.floor(C1/stanC * 100 >= 100 ? 100 : C1/stanC * 100) + 
                    Math.floor(K1/stanK * 100 >= 100 ? 100 : K1/stanK * 100)
                );

                // setSampleData(Array(1).fill(dishList));
                setLoading(false);
                // console.log(res.data);
            } else {
                // alert(res.data.message);
                setOpenAlert(true);
                setAlertMess(`Having trouble retrieving your meals ${dayDisplayed != 0 ? "yesterday" : "for today"}. Please try again later.`);
            }
        })
    }

    const [sampleData, setSampleData] = useState([]);

    const [dayDisplayed, setDay] = useState(0);
    useEffect(() => {
        setLoading(true);
        Retrieving();
    }, [dayDisplayed]);

    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const d = new Date();
    const monthD = d.getMonth();
    const day = d.getDate();
    const year = d.getFullYear();

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    // const numData = 10;
    // const sampleData = Array(numData).fill({
    //     dishName: "Dish Name1",
    //     rate: "unrated",
    //     resName: "Restaurant",
    //     distance: "0",
    //     status: "Closed",
    //     vitamins: "A, C, K",
    //     minerals: "iron, magnesium",
    //     tabs: "Pork, Fried",
    //     price: "200"
    // });

    // const sampledates = Array.from(Array(numData).keys());
    if (loading) {
        return <div style={{
            marginTop: isMobile ? -35 : -85, 
            height: isMobile ? window.innerHeight - (118.36) : window.innerHeight,
            alignContent: 'center'}}>
            <ProgressBar1 height={200}/>
        </div>
    } else {
        return <div className="HistoryPage" style={{height: width<1224 ? height-160:height-90}}>
            <table className='History' style={{width:width}}>
                <tr>
                    <td>
                        <table style={{position: 'relative'}} align='center'>
                            <tr>
                                <td>
                                <div className='pie' style={{
                                        // border: "1px solid black",
                                        marginLeft: width/3 > (234.6-75) ? 0 : (((width/3)-(234.6-75))/2)-5 }}>
                                <div style={{marginLeft: -75, position: 'relative'}}>
                                    <PieChart
                                        series={[pieSettings(calories, standardCalories)]}
                                        height={300}
                                    /> 
                                </div>
                                </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td> 
                        <table style={{position: 'relative'}} align='center'>
                                <tr>
                                    <td>
                                    <div className='pie' style={{
                                        // border: "1px solid black",
                                        marginLeft: width/3 > (234.6-75) ? 0 : (((width/3)-(234.6-75))/2)-5 }}>
                                    <div style={{
                                        // marginLeft: width/3 > (234.6-75) ? -75 : ((width/3)-(234.6-75)), 
                                        marginLeft: -75,
                                        position: 'relative'}}>
                                        <PieChart
                                            series={[pieSettings(micro, stanmicro)]}
                                            height={300}
                                            /> 
                                            </div>
                                    </div>
                                    </td>
                            </tr>
                        </table>
                    </td>
                    <td>
                        <table style={{position: 'relative'}} align='center'>
                            <tr>
                                <td>
                                <div className='pie' style={{
                                        // border: "1px solid black",
                                        marginLeft: width/3 > (234.6-75) ? 0 : (((width/3)-(234.6-75))/2)-5 }}>
                                <div style={{marginLeft: -75, position: 'relative'}}>
                                    <PieChart
                                        series={[pieSettings(sodium, standardSodium)]}
                                        height={300}
                                    /> 
                                    </div>
                                </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td className='percent'>{Math.floor(calories/standardCalories*100)}%</td>
                    <td className='percent'>{Math.floor(micro/stanmicro*100)}%</td>
                    <td className='percent'>{Math.floor(sodium/standardSodium*100)}%</td>
                </tr>
                <tr>
                    <td className='labels'> Calories: {parseFloat(calories).toFixed(2)} kcal / {standardCalories} kcal</td>
                    <td className='labels'> Micronutrients: <u onClick={handleOpen}>More details</u>  </td>
                    <td className='labels'> Sodium: {parseFloat(sodium).toFixed(2)} mg / {standardSodium} mg</td>
                </tr>
            </table>
            <table className='DailyHistory' 
            // style={{width: window.innerWidth-50}}
            >
                <tr>
                    <td className='DailyHistorycell'>
                        {month[monthD]} {day + dayDisplayed}, {year}
                    </td>
                    <td>
                        <hr style={{margin: "0px", marginTop: "10px"}}/>
                        {/* <hr/> */}
                    </td>
                    <td className='DailyHistorycell'>
                        <table style={{position: 'relative', zIndex: 1000}} align='center'>
                            <tr>
                                {dayDisplayed == 0 ? <td style={{paddingTop:5}} onClick={() => setDay(-1)}><IoCaretBackOutline size={30}/></td> : null}
                                <td>{dayDisplayed != 0 ? "Yesterday" : "Today"}</td>
                                {dayDisplayed != 0 ? <td style={{paddingTop:5}} onClick={() => setDay(0)}><IoCaretForwardOutline size={30}/></td> : null}
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            { sampleData.length > 0 ?
            (!isMobile ? <div className='cardsdiv'>
                <table className='cardstable'>
                    <tr>
                        {
                            sampleData.map((dish) => {
                                const cur = new Date(dish.dateSelected);
                                const HH = cur.getHours() < 10 ? (cur.getHours() == 0 ? 12 : "0"+cur.getHours()) : (cur.getHours() > 12 ? cur.getHours()-12 : cur.getHours());
                                const AMPM = cur.getHours() > 12 ? "PM" : "AM";
                                const MI = cur.getMinutes() < 10 ? "0"+cur.getMinutes() : cur.getMinutes();
                                const SS = cur.getSeconds() < 10 ? "0"+cur.getSeconds() : cur.getSeconds();
                                return  <td className='cardsdate'> {HH}:{MI}:{SS} {AMPM} </td>
                            })
                        }
                    </tr>
                    <tr>
                        {
                            sampleData.map((dish) => {
                                return  <td className='cards'>
                                    <HomePageCard data={dish} navigate={navigate} userInfo={userInfo} history={true} /> 
                                </td>
                            })
                        }
                    </tr>
                </table>
            </div> : <div>
                <table className='cardstable' style={{width: "100%"}}>
                    <tr>
                        <td>
                        {
                            sampleData.map((dish) => {
                                const cur = new Date(dish.dateSelected);
                                const HH = cur.getHours() < 10 ? (cur.getHours() == 0 ? 12 : "0"+cur.getHours()) : (cur.getHours() > 12 ? cur.getHours()-12 : cur.getHours());
                                const AMPM = cur.getHours() > 12 ? "PM" : "AM";
                                const MI = cur.getMinutes() < 10 ? "0"+cur.getMinutes() : cur.getMinutes();
                                const SS = cur.getSeconds() < 10 ? "0"+cur.getSeconds() : cur.getSeconds();
                                return  <table align='center' style={{position: 'relative'}}>
                                    <tr><td className='cardsdate'> {HH}:{MI}:{SS} {AMPM} </td>
                                </tr><tr>
                                <td className='cards'>
                                    <HomePageCard data={dish} navigate={navigate} userInfo={userInfo} history={true} /> 
                                </td></tr></table>
                            })
                        }
                    </td>
                    </tr>
                    {/* <tr>
                        {
                            sampleData.map((dish) => {
                                return  <td className='cards'>
                                    <HomePageCard data={dish} navigate={navigate} userInfo={userInfo} history={true} /> 
                                </td>
                            })
                        }
                    </tr> */}
                </table>
            </div>)
            : <div style={{position: 'relative', marginTop: isMobile ? 225-40 : 225, fontSize: 20, width: width-20, height: height-340, alignContent: 'center'}}>
                <table style={{position: 'relative'}} align='center'>No dish selected for today.</table>
            </div>}
            <MicroModal open={open} handleClose={handleClose}
            mlist={["Calcium", "Phosphorus", "Iron", "Zinc", "Vitamin A", "Vitamin B1", "Vitamin B2", "Vitamin B3", "Vitamin C", "Vitamin K"]}
            values={[calcium, phosphorus, iron, zinc, A, B1, B2, B3, C, K]}
            stanvalues={[stancalcium, stanphosphorus, staniron, stanzinc, stanA, stanB1, stanB2, stanB3, stanC, stanK]}
            />
        <AlertModal open={openAlert} handleClose={alertClose} message={alertMess} isSuccess={false}/>
        </div>
    }
}

export default History;