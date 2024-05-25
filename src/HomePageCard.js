import React  from 'react';
import "./HomePageCard.css";
import { Card } from 'react-bootstrap';
import { CiStar } from "react-icons/ci";
import { FaWalking, FaRegBookmark, FaStar } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiEditAlt } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GrRestaurant } from "react-icons/gr";
import { GiKnifeFork } from "react-icons/gi";
import AddDishModal from './AddDishModal';
import DeleteModal from './DeleteModal';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { GoBookmarkSlash } from "react-icons/go";
import AlertModal from './alertModal';

class HomePageCard extends React.Component {
  constructor(props) {
    super(props);

    const options = props.userInfo.type == "owner" && props.userInfo.id == props.data.userID ? [
      "View Dish Details",
      "Edit Dish Details",
      "Delete Dish Details",
      "View Restaurant Details"
    ] : ( this.props.userInfo.type == "reviewer" ? [
      "Select as a Meal",
      (props.history ? "Remove from History" : null),
      "View Dish Details",
      "View Restaurant Details"
    ] : [
      "View Dish Details",
      "View Restaurant Details"
    ])

    // if (props.history && this.props.userInfo.type == "reviewer") {
    //   options.push("Remove Dish from History");
    // }

    const d = new Date();
    const curday = d.getDay().toString();
    const curHour = d.getHours();
    const curMinute = d.getMinutes();

    const isOpenDay = props.data.daysOfTheWeek.includes(curday);

    // console.log(props.data.openingTime);
    // console.log(props.data.closingTime);
    // console.log(props.data.daysOfTheWeek);

    let isOpenTime0 = false
    if (props.data.openingTime) {
      const openT = props.data.openingTime.split(":");
      isOpenTime0 = curHour > parseInt(openT[0]) ? true : 
                          curHour == parseInt(openT[0]) && curMinute >= parseInt(openT[1]);
    }

    let isOpenTime1 = false
    if (props.data.closingTime) {
      const closedT = props.data.closingTime.split(":");
      isOpenTime1 = curHour < parseInt(closedT[0]) ? true : 
                          curHour == parseInt(closedT[0]) && curMinute <= parseInt(closedT[1]);
    }

    this.state = {
        dishName: props.data.dishname,
        rate: props.data.reviewCount == 0 ? "unrated": props.data.ratings,
        reviewCount: props.data.reviewCount,
        resName: props.data.restoname,
        distance: 0,
        status:  isOpenDay && isOpenTime0 && isOpenTime1 ? "Open": "Closed",
        vitamins: props.data.vitamins,
        calories: parseInt(props.data.ingCaloriesFinal),
        sodium: parseInt(props.data.ingSodiumFinal),
        minerals: props.data.minerals,
        available: props.data.available,
        // tabs: tb ? tb.replace(" ", "").split(",").slice(0,2) : [],
        price: props.data.walkinprice,
        image: props.data.images[0],
        anchorEl: null,
        open: false,
        dishID: props.data.dishID,
        restoID: props.data.restoID,
        openDish : false,
        openDel: false,
        options: options,
        loading: false,
        openAlert: false,
        alertMess: ""
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.alertOpen = this.alertOpen.bind(this);
    this.alertClose = this.alertClose.bind(this);
  }

  alertOpen(mess) {
    this.setState({openAlert: true, alertMess: mess});
  }

  alertClose() {
    this.setState({openAlert: false});
  }

  componentDidUpdate(prevProps, prevState) {
      if(prevProps.userInfo.id != this.props.userInfo.id) {
        const options = this.props.userInfo.type == "owner" && this.props.userInfo.id == this.props.data.userID ? [
          "View Dish Details",
          "Edit Dish Details",
          "Delete Dish Details",
          "View Restaurant Details"
        ] : ( this.props.userInfo.type == "reviewer" ? [
          "Select as a Meal",
          "View Dish Details",
          "View Restaurant Details"
        ] : [
          "View Dish Details",
          "View Restaurant Details"
        ])

        this.setState({options: options, userInfo: this.props.userInfo})
      }
  }

  // handleClick(event) {
  //   this.setState({anchorEl: event.currentTarget, open: true});
  // };

  async handleClose(choice) {
    this.setState({anchorEl: null});
    if("View Restaurant Details" == choice) {
      this.props.navigate('/restaurant/'+this.state.restoID);
    } else if (choice === "Edit Dish Details"){
      this.handleEdit(true);
    } else if (choice === "Delete Dish Details"){
      this.handleDelete(true);
    } else if (choice === "View Dish Details"){
      this.props.navigate('/dish/'+this.state.dishID)
    } else if(choice === "Select as a Meal") {
      this.setState({loading: true});
      const now = new Date();
      const YYYY = now.getFullYear();
      const MM = now.getMonth() < 10 ? "0"+now.getMonth() : now.getMonth();
      const DD = now.getDate() < 10 ? "0"+now.getDate() : now.getDate();
      const HH = now.getHours() < 10 ? "0"+now.getHours() : now.getHours();
      const MI = now.getMinutes() < 10 ? "0"+now.getMinutes() : now.getMinutes();
      const SS = now.getSeconds() < 10 ? "0"+now.getSeconds() : now.getSeconds();

      const data = {
        dishName: this.state.dishName,
        dishID: this.state.dishID,
        userID: this.props.userInfo.id,
        dateSelected: `${YYYY}-${MM}-${DD} ${HH}:${MI}:${SS}`,
      }

      await axios({
          method: 'post',
          url: process.env.REACT_APP_API_URL+"/addToHistory",
          data,
      }).then((res) => {
          this.setState({loading: false});
          // this.alertOpen('Successfully added ');
          // alert(res.data.message);
          if(res.data.success){
              this.setState({open: false});

              // const location = useLocation();
              // const { pathname } = location;
              // if (pathname == "/history") {
              // if (this.props.history) {
              window.location.reload();
              // }
          } else {
            this.alertOpen("Having trouble adding to today's meal list. Please try again later.");
          }
      })
    } else if(choice === "Remove from History") {
      this.setState({loading: true});
      const data = {
        historyID: this.props.data.historyID,
        userID: parseInt(this.props.userInfo.id)
      }

      await axios({
          method: 'post',
          url: process.env.REACT_APP_API_URL+"/deleteFromHistory",
          data,
      }).then((res) => {
          this.setState({loading: false});
          // alert(res.data.message);
          if(res.data.success){
              this.setState({open: false});
              window.location.reload();
          } else {
            this.alertOpen("Having trouble removing from today's meal list. Please try again later.");
          }
      })
    }
  };

  handleClick(event) {
    this.setState({open: !this.state.open})
  }

  handleEdit(val) {
    this.setState({openDish: val, open: true})
  }

  handleDelete(val) {
    this.setState({openDel: val, open: true})
  }

    render() {
      return <div className='HomePageCard' >
        <Card className="dishCard" onClick={this.handleClick}>
          <Card.Img className="dishImg" variant="top" src={this.state.image} 
          style={{marginBottom: 0, opacity: this.state.open ? 0.3 : 1}} 
          // onClick={() => this.props.navigate('/dish/'+this.state.dishID)}
          />
          {/* <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={this.state.open ? 'long-menu' : undefined}
            aria-expanded={this.state.open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={this.handleClick}
            style={{
              top: "-160px",
              marginLeft: "210px",
              // border: "1px solid rgba(0, 0, 0, 0.1)",
              }}
          >
            <BsThreeDotsVertical 
            style={{
              color: "#FEFDED",
              }}
              />
          </IconButton> */}
          {/* <Menu
            id="basic-menu"
            anchorEl={this.state.anchorEl}
            open={this.state.open}
            onClose={() => this.handleClose("None")}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            {this.state.options.map((option) => (
              <MenuItem key={option} onClick={() => this.handleClose(option)} style={{fontSize: "10px", fontWeight: "bold", backgroundColor: "#FEFDED"}}>
                {"Select as a Meal" == option? <FaRegBookmark /> : 
                option.includes("Edit") ? <BiEditAlt />:
                option.includes("Delete") ? <MdDeleteOutline />:
                "View Restaurant" == option? <GrRestaurant /> :
                <div></div>} 
                {option}
              </MenuItem>
            ))}
          </Menu> */}
            <Card.Body style={{opacity: this.state.open ? 0.3 : 1}}>

                  <table className='hometable' 
                  // onClick={() => this.props.navigate('/dish/'+this.state.dishID)}
                  >
                  <tr>
                      <td 
                      className="vitmin" 
                      style={{
                        fontSize: "19px",
                        fontWeight: "bold",
                        width: "163px",
                        padding: "4px 0",

                      }}> 
                        {this.state.dishName} 
                      </td>
                      <td style={{
                        textAlign: "right",
                        paddingTop: "9px"
                      }}>
                        {this.state.reviewCount == 0 ? <CiStar size={18} color='#6e2323'/> : <FaStar size={15} color='#6e2323'/>}
                      </td>
                      <td style={{
                        textAlign: "right",
                        paddingTop: "5px",
                        width: "0px",
                        whiteSpace: 'nowrap'
                      }}> 
                        {this.state.rate}{this.state.reviewCount == 0 ? "" : ` (${this.state.reviewCount})`}
                      </td>
                    </tr>
                  </table>

                <table className='hometable'>
                  <tr>
                    <td 
                      className="vitmin"
                      // 100px
                      style={{width: "185px", marginRight: "-12px"}} 
                      // onClick={() => this.props.navigate('/restaurant/'+ this.state.restoID)}
                     >
                      {this.state.resName} 
                    </td>
                    {/* <td style={{textAlign: "center", width: "80px" }} onClick={() => this.props.navigate('/dish/'+this.state.dishID)}>
                      <FaWalking style={{
                        position: "relative", 
                        top: "2px",
                      }}/> {this.state.distance} min
                    </td> */}
                    <td style={{
                      width: "54px",
                      textAlign: "right", 
                      color: this.state.status == "Open" ? "#013b3f":"#6e2323",
                      fontWeight: "500"
                      }} 
                      // onClick={() => this.props.navigate('/dish/'+this.state.dishID)}
                      >
                      {this.state.status}
                    </td>
                  </tr>
                </table>

                <div 
                // onClick={() => this.props.navigate('/dish/'+this.state.dishID)}
                >
                <table className='macro' style={{
                  // color: "#013b3f", 
                  fontSize: "14px",
                  marginBottom: "-5px",
                  textAlign: 'left'
                  // width:"70%"
                  }} >
                  <tr>
                    <td> <div style={{marginRight:"5px"}}>*Calories: {this.state.calories}</div></td>
                    <td> <div>*Sodium: {this.state.sodium}mg </div></td>
                  </tr>
                </table>

                

                {
                this.state.vitamins || this.state.minerals ? <table className='hometable' style={{
                  // color: "#013b3f", 
                  fontSize: "14px", 
                  // marginTop: "-39px"
                  }}>
                  <tr>
                    <td> <div style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width:"130px",
                    // border: "1px solid rgba(0, 0, 0, 0.1)",
                  }}>*Contains {this.state.minerals? this.state.minerals + " and": ""} Vitamins {this.state.vitamins} 
                  </div></td>
                    {/* <td className="vitmin" style={{width:"80px"}}> {this.state.minerals} </td> */}
                  </tr>
                </table>:
                <div></div>
                }

