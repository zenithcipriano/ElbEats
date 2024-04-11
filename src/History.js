import React  from 'react';
import { useState } from "react";
import { PieChart } from '@mui/x-charts/PieChart';
import "./History.css";
import HomePageCard from './HomePageCard';
import { useNavigate } from 'react-router-dom';

function History({data}) {
    const navigate = useNavigate();
    // const [isPortrait, setIsPortrait] = useState(data.isPortrait)
    // const [gender, setGender] = useState(data.gender)
    // const [weight, setWeight] = useState(data.weight)
    const [calories, setCalories] = useState(data.calories)
    const [sodium, setSodium] = useState(data.sodium)
    // const [vitamins, setVitamins] = useState(data.vitamins)
    // const [minerals, setMinerals] = useState(data.minerals)
    const [standardCalories, setStandardCalories] = useState(data.gender.localeCompare("woman") == 0 ? 2000:2500)
    const [standardSodium, setStandardSodium] = useState(2000)
    const [width, setWidth] = useState(window.innerWidth)
    const [height, setHeight] = useState(window.innerHeight)

    const diff = 300 - (window.innerWidth/3);
    const [adjustLeft, setAdjustLeft] = useState(diff > 0 ? "-"+Math.ceil((diff)/2)+"px": "0px")

    window.onresize = function(event) {
        const diff1 = 300 - (window.innerWidth/3);
        setAdjustLeft(diff > 0 ? "-"+Math.ceil((diff)/2)+"px": "0px");
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
    }

    const pieSettings = (progress, standard) => {
        const data1 = {data: [
            { value: progress, color: "#337357" },
            { value:standard-progress < 0 ? 
                0 : standard-progress, 
                color: "#C0D6E8" },
        ],
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

    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const d = new Date();
    const numData = 10;
    const sampleData = Array(numData).fill({
        dishName: "Dish Name1",
        rate: "unrated",
        resName: "Restaurant",
        distance: "0",
        status: "Closed",
        vitamins: "A, C, K",
        minerals: "iron, magnesium",
        tabs: "Pork, Fried",
        price: "200"
    });

    const sampledates = Array.from(Array(numData).keys());

    return (<div className="HistoryPage" style={{height: width<1224 ? height-160:height-90}}>
        <table className='History' style={{width:width}}>
            <tr>
                <td> <div className='pie' style={{left: adjustLeft}}><PieChart
                series={[
                    pieSettings(calories, standardCalories),
                ]}
                height={300}
                /> </div></td>
                <td> <div className='pie' style={{left: adjustLeft}}>
                    <PieChart
                series={[
                    pieSettings(calories, standardCalories),
                ]}
                height={300}
                /> </div></td>
                <td>
                <div className='pie' style={{left: adjustLeft}}><PieChart 
                series={[
                    pieSettings(sodium, standardSodium),
                ]}
                height={300}
                /> </div></td>
            </tr>
            <tr>
                <td className='percent'>{Math.floor(calories/standardCalories*100)}%</td>
                <td className='percent'>100%</td>
                <td className='percent'>{Math.floor(sodium/standardSodium*100)}%</td>
            </tr>
            <tr>
                <td className='labels'> Calories (kcal)</td>
                <td className='labels'> Micronutrients </td>
                <td className='labels'> Sodium (mg)</td>
            </tr>
        </table>
        <table className='DailyHistory' 
        // style={{width: window.innerWidth-50}}
        >
            <tr>
                <td className='DailyHistorycell'>
                    {month[d.getMonth()]} {d.getDate()}, {d.getFullYear()}
                </td>
                <td>
                    <hr/>
                </td>
                <td className='DailyHistorycell'>
                    Meals of the Day
                </td>
            </tr>
        </table>
        <div className='cardsdiv'>
            <table className='cardstable'>
                <tr>
                    {
                        sampledates.reverse().map((date) => {
                            return  <td className='cardsdate'> 11:2{date} </td>
                        })
                    }
                </tr>
                <tr>
                    {
                        sampleData.reverse().map((dish) => {
                            return  <td className='cards'>
                                <HomePageCard data={dish} navigate={navigate}/> </td>
                        })
                    }
                </tr>
            </table>
        </div>
    </div>)
}

export default History;