import React  from 'react';
import HomePageCard from './HomePageCard';
import { useState } from "react";
import "./HomePage.css";

function HomePage({isMobile}) {
    const [data, setData] = useState([]);

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
    ];

    const tableBorder = 15;
    const perCard = 282 + tableBorder;
    const tempCol = useState(Math.floor((window.innerWidth - tableBorder) / perCard));
    const [border, setBorder] = useState((window.innerWidth - ((tempCol * perCard) + (tableBorder*3))) / 2 - 10);

    window.onresize = function(event) {
        console.log(window.innerWidth);
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
            paddingLeft: border+"px",
            paddingRight: border+"px",
            borderSpacing: tableBorder+"px",
            height: isMobile ? "72%" : "83%"
        }}>
            {
                
            }
                {
                    data.map((row) => {
                        return <tr> 
                            <td>{
                                row.map((dish) => {
                                    return  <td style={{ 
                                        // border: "1px solid black" 
                                        }}>
                                        {/* {border} */}
                                        <HomePageCard data={dish}/> </td>
                                })    
                            }</td>
                        </tr>
                    })
                }
        </table>
    </div>
}

export default HomePage;