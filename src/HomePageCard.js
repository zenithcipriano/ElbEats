import React  from 'react';
import "./HomePageCard.css";
import { Card } from 'react-bootstrap';
import { CiStar } from "react-icons/ci";
import { FaWalking, FaRegBookmark } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiEditAlt } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GrRestaurant } from "react-icons/gr";

class HomePageCard extends React.Component {
  constructor(props) {
    super(props);
    // const tb = props.data.protein;

    const d = new Date();
    const curday = d.getDay().toString();
    const curHour = d.getHours();
    const curMinute = d.getMinutes();

    const isOpenDay = props.data.daysOfTheWeek.includes(curday);

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
        navigate: props.navigate,
        dishName: props.data.dishname,
        rate: props.data.reviewCount == 0 ? "unrated": props.data.ratings,
        resName: props.data.restoname,
        distance: 0,
        status:  isOpenDay && isOpenTime0 && isOpenTime1 ? "Open": "Closed",
        status: "Closed",
        vitamins: props.data.vitamins,
        calories: parseInt(props.data.ingCaloriesFinal),
        sodium: parseInt(props.data.ingSodiumFinal),
        minerals: props.data.minerals,
        available: props.data.available,
        // tabs: tb ? tb.replace(" ", "").split(",").slice(0,2) : [],
        price: props.data.walkinprice,
        image: props.data.images,
        anchorEl: null,
        open: false,
        dishID: props.data.dishID,
        restoID: props.data.restoID
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  options = [
    "Save",
    "Edit",
    "Delete",
    "View Restaurant"
  ]

  handleClick(event) {
    this.setState({anchorEl: event.currentTarget, open: true});
  };

  handleClose(choice) {
    this.setState({anchorEl: null, open: false});
    if("View Restaurant" == choice) {
      this.state.navigate('/restaurant/'+this.state.restoID);
    }
    // alert(choice);
  };

    render() {
      return <div className='HomePageCard' >
        <Card className="dishCard" >
          <Card.Img className="dishImg" variant="top" src={this.state.image} 
          style={{marginBottom: "-42px"}} onClick={() => this.state.navigate('/dish/'+this.state.dishID)}/>
          <IconButton
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
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={this.state.anchorEl}
            open={this.state.open}
            onClose={() => this.handleClose("None")}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            {this.options.map((option) => (
              <MenuItem key={option} onClick={() => this.handleClose(option)} style={{fontSize: "10px", fontWeight: "bold", backgroundColor: "#FEFDED"}}>
                {"Save" == option? <FaRegBookmark /> : 
                "Edit" == option? <BiEditAlt />:
                "Delete" == option? <MdDeleteOutline />:
                "View Restaurant" == option? <GrRestaurant /> :
                <div></div>} 
                {option}
              </MenuItem>
            ))}
          </Menu>
            <Card.Body>

                  <table className='hometable' onClick={() => this.state.navigate('/dish/'+this.state.dishID)}>
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
                        <CiStar size={18}/> 
                      </td>
                      <td style={{
                        textAlign: "right",
                        paddingTop: "5px",
                        width: "0px",
                      }}> 
                        {this.state.rate}
                      </td>
                    </tr>
                  </table>

                <table className='hometable'>
                  <tr>
                    <td 
                      className="vitmin"
                      // 100px
                      style={{width: "185px", marginRight: "-12px"}} onClick={() => this.state.navigate('/restaurant/'+ this.state.restoID)}
                     >
                      {this.state.resName} 
                    </td>
                    {/* <td style={{textAlign: "center", width: "80px" }} onClick={() => this.state.navigate('/dish/'+this.state.dishID)}>
                      <FaWalking style={{
                        position: "relative", 
                        top: "2px",
                      }}/> {this.state.distance} min
                    </td> */}
                    <td style={{
                      width: "54px",
                      textAlign: "right", 
                      color: this.state.status == "Open" ? "#013b3f":"#AD0C26",
                      fontWeight: "500"
                      }} onClick={() => this.state.navigate('/dish/'+this.state.dishID)}>
                      {this.state.status}
                    </td>
                  </tr>
                </table>

                <div onClick={() => this.state.navigate('/dish/'+this.state.dishID)}>
                <table className='macro' style={{
                  // color: "#013b3f", 
                  fontSize: "14px",
                  marginBottom: "-5px",
                  // width:"70%"
                  }} >
                  <tr>
                    <td> <div style={{marginRight:"5px"}}>*Calories: {this.state.calories} kcal</div></td>
                    <td> <div>*Sodium: {this.state.sodium} mg </div></td>
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
                  width: "0px", 
                  marginTop: "-30px"
                  // marginTop: "5px"
                  }}>
                  <tr>
                      <td style={{
                          paddingLeft: "6px",
                          paddingRight: "6px", 
                          paddingBottom: "3px",
                          color: (this.state.available == 1 ? "#013B3F": "#6e2323"),
                          fontSize: 18
                        }}>
                          {this.state.available == 1 ? "Available" : "Not Available"}
                      </td>
                  </tr>
                </table>
                </div>
            </Card.Body>
        </ Card>
      </div>;
    }
}

export default HomePageCard;