import React  from 'react';
import "./HomePageCard.css";
import { Card } from 'react-bootstrap';
import { CiStar } from "react-icons/ci";
import { FaWalking, FaRegBookmark, FaStar, FaRegStar } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiEditAlt } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GrRestaurant } from "react-icons/gr";
import { RiDeleteBin6Line } from 'react-icons/ri';
import AddReview from './addReview';
import DeleteModal from './DeleteModal';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const outlined0 = <FaRegStar size={15} color='#6e2323'/>;
const filled0 = <FaStar size={15} color='#6e2323'/>;

class HomePageCardReview extends React.Component {
  constructor(props) {
    super(props);

    const numStar = props.data.review.rate;
    let star = Array(5).fill(outlined0);

    const filled = Array(numStar).fill(filled0);
    const outlined = Array(5-(numStar)).fill(outlined0);
    star = [...filled, ...outlined];
    console.log(props.data.images)
    this.state = {
        navigate: props.navigate,
        dishName: props.data.dishname,
        resName: props.data.restoname,
        image: props.data.images,
        reviewData: props.data.review,
        star: star,
        numStar: numStar, 
        anchorEl: null,
        open: false,
        dishID: props.data.dishID,
        restoID: props.data.restoID,
        reviewClicked: false,
        openReview: false,
        openDel: false,
        userInfo: {
            id: localStorage.getItem("user_reference"),
            type: localStorage.getItem("user_type")
        }
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.reviewClickedF = this.reviewClickedF.bind(this);
  }

  options = [
    "Add to History",
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

  reviewClickedF(val) {
    this.setState({reviewClicked: !val});
  }

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
                {"Add to History" == option? <FaRegBookmark /> : 
                "Edit" == option? <BiEditAlt />:
                "Delete" == option? <MdDeleteOutline />:
                "View Restaurant" == option? <GrRestaurant /> :
                <div></div>} 
                {option}
              </MenuItem>
            ))}
          </Menu>
            <Card.Body>

                  <table className='hometable'>
                  <tr>
                      <td 
                      style={{
                        fontSize: "19px",
                        fontWeight: "bold",
                        padding: "4px 0",
                      }} onClick={() => this.state.navigate('/dish/'+this.state.dishID)}>
                        <div style={{whiteSpace: "nowrap", overflow: "hidden", width: "120px", textOverflow: "ellipsis"}}> 
                        {this.state.dishName}
                        </div>
                      </td>
                      <td style={{width: "50%"}} onClick={() => this.state.navigate('/restaurant/'+ this.state.restoID)}>
                        <div style={{whiteSpace: "nowrap", overflow: "hidden", width: "120px", textOverflow: "ellipsis"}}> 
                        of {this.state.resName}
                        </div>
                      </td>
                    </tr>
                  </table>
            </Card.Body>
        </ Card>
        <div style={{
          border: "1px solid rgba(0, 0, 0, 0.3)", 
          marginTop: -20, 
          borderTop: "1px solid rgba(0, 0, 0, 0)",
          borderBottomRightRadius: 25,
          borderBottomLeftRadius: 25,
          }}>
          <table style={{position: 'relative', padding: 20, paddingTop: 28, paddingBottom: 10, width: "100%",
          borderBottomRightRadius: 25,
          borderBottomLeftRadius: 25,}}>
            <tr onClick={() => {this.reviewClickedF(this.state.reviewClicked)}}>
              <td style={{textAlign: "left"}}>{this.state.star} {this.state.numStar}</td>
              <td style={{textAlign: "right", fontSize: "13px"}}> {months[parseInt(this.state.reviewData.datePosted.substring(5, 7))]} {this.state.reviewData.datePosted.substring(8, 10)} {this.state.reviewData.datePosted.substring(0, 4)} {
                parseInt(this.state.reviewData.datePosted.substring(11, 13))-4 < 10 ? "0"+(parseInt(this.state.reviewData.datePosted.substring(11, 13))-4) : (parseInt(this.state.reviewData.datePosted.substring(11, 13))-4)}
                {this.state.reviewData.datePosted.substring(13, 19)}</td>
            </tr>
            <tr onClick={() => {this.reviewClickedF(this.state.reviewClicked)}}>
              <td style={{textAlign: "left"}} colSpan={2}>
                {this.state.reviewData.review}
              </td>
            </tr>
            {this.state.reviewClicked ? <tr>
              <td colSpan={2}>
                <table style={{position: "relative", width: "100%"}}>
                  <tr>
                    <td style={{border: "1px solid rgba(0, 0, 0, 0.3)", width: "50%"}} onClick={() => this.setState({openReview: true})}>Edit <BiEditAlt /></td>
                    <td style={{border: "1px solid rgba(0, 0, 0, 0.3)"}} onClick={() => this.setState({openDel: true})}>Delete <RiDeleteBin6Line /></td>
                  </tr>
                </table>
              </td>
              {/* <td style={{border: "1px solid rgba(0, 0, 0, 0.3)", width: "50%"}}>Edit</td>
              <td style={{border: "1px solid rgba(0, 0, 0, 0.3)"}}>Edit</td> */}
            </tr> : null}
          </table>
        </div>
        <AddReview open={this.state.openReview} handleClose={() => this.setState({openReview: false})} height={window.innerHeight} dishID={this.state.dishID} action={"Edit"} curRev={this.state.reviewData}/>
        <DeleteModal open={this.state.openDel} handleClose={() => this.setState({openDel: false})} userInfo={this.state.userInfo} ID={this.state.reviewData.reviewID} type={"review"} name={this.state.dishName} rname={this.state.resName}/>
      </div>;
    }
}

export default HomePageCardReview;