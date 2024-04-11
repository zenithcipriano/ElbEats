import './App.css';
import React  from 'react';
import { useMediaQuery } from 'react-responsive';
import { IoHome } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { BiSolidFoodMenu } from "react-icons/bi";
import logo from "./assets/Untitled_design__1_-removebg-preview.png";
import { useState } from 'react'
import HomePage from "./HomePage.js";
import Login from './Login.js';
import History from './History.js';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';  
import DishPage from './DishPage.js';
import "@fontsource/rubik";
import RestaurantPage from './RestaurantPage.js';
import ProfilePage from './profilepage.js';

function Main() {
  // const isDesktopOrLaptop = useMediaQuery({
  //   query: '(min-width: 1224px)'
  // })
  // const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  // const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
  // const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })

  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  console.log(pathname);

  const pageList = ["/", "/history", "/profile"];
  const [page, setPage] = useState(pageList.indexOf(pathname)+1);
  const [homeColor, setHomeColor] = useState(page == 1?"#A34343":"#C0D6E8")
  const [historyColor, setHistoryColor] = useState(page == 2?"#A34343":"#C0D6E8")
  const [profileColor, setProfileColor] = useState(page == 3?"#A34343":"#C0D6E8")

  var iconSize = 16;
  if (isTabletOrMobile) {
    iconSize = 40;
  } else {
    iconSize = 22;
  }

  const changeTabColor = (page1) => {
    navigate(pageList[page1-1]);
    setPage(page1);
    setHomeColor(page1 == 1?"#A34343":"#C0D6E8");
    setHistoryColor(page1 == 2?"#A34343":"#C0D6E8");
    setProfileColor(page1 == 3?"#A34343":"#C0D6E8");
  }

  // const [keywords, setKeywords] = useState("");
  // const handleChange = (event) => {
  //   setKeywords(event.target.value);
  //   // console.log(keywords);
  // }

  const data1 = {
    calories: 1000,
    sodium: 50,
    gender: "man",
    isPortrait: isTabletOrMobile
  }

  return (
    <div className="App" style={{fontFamily: "Rubik"}}>
      <section>
      <table className='header'>
          <tr>
            <th style={{textAlign: "left"}}> <img className="logo" src={logo} alt="ElbEats logo"/> </th>
            {/* <th> <input type="text" value={keywords} onChange={handleChange} /> </th> */}
          </tr>
        </table>
      </section>

      <section className='body' style={{height: isTabletOrMobile?"76%":"100%"}} >
        <Routes>
          <Route exact={true} path="/" element={ <HomePage isMobile={isTabletOrMobile}/> } />
          <Route exact={true} path="/history" element={ <History data={data1} /> } />
          <Route exact={true} path="/login" element={ <Login/> } />
          <Route exact={true} path="/dish" element={<DishPage isMobile={isTabletOrMobile} navigate={navigate}/>} />
          <Route exact={true} path="/restaurant" element={<RestaurantPage isMobile={isTabletOrMobile}/>} />
          <Route exact={true} path="/profile" element={<ProfilePage />} />
          <Route path="/*" element={ < Navigate to="/"/> }/>
        </Routes>
      {/* {page==1?
        <HomePage isMobile={isTabletOrMobile}/> : 
      page==2? 
        <History data={data1} />:
      page==3? 
        <Login/>:
        <div></div>
      } */}
      </section>

      {isTabletOrMobile ? <table className='phoneTable'>
        <tr>
            <th style={{color: homeColor}} onClick={() => changeTabColor(1)}><IoHome size={iconSize}/></th>
            <th style={{color: historyColor}} onClick={() => changeTabColor(2)}><BiSolidFoodMenu size={iconSize}/></th>
            <th style={{color: profileColor}} onClick={() => changeTabColor(3)}><CgProfile size={iconSize}/></th>
        </tr>
      </table> :
      <table className='desktopTable'>
        <tr>
            <th style={{color: homeColor}} onClick={() => changeTabColor(1)}><h2><IoHome size={iconSize}/> <u>Home</u></h2> </th>
            <th style={{color: historyColor}} onClick={() => changeTabColor(2)}><h2><BiSolidFoodMenu size={iconSize}/> <u>Meal History</u></h2> </th>
            <th style={{color: profileColor}} onClick={() => changeTabColor(3)}><CgProfile size={40}/></th>
        </tr>
      </table>}
      
      {/* <section className='footer'>
      </section> */}
    </div>
  );
}

export default Main;