                <div style={{
                      fontSize: "40px",
                      marginTop: this.state.vitamins || this.state.minerals ? "-20px": "-5px",
                      marginBottom: "-25px",
                      textAlign: "right",
                      color: "#013B3F"
                      }}> ₱{this.state.price} </div>

                <table className='hometable' style={{
                  fontSize: "14px", 
                  // width: "0px", 
                  width: 150,
                  marginTop: "-30px",
                  textAlign: "left"
                  // marginTop: "5px"
                  }}>
                  <tr>
                      <td style={{
                          paddingLeft: "6px",
                          paddingRight: "6px", 
                          paddingBottom: "3px",
                          color: (this.state.available == 1 ? "#013B3F": "#6e2323"),
                          fontSize: 18,
                          // border: "1px solid black",
                          // width: 1000
                        }}>
                          {this.state.available == 1 ? "Available" : "Not Available"}
                      </td>
                  </tr>
                </table>
                </div>
            </Card.Body>
            {this.state.open ?
              <div className='buttonsTop'>
                <table className='buttonsTable' 
                style={{margin: (330-(this.state.options.length * 40))/2 + "px auto" }}
                // align='center'
                >
                  {
                    this.state.options.map((opt) => {
                      if (opt) {
                        return <tr>
                          <td>
                            <button className='button1' onClick={() => this.handleClose(opt)}>{
                            "Select as a Meal" == opt? <FaRegBookmark size={15}/> : 
                            opt.includes("Edit") ? <BiEditAlt size={15}/>:
                            opt.includes("Delete") ? <MdDeleteOutline size={15}/>:
                            opt.includes("Restaurant") ? <GrRestaurant size={15}/> : 
                            opt.includes("View") ? <GiKnifeFork size={15}/> :
                            opt.includes("Remove") ? <GoBookmarkSlash size={15} /> :
                            null} {opt} </button>
                            {/* <input type="Reset" value={opt} onClick={() => this.handleClose(opt)}/> */}
                          </td>
                        </tr>
                      }
                    })
                  }
                </table>
              </div> : null }
        </ Card>
        <AddDishModal open={this.state.openDish} handleClose={() => this.handleEdit(false)} height={window.innerHeight} action={"Edit"} loadingModal={false} restoID={this.state.restoID} dishData={this.props.data} isMobile={this.props.isMobile}/>
        <DeleteModal open={this.state.openDel} handleClose={() => this.handleDelete(false)} userInfo={this.props.userInfo} ID={this.state.dishID} type={"dish"} name={this.state.dishName} rname={this.state.resName}/>
        <AlertModal open={this.state.openAlert} handleClose={this.alertClose} message={this.state.alertMess} isSuccess={false}/>
      </div>;
    }
}

export default HomePageCard;