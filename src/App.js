import './App.css';
import React  from 'react';
import { useMediaQuery } from 'react-responsive';
import { IoHome } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { BiSolidFoodMenu } from "react-icons/bi";
import logo from "./assets/logo.png";
import { useState } from 'react'
import HomePage from "./HomePage.js";

function App() {
  // const isDesktopOrLaptop = useMediaQuery({
  //   query: '(min-width: 1224px)'
  // })
  // const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  // const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
  // const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })

  const [homeColor, setHomeColor] = useState("black")
  const [historyColor, setHistoryColor] = useState("lightgray")
  const [profileColor, setProfileColor] = useState("lightgray")

  var iconSize = 16;

  if (isTabletOrMobile) {
    iconSize = 40;
  } else {
    iconSize = 16;
  }

  const changeTabColor = (page) => {
    if (page === 1) {
      setHomeColor("black")
      setHistoryColor("lightgray")
      setProfileColor("lightgray")
    } else if (page === 2) {
      setHomeColor("lightgray")
      setHistoryColor("black")
      setProfileColor("lightgray")
    } else if (page === 3) {
      setHomeColor("lightgray")
      setHistoryColor("lightgray")
      setProfileColor("black")
    }

    // alert(page + " | " + homeColor + " | " + historyColor + " | " + profileColor)
  }

  return (
    <div className="App">
      <section>
      <table className='header'>
          <tr>
            <th> <img className="logo" src={logo} alt="ElbEats logo"/> </th>
            <th> <h1>ElbEats</h1> </th>
          </tr>
        </table>
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
            <th style={{color: homeColor}} onClick={() => changeTabColor(1)}><h3><IoHome size={iconSize}/> Home</h3> </th>
            <th style={{color: historyColor}} onClick={() => changeTabColor(2)}><h3><BiSolidFoodMenu size={iconSize}/> Meal History</h3> </th>
            <th style={{color: profileColor}} onClick={() => changeTabColor(3)}><CgProfile size={40}/></th>
        </tr>
      </table>}
      

      <section className='body'>
        <HomePage isMobile={isTabletOrMobile}/>
      </section>

      <section className='footer'>
        {/* <h1>Device Test!</h1>
        {isDesktopOrLaptop && <p>You are a desktop or laptop</p>}
        {isBigScreen && <p>You  have a huge screen</p>}
        {isTabletOrMobile && <p>You are a tablet or mobile phone</p>}
        <p>You are in {isPortrait ? 'portrait' : 'landscape'} orientation</p>
        {isRetina && <p>You are retina</p>} */}
      </section>
    </div>
  );
}

export default App;