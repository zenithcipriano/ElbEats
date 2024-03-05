import React  from 'react';
import "./HomePageCard.css";
import { Card } from 'react-bootstrap';
import { CiStar } from "react-icons/ci";
import { FaWalking } from "react-icons/fa";

class HomePageCard extends React.Component {
  constructor(props) {
    super(props);
    const tb = props.data.tabs;

    this.state = {
        dishName: props.data.dishName,
        rate: props.data.rate,
        resName: props.data.resName,
        distance: props.data.distance,
        status: props.data.status,
        vitamins: props.data.vitamins,
        minerals: props.data.minerals,
        tabs: tb.replace(" ", "").split(","),
        price: props.data.price
    };

    // this.updateState = this.updateState.bind(this);
  }

    render() {
      return <div className='HomePageCard' >
        <Card className="dishCard" >
          <Card.Img className="dishImg" variant="top" src={ require("./assets/sample.jpg")} />
            <Card.Body>

                  <table className='hometable'>
                  <tr>
                      <td 
                      className="vitmin" 
                      style={{
                        fontSize: "19px",
                        fontWeight: "bold",
                        width: "163px",
                        padding: "4px 0",
                        marginBottom: "-7px",
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
                      style={{width: "100px", marginRight: "-12px"}}
                     >
                      {this.state.resName} 
                    </td>
                    <td style={{textAlign: "center", width: "80px" }}>
                      <FaWalking style={{
                        position: "relative", 
                        top: "2px",
                      }}/> {this.state.distance} min
                    </td>
                    <td style={{
                      width: "54px",
                      textAlign: "right", 
                      color: this.state.status === "Open" ? "#013b3f":"#540000"}}>
                      {this.state.status}
                    </td>
                  </tr>
                </table>
                
                <table className='hometable' style={{
                  // color: "#013b3f", 
                  fontSize: "14px",
                  marginBottom: "-7px",
                  // width:"70%"
                  }}>
                  <tr>
                    <td style={{width:"60px"}}>Vitamins: </td>
                    <td className="vitmin" style={{ width:"80px" }}> {this.state.vitamins} </td>
                  </tr>
                </table>

                

                <table className='hometable' style={{
                  // color: "#013b3f", 
                  fontSize: "14px", 
                  // marginTop: "-39px"
                  }}>
                  <tr>
                    <td style={{width:"60px"}}>Minerals: </td>
                    <td className="vitmin" style={{width:"80px"}}> {this.state.minerals} </td>
                  </tr>
                </table>

                <div style={{
                      fontSize:"40px",
                      marginTop: "-35px",
                      textAlign: "right",
                      color: "#3a0101"
                      }}> ₱{this.state.price} </div>

                <table className='hometable' style={{
                  fontSize: "14px", 
                  width: "0px", 
                  marginTop: "-18px"
                  // marginTop: "5px"
                  }}>
                  <tr>
                    {
                      this.state.tabs.map((tab1) => {
                        return <td style={{
                          // padding: "3px", 
                          paddingLeft: "6px",
                          paddingRight: "6px", 
                          paddingBottom: "3px", 
                          boxShadow: "rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px",
                          border: "1px solid rgba(0, 0, 0, 0.1)",
                          borderRadius: "10px",
                          // borderCollapse: "separate",
                          // borderSpacing: "100px, 50px"
                        }}> {tab1} </td>
                      })
                    }
                  </tr>
                </table>

                {/* <div style={{
                  // marginTop:"100px", 
                // display: "block"
                }}>
                  {this.state.price}
                </div> */}
            </Card.Body>
        </ Card>
      </div>;
    }
}

export default HomePageCard;