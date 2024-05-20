import './App.css';
import React  from 'react';
import { useMediaQuery } from 'react-responsive';
import { IoHome } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { BiSolidFoodMenu } from "react-icons/bi";
import logo from "./assets/finalLogo.png";
import { useState, useEffect } from 'react'
import HomePage from "./HomePage.js";
import Login from './Login.js';
import History from './History.js';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';  
import { FaSearch } from "react-icons/fa";
import DishPage from './DishPage.js';
import "@fontsource/rubik";
import RestaurantPage from './RestaurantPage.js';
import ProfilePage from './profilepage.js';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import Cookies from "universal-cookie";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IoLogOutOutline } from "react-icons/io5";
import { RiProfileLine } from "react-icons/ri";
import OwnerPage from './Owner.js';
import ProgressBar1 from './progress.js';
import { GiMeal } from 'react-icons/gi';

function Main() {
  // const isDesktopOrLaptop = useMediaQuery({
  //   query: '(min-width: 1224px)'
  // })
  // const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
  // const Phone = useMediaQuery({ query: '(max-width: 600px)' })

  // useEffect(() => {
  //   if(Phone) {
  //     // document.getElementById("searchDiv1").style.zoom = "80%";
  //     console.log(document.getElementById("searchDiv1"))
  //     //  = "80%";

  //   } else {
  //     document.getElementById("searchDiv1").style.zoom = "100%";
  //   }
  // }, [Phone])
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  // const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
  // const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })

  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  // console.log(pathname);

  const pageList = ["/", "/history", "/profile"];
  const [page, setPage] = useState(pageList.indexOf(pathname)+1);
  const [homeColor, setHomeColor] = useState(isTabletOrMobile ? "#A34343" : "white")
  const [historyColor, setHistoryColor] = useState(isTabletOrMobile ? "#A34343" : "white")
  const [profileColor, setProfileColor] = useState(isTabletOrMobile ? "#A34343" : "white")

  var iconSize = 16;
  if (isTabletOrMobile) {
    iconSize = 40;
  } else {
    iconSize = 30;
  }

  useEffect(() => {
    setHomeColor(isTabletOrMobile ? "#A34343" : "white")
    setHistoryColor(isTabletOrMobile ? "#A34343" : "white")
    setProfileColor(isTabletOrMobile ? "#A34343" : "white")
  }, [isTabletOrMobile]);

  const changeTabColor = (page1) => {
    if(pathname == pageList[page1-1]) {
      window.location.reload();
    } else {
      navigate(pageList[page1-1]);
      setPage(page1);
      if(page1 == 1) {
        setSU("");
      }
    }
    // setHomeColor("white");
    // setHistoryColor("white");
    // setProfileColor("white");
  }

  const [keywords, setKeywords] = useState("");
  const handleChange = (event) => {
    setKeywords(event.target.value);
  }

  const data1 = {
    calories: 1000,
    sodium: 50,
    gender: "man",
    isPortrait: isTabletOrMobile
  }

  const style1 = {
    zIndex: 1,
  }

  const [userInfo, setUserInfo] = useState({}); 
  const [isLoggedIn, setIsLoggedIn] = useState(-1);
  const checkLog = async () => {
    // axios.defaults.withCredentials = true;
    await axios({
        method: 'post',
        url: process.env.REACT_APP_API_URL+"/checkifloggedin",
        withCredentials: true,
        data: {
          cookies: cookies
        }
    }).then((res) => {
      // alert(JSON.stringify(res.data))
        if(res.data.isLoggedIn){
          setUserInfo({
            id: localStorage.getItem("user_reference"),
            type: localStorage.getItem("user_type")
          })
          setIsLoggedIn(1);
        } else{
            // alert(res.data.isLoggedIn)
            setIsLoggedIn(0);
        }
    })}

  useEffect(() => {
    if(isLoggedIn == -1) {
      checkLog();
    }
  }, []);

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const options = ["View Profile", "Logout"]
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const cookies = new Cookies();
  const handleClose = (choice) => {
    // const cookies = new Cookies();
    setAnchorEl(null);
    setOpen(false);

    if("Logout" == choice) {
      setIsLoggedIn(0);
      cookies.remove("authToken");
      localStorage.removeItem("user_reference");
      localStorage.removeItem("user_type");
      if (page == 1) {
        window.location.reload();
      }
    } else {
      changeTabColor(3)
    }
  };

  const [submittedInput, setSU] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    navigate(pageList[0]);
    setPage(1);
    setSU(keywords);
  }

  if(isLoggedIn == -1) {
    return <div style={{
      alignContent: 'center',
      height: window.innerHeight-60}}>
      <ProgressBar1 height={200}/>
    </div>
  } else {
    return (
      <div className="App" style={{fontFamily: "Rubik"}}>
        <section>
        <div id='searchDiv1' >
          <table className='header' 
          style={style1}
          >
              <tr>
                <th style={{textAlign: "left", width: "0px"}}> <img onClick={() => changeTabColor(1)} className="logo" src={logo} alt="ElbEats logo"/> </th>
              </tr>
          </table>
        {/* <div id='searchDiv1' > */}

          <form onSubmit={handleSubmit}>
            <table id="searchDiv" align={isTabletOrMobile ? 'right' : 'center'}
            style={isTabletOrMobile ? {width: "35%", marginRight: "10px", zIndex: 1} : {width: "25%", zIndex: 1}}><tr>
                <td><input id="searchInput" type="text" value={keywords} onChange={handleChange} placeholder='Search'/></td> 
                <td style={{width: "25px"}} onClick={handleSubmit}><FaSearch size={20} style={{marginTop: "1px"}}/> </td>
            </tr></table>
          </form>
        </div>
        </section>

        <section className='body' style={{height: "100%"}} >
          <Routes>
            <Route path="/" element={ <HomePage isMobile={isTabletOrMobile} submittedInput={submittedInput} keywords={keywords} /> } />
            <Route path="/history" element={ isLoggedIn == 1 && userInfo.type == "reviewer"? <History data={data1} /> : < Navigate to="/"/>} />
            <Route path="/login" element={ isLoggedIn == 1 ? < Navigate to="/profile"/> : <Login checkLog={checkLog} cookies={cookies}/> } />
            <Route path="/dish/:id" element={<DishPage isMobile={isTabletOrMobile} navigate={navigate}/>} />
            <Route path="/restaurant/:id" element={<RestaurantPage isMobile={isTabletOrMobile}/>} />
            <Route path="/profile" element={ isLoggedIn == 1 ? userInfo.type == "reviewer" ? <ProfilePage isMobile={isTabletOrMobile}/> : <OwnerPage isMobile={isTabletOrMobile}/> : < Navigate to="/login"/>} />
            {/* <Route path="/*" element={ < Navigate to="/"/> }/> */}
          </Routes>
        </section>

        {isTabletOrMobile ? <table className='phoneTable'>
          <tr>
              <th style={{color: homeColor}} onClick={() => changeTabColor(1)}><IoHome size={iconSize}/></th>
              { isLoggedIn == 1 && userInfo.type == "reviewer" ? <th style={{color: historyColor}} onClick={() => changeTabColor(2)}><GiMeal size={iconSize}/></th>
              : null}
              {isLoggedIn ? <th><IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={open ? 'long-menu' : undefined}
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                  style={{color: profileColor, padding: "0px", marginLeft: "-5px", marginTop: "-5px"}}
                >
                  <CgProfile size={40}/>
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={() => {
                    setAnchorEl(null);
                    setOpen(false);
                  }}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  {options.map((option) => (
                    <MenuItem key={option} onClick={() => handleClose(option)} style={{fontSize: "20px", fontWeight: "bold"}}>
                      {"View Profile" == option? <RiProfileLine style={{paddingRight: "5px"}}/> : 
                      "Logout" == option? <IoLogOutOutline style={{paddingRight: "5px"}}/>:
                      <div></div>} {option}
                    </MenuItem>
                  ))}
                </Menu></th>
              // : <th onClick={() => changeTabColor(3)} style={{color: profileColor}}><CgProfile size={iconSize} /></th>}
              : <th onClick={() => changeTabColor(3)} style={{color: profileColor}}>Login/Signup</th>}
          </tr>
        </table> :
        <table className='desktopTable' style={style1}>
          <tr>
              <th style={{color: homeColor}} onClick={() => changeTabColor(1)}>
                {/* <h2><IoHome size={iconSize}/> <u>Home</u></h2> */}
                <table style={{position: "relative"}}>
                  <tr>
                    <td><IoHome size={iconSize} /></td>
                    <td><h2><u>Home</u></h2></td>
                  </tr>
                </table>
              </th>
              { isLoggedIn == 1 && userInfo.type == "reviewer" ? <th style={{color: historyColor}} onClick={() => changeTabColor(2)}>
                {/* <h2><BiSolidFoodMenu size={iconSize}/> <u>Meal History</u></h2>  */}
                  <table style={{position: "relative"}}>
                    <tr>
                      <td><GiMeal size={iconSize} /></td>
                      <td><h2><u>Meal of the Day</u></h2></td>
                    </tr>
                  </table>
              </th>
              : null}
              {/* Profile Button */}
              {isLoggedIn ? <th><IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={open ? 'long-menu' : undefined}
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                  style={{color: profileColor, padding: "0px", marginLeft: "-5px", marginTop: "-5px"}}
                >
                  <CgProfile size={40}/>
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={() => {
                    setAnchorEl(null);
                    setOpen(false);
                  }}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  {options.map((option) => (
                    <MenuItem key={option} onClick={() => handleClose(option)} style={{fontSize: "15px", fontWeight: "bold"}}>
                      {"View Profile" == option? <RiProfileLine style={{paddingRight: "5px"}}/> : 
                      "Logout" == option? <IoLogOutOutline style={{paddingRight: "5px"}}/>:
                      <div></div>} {option}
                    </MenuItem>
                  ))}
                </Menu></th>
              : <th onClick={() => changeTabColor(3)} style={{color: profileColor, paddingLeft: "10px"}}>
                  <table style={{position: "relative"}}>
                    <tr>
                      {/* <td><CgProfile size={iconSize} /></td> */}
                      <td><h2><u>Login/Signup</u></h2></td>
                    </tr>
                  </table>
                </th>}
          </tr>
        </table>}
        
        {/* <section className='footer'>
        </section> */}
      </div>
    );
  }
}

export default Main;