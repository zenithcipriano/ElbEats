import React  from 'react';
import HomePageCard from './HomePageCard';
import { useState } from "react";
import "./HomePage.css";
import { useNavigate } from 'react-router-dom';

function HomePage({isMobile}) {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isSet, setIsSet] = useState(0);
    const sampleData = [{
        dishName: "Dish Name1",
        rate: "unrated",
        resName: "Restaurant",
        distance: "0",
        status: "Closed",
        vitamins: "A, C, K",
        minerals: "iron, magnesium",
        tabs: "Pork, Fried",
        price: "200"
    },
    {
        dishName: "Dish Name2",
        rate: "unrated",
        resName: "Restaurant",
        distance: "0",
        status: "Closed",
        vitamins: "A, C, K",
        minerals: "iron, magnesium",
        tabs: "Pork, Fried",
        price: "200"
    },
    {
        dishName: "Dish Name3",
        rate: "unrated",
        resName: "Restaurant",
        distance: "0",
        status: "Closed",
        vitamins: "A, C, K",
        minerals: "iron, magnesium",
        tabs: "Pork, Fried",
        price: "200"
    },
    {
        dishName: "Dish Name4",
        rate: "unrated",
        resName: "Restaurant",
        distance: "0",
        status: "Closed",
        vitamins: "A, C, K",
        minerals: "iron, magnesium",
        tabs: "Pork, Fried",
        price: "200"
    },
    {
        dishName: "Dish Name1",
        rate: "unrated",
        resName: "Restaurant",
        distance: "0",
        status: "Closed",
        vitamins: "A, C, K",
        minerals: "iron, magnesium",
        tabs: "Pork, Fried",
        price: "200"
    },
    {
        dishName: "Dish Name2",
        rate: "unrated",
        resName: "Restaurant",
        distance: "0",
        status: "Closed",
        vitamins: "A, C, K",
        minerals: "iron, magnesium",
        tabs: "Pork, Fried",
        price: "200"
    },
    {
        dishName: "Dish Name3",
        rate: "unrated",
        resName: "Restaurant",
        distance: "0",
        status: "Closed",
        vitamins: "A, C, K",
        minerals: "iron, magnesium",
        tabs: "Pork, Fried",
        price: "200"
    },
    {
        dishName: "Dish Name4",
        rate: "unrated",
        resName: "Restaurant",
        distance: "0",
        status: "Closed",
        vitamins: "A, C, K",
        minerals: "iron, magnesium",
        tabs: "Pork, Fried",
        price: "200"
    },
    ];
    
    const tableBorder = 15;
    const perCard = 282 + tableBorder;
    const tempCol = Math.floor((window.innerWidth - tableBorder) / perCard);
    const [border, setBorder] = useState((window.innerWidth - ((tempCol * perCard) + (tableBorder*3))) / 2 - 10);

    if(!isSet) {
        const temp = [];
        while(sampleData.length) temp.push(sampleData.splice(0,tempCol));
        setData(temp);
        setIsSet(1);
    }

    window.onresize = function(event) {
        // console.log(window.innerWidth);
        const columns = Math.floor((window.innerWidth - tableBorder) / perCard);
        setBorder((window.innerWidth - ((columns * perCard) + (tableBorder*3))) / 2 - 10);
        // const rows = Math.ceil(data/columns);

        const temp = [];
        while(sampleData.length) temp.push(sampleData.splice(0,columns));
        setData(temp);
    };

    return <div >
        {/* {JSON.stringify(data)} */}
        <table className="HomePage"
        style={{
            left: border+"px",
            paddingRight: border+"px",
            borderSpacing: tableBorder+"px",
            height: isMobile ? window.innerHeight - (95+68.36) : window.innerHeight - (98),
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

export default HomePage;