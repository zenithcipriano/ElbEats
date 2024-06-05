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
    const gender = 'M';
    const age = 18; // age 18 - 29
    const weight = gender == 'M' ? 60.5 : 52.5
    // const weight
    const [standardCalories, setStandardCalories] = useState(0);
    const setStanCal = (age, gender) => {
        setStandardCalories(age == 18 ? (gender == 'M' ? 3010 : 2280)
                        : (gender == 'M' ? 2530 : 1930))
    }

    // useState(data.gender.localeCompare("man") == 0 ? 2500:2000)
    const standardSodium = 500;
    const [stancalcium, setstancalcium] = useState(0);
    const setStanCalc = (age) => age == 18 ? setstancalcium(1000) : setstancalcium(750);

    const [stanphosphorus, setstanphosphorus] = useState(0);
    const setStanPhos = (age) => age == 18 ? setstanphosphorus(1250) : setstanphosphorus(700);

    const [staniron, setstaniron] = useState(0);
    const setStanIr = (age, gender) => gender != 'M' ? setstaniron(28) : age == 18 ? setstaniron(14) : setstaniron(12);

    const [stanzinc, setstanzinc] = useState(0);
    const setStanZn = (age, gender) => {
        setstanzinc(age == 18 ? (gender == 'M' ? 9.0 : 7.2)
                        : (gender == 'M' ? 6.5 : 4.6))
    }

    const [stanA, setstandA] = useState(0);
    const setStanA = (age, gender) => gender != 'M' ? setstandA(600) : age == 18 ? setstandA(800) : setstandA(700);

    const [stanB1, setstandB1] = useState(0);
    const setStanB1 = (age, gender) => gender != 'M' ? setstandB1(1.1) : age == 18 ? setstandB1(1.4) : setstandB1(1.2);

    const [stanB2, setstandB2] = useState(0);
    const setStanB2 = (age, gender) => gender != 'M' ? setstandB2(1.1) : age == 18 ? setstandB2(1.5) : setstandB2(1.3);

    const [stanB3, setstandB3] = useState(0);
    const setStanB3 = (age, gender) => gender != 'M' ? setstandB3(14) : age == 18 ? setstandB3(18) : setstandB3(16);

    const [stanC, setstandC] = useState(0);
    const setStanC = (gender) => gender == 'M' ? setstandC(70) : setstandC(60);

    const [stanK, setstandK] = useState(0);
    const setStanK = (age, gender) => {
        setstandK(age == 18 ? (gender == 'M' ? 59 : 52)
                        : (gender == 'M' ? 61 : 53))
    }

    const [stanmicro, setstanmicro] = useState(1);
    useEffect(() => {
        const temp1 = stancalcium + stanphosphorus + staniron + stanzinc + stanA + stanB1 + stanB2 + stanB3 + stanC + stanK;
        // console.log(temp1);
        setstanmicro(temp1);
        setmicro(
            Math.floor(calcium/stancalcium * 100 >= 100 ? 100 : calcium/stancalcium * 100) + 
            Math.floor(phosphorus/stanphosphorus * 100 >= 100 ? 100 : phosphorus/stanphosphorus * 100) + 
            Math.floor(iron/staniron * 100 >= 100 ? 100 : iron/staniron * 100) + 
            Math.floor(zinc/stanzinc * 100 >= 100 ? 100 : zinc/stanzinc * 100) + 
            Math.floor(A/stanA * 100 >= 100 ? 100 : A/stanA * 100) + 
            Math.floor(B1/stanB1 * 100 >= 100 ? 100 : B1/stanB1 * 100) + 
            Math.floor(B2/stanB2 * 100 >= 100 ? 100 : B2/stanB2 * 100) + 
            Math.floor(B3/stanB3 * 100 >= 100 ? 100 : B3/stanB3 * 100) + 
            Math.floor(C/stanC * 100 >= 100 ? 100 : C/stanC * 100) + 
            Math.floor(K/stanK * 100 >= 100 ? 100 : K/stanK * 100)
        );
    }, [stancalcium]);
    useState(stancalcium + stanphosphorus + staniron + stanzinc + stanA + stanB1 + stanB2 + stanB3 + stanC, + stanK);

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

    const microSettings = () => {
        const calcProgress =  calcium < stancalcium ? calcium/stancalcium * 100 : 100;
        const phosProg = phosphorus < stanphosphorus ? phosphorus/stanphosphorus * 100 : 100;
        const irProg = iron < staniron ? iron/staniron * 100 : 100;
        const znProg = zinc < stanzinc ? zinc/stanzinc * 100 : 100;
        const AProg = A < stanA ? A/stanA * 100 : 100;
        const CProg = C < stanC ? C/stanC * 100 : 100;
        const KProg = K < stanK ? K/stanK * 100 : 100;
        const B1Prog = B1 < stanB1 ? B1/stanB1 * 100 : 100;
        const B2Prog = B2 < stanB2 ? B2/stanB2 * 100 : 100;
        const B3Prog = B3 < stanB3 ? B3/stanB3 * 100 : 100;

        const data = [
            // { value: progress, color: percent < 20 ? "#6e2323" : percent < 40 ? "orange" : percent < 60 ? "yellow" : percent < 80 ? "#9ACD32" : percent > 110 ? "#6e2323" : "#337357"},
            {value: calcProgress, label: 'Calcium', color: calcium/stancalcium * 100 < 20 ? "#6e2323" : calcium/stancalcium * 100 < 40 ? "orange" : calcium/stancalcium * 100 < 60 ? "yellow" : calcium/stancalcium * 100 < 80 ? "#9ACD32" : calcium/stancalcium * 100 > 110 ? "#6e2323" : "#337357"},
            // {value: stancalcium-calcium < 0 ? 0 : 100-(calcium/stancalcium * 100), color: "#C0D6E8"},
            {value: phosProg, label: 'Phosphorus', color: phosphorus/stanphosphorus * 100 < 20 ? "#6e2323" : phosphorus/stanphosphorus * 100 < 40 ? "orange" : phosphorus/stanphosphorus * 100 < 60 ? "yellow" : phosphorus/stanphosphorus * 100 < 80 ? "#9ACD32" : phosphorus/stanphosphorus * 100 > 110 ? "#6e2323" : "#337357"},
            {value: irProg, label: 'Iron', color: iron/staniron * 100 < 20 ? "#6e2323" : iron/staniron * 100 < 40 ? "orange" : iron/staniron * 100 < 60 ? "yellow" : iron/staniron * 100 < 80 ? "#9ACD32" : iron/staniron * 100 > 110 ? "#6e2323" : "#337357"},
            {value: znProg, label: 'Zinc', color: zinc/stanzinc * 100 < 20 ? "#6e2323" : zinc/stanzinc * 100 < 40 ? "orange" : zinc/stanzinc * 100 < 60 ? "yellow" : zinc/stanzinc * 100 < 80 ? "#9ACD32" : zinc/stanzinc * 100 > 110 ? "#6e2323" : "#337357"},
            {value: AProg, label: 'Vitamin A', color: A/stanA * 100 < 20 ? "#6e2323" : A/stanA * 100 < 40 ? "orange" : A/stanA * 100 < 60 ? "yellow" : A/stanA * 100 < 80 ? "#9ACD32" : A/stanA * 100 > 110 ? "#6e2323" : "#337357"},
            {value: B1Prog, label: 'Vitamin B1', color: B1/stanB1 * 100 < 20 ? "#6e2323" : B1/stanB1 * 100 < 40 ? "orange" : B1/stanB1 * 100 < 60 ? "yellow" : B1/stanB1 * 100 < 80 ? "#9ACD32" : B1/stanB1 * 100 > 110 ? "#6e2323" : "#337357"},
            {value: B2Prog, label: 'Vitamin B2', color: B2/stanB2 * 100 < 20 ? "#6e2323" : B2/stanB2 * 100 < 40 ? "orange" : B2/stanB2 * 100 < 60 ? "yellow" : B2/stanB2 * 100 < 80 ? "#9ACD32" : B2/stanB2 * 100 > 110 ? "#6e2323" : "#337357"},
            {value: B3Prog, label: 'Vitamin B3', color: B3/stanB3 * 100 < 20 ? "#6e2323" : B3/stanB3 * 100 < 40 ? "orange" : B3/stanB3 * 100 < 60 ? "yellow" : B3/stanB3 * 100 < 80 ? "#9ACD32" : B3/stanB3 * 100 > 110 ? "#6e2323" : "#337357"},
            {value: CProg, label: 'Vitamin C', color: C/stanC * 100 < 20 ? "#6e2323" : C/stanC * 100 < 40 ? "orange" : C/stanC * 100 < 60 ? "yellow" : C/stanC * 100 < 80 ? "#9ACD32" : C/stanC * 100 > 110 ? "#6e2323" : "#337357"},
            {value: KProg, label: 'Vitamin K', color: K/stanK * 100 < 20 ? "#6e2323" : K/stanK * 100 < 40 ? "orange" : K/stanK * 100 < 60 ? "yellow" : K/stanK * 100 < 80 ? "#9ACD32" : K/stanK * 100 > 110 ? "#6e2323" : "#337357"},
            {value: (10*100) - (calcProgress + phosProg + irProg + znProg + AProg + B1Prog + B2Prog + B3Prog + CProg + KProg)
                , color: "#C0D6E8"}
            // {value: stancalcium-calcium < 0 ? 0 : 100-(calcium/stancalcium * 100), color: "#C0D6E8"},
            // { value:stanmicro-micro < 0 ? 
            //     0 : stanmicro-micro, 
            //     color: "#C0D6E8" },
        ]
        return data;
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
        const tempDay = parseInt(day) + parseInt(dayDisplayed)
        const time = `${year}-${(1+monthD) < 10 ? "0" + (1+monthD) : (1+monthD)}-${tempDay < 10 ? "0" + tempDay : tempDay} 00:00:00`;
        const nextTime = `${year}-${(1+monthD) < 10 ? "0" + (1+monthD) : (1+monthD)}-${tempDay+1 < 10 ? "0" + tempDay+1 : tempDay+1} 00:00:00`;
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

                const age = localStorage.getItem("age");
                const gender = localStorage.getItem("sex");
                setCalories(caltotal); setStanCal(age, gender);
                setSodium(ingSodiumFinal);

                setcalcium(calcium1); setStanCalc(age);
                setphosphorus(phosphorus1); setStanPhos(age);
                setiron(iron1); setStanIr(age, gender);
                setzinc(zinc1); setStanZn(age, gender);
                setA(A1); setStanA(age, gender);
                setB1(B11); setStanB1(age, gender);
                setB2(B21); setStanB2(age, gender);
                setB3(B31); setStanB3(age, gender);
                setC(C1); setStanC(gender);
                setK(K1); setStanK(age, gender);
                // const temp1 = stancalcium + stanphosphorus + staniron + stanzinc + stanA + stanB1 + stanB2 + stanB3 + stanC + stanK;
                // console.log(temp1);
                // setstanmicro(temp1);
                // setmicro(
                //     Math.floor(calcium1/stancalcium * 100 >= 100 ? 100 : calcium1/stancalcium * 100) + 
                //     Math.floor(phosphorus1/stanphosphorus * 100 >= 100 ? 100 : phosphorus1/stanphosphorus * 100) + 
                //     Math.floor(iron1/staniron * 100 >= 100 ? 100 : iron1/staniron * 100) + 
                //     Math.floor(zinc1/stanzinc * 100 >= 100 ? 100 : zinc1/stanzinc * 100) + 
                //     Math.floor(A1/stanA * 100 >= 100 ? 100 : A1/stanA * 100) + 
                //     Math.floor(B11/stanB1 * 100 >= 100 ? 100 : B11/stanB1 * 100) + 
                //     Math.floor(B21/stanB2 * 100 >= 100 ? 100 : B21/stanB2 * 100) + 
                //     Math.floor(B31/stanB3 * 100 >= 100 ? 100 : B31/stanB3 * 100) + 
                //     Math.floor(C1/stanC * 100 >= 100 ? 100 : C1/stanC * 100) + 
                //     Math.floor(K1/stanK * 100 >= 100 ? 100 : K1/stanK * 100)
                // );

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
    const [cardOpen, setCardOpen] = useState(0);

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
                                        marginLeft: width/3 > (234.6-75) ? 0 : (((width/3)-(234.6-75))/2)-5,
                                        zIndex: 100 }}>
                                    <div style={{
                                        // marginLeft: width/3 > (234.6-75) ? -75 : ((width/3)-(234.6-75)), 
                                        marginLeft: -75,
                                        position: 'relative'}}>
                                        <PieChart
                                            series={[
                                                // const percent = progress/standard * 100
                                                {data: microSettings(),
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
                                            ]}
                                            slotProps={{
                                                legend: { hidden: true },
                                            }}
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
            // (!isMobile ? 
            <div className='cardsdiv'>
                <table className='cardstable'>
                    <tr>
                        {
                            sampleData.map((dish) => {
                                const cur = new Date(dish.dateSelected);
                                const hours = cur.getHours() + 4;
                                console.log(hours);
                                const HH = hours < 10 ? (hours == 0 ? 12 : "0"+hours) : (hours > 12 ? hours-12 : hours);
                                const AMPM = hours < 12 ? "PM" : "AM";
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
                                    <HomePageCard setCardOpen={setCardOpen} cardOpen={cardOpen} data={dish} navigate={navigate} userInfo={userInfo} history={true} /> 
                                </td>
                            })
                        }
                    </tr>
                </table>
            </div> 
            // : <div>
            //     <table className='cardstable' style={{width: "100%"}}>
            //         <tr>
            //             <td>
            //             {
            //                 sampleData.map((dish) => {
            //                     const cur = new Date(dish.dateSelected);
            //                     const HH = cur.getHours() < 10 ? (cur.getHours() == 0 ? 12 : "0"+cur.getHours()) : (cur.getHours() > 12 ? cur.getHours()-12 : cur.getHours());
            //                     const AMPM = cur.getHours() > 12 ? "PM" : "AM";
            //                     const MI = cur.getMinutes() < 10 ? "0"+cur.getMinutes() : cur.getMinutes();
            //                     const SS = cur.getSeconds() < 10 ? "0"+cur.getSeconds() : cur.getSeconds();
            //                     return  <table align='center' style={{position: 'relative'}}>
            //                         <tr><td className='cardsdate'> {HH}:{MI}:{SS} {AMPM} </td>
            //                     </tr><tr>
            //                     <td className='cards'>
            //                         <HomePageCard data={dish} navigate={navigate} userInfo={userInfo} history={true} /> 
            //                     </td></tr></table>
            //                 })
            //             }
            //         </td>
            //         </tr>
            //     </table>
            // </div>)
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