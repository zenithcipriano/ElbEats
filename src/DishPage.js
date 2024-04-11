import './DishPage.css';
import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { MdLocationPin } from "react-icons/md";
import "@fontsource/rubik";
import { FaRegStar, FaStarHalfAlt, FaStar } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FiPlusCircle } from "react-icons/fi";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function DishPage({isMobile, navigate}) {
    // Regular Comp
    const dname = "Filipino Chicken Adobo"
    const rname = "RecipeTin Eats"
    const coordinates = 0
    const address = "F.O. Santos St., Los Baños, Philippines"
    const walkinPrice = 80
    const delPrice = 120
    const numRev = 30

    // Rate Comp
    const rating = 2
    const rateFun = (rate, iconSize) => {
        const numFilled = Math.floor(rate, 1)
        const filled = Array(numFilled).fill(<FaStar size={iconSize}/>)
        const halfed = Array(rate-numFilled == 0 ? 0 : 1).fill(<FaStarHalfAlt size={iconSize}/>)
        const tempstars = filled.concat(halfed)
        const outlined = Array(5-tempstars.length).fill(<FaRegStar size={iconSize}/>)
        return tempstars.concat(outlined)
    }
    const stars = rateFun(rating, 25)

    
    // Array Comp
    const paymentTags = ["Gcash", "Credit/Debit Cards"]
    const Categories = ["Grains", "Nuts, Dried Beans, & Seeds", "Meat & Animals"]
    const catPercent = [50, 10, 40]
    const Reviews = [
        {
            username: "sample name1",
            rate: 4,
            review: "Hi! ",
            // HiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHi
            datePosted: new Date()
        },
        {
            username: "sample name",
            rate: 4,
            review: "Hi! ",
            // HiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHiHi
            datePosted: new Date()
        }
    ]
    const ReviewsRet = () => {
        return Reviews.map((rev) => {
                    return <table id='revTable'> <tr>
                        <td style={{width: "30px"}}>
                            <div style={{left: "4px", position: "relative"}}>< CgProfile size={25}/></div>
                        </td>
                        <td className='rp1'>
                            <table style={{position: "relative", marginTop: "-6px", width: "100%"}}><tr>
                                <td> <div style={{ marginLeft: "-2px", textAlign: "left"}}>{rev.username}</div></td>
                                <td style={{textAlign: "right", paddingRight: "5px", fontSize: "15px"}}> {months[rev.datePosted.getMonth()]} {rev.datePosted.getDate()} {rev.datePosted.getFullYear()} {rev.datePosted.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</td>
                                </tr></table>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td className='rp2'>
                            <div style={{marginTop: "-13px", marginLeft: "-2px"}}><table style={{position: "relative"}}><tr>
                                <td>{rateFun(rev.rate, 15)}</td>
                                <td><p style={{margin: "0px", marginTop: "-2px"}}>{rev.rate}</p></td></tr></table></div>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td className='rp3'><p style={{margin: "0px", marginTop: "-5px", marginBottom: "5px", textAlign: "left"}}>{rev.review}</p></td>
                    </tr>
                    {/* <tr>
                        <td></td>
                        <td className='rp4'>
                        </td>
                    </tr> */}
                    </table>
                })
    }

    // Ingredients Components
    const ing = ["soy sauce", "white vinegar", "onion", "garlic", "peppercorns", "sugar", "bay leaves", "green onion"]
    const ingGrams = [100, 200, 300, 400, 500, 600, 700, 800]
    const ingType = ["Condiments & Spices", "Condiments & Spices", "Vegetables", "Vegetables",  "Not Accounted", "Sweets", "Not Accounted", "Vegetables"]
    const ingRet = () => {
        return <table className='ingTable'>
            <tr>
                <th style={{width: "20%"}}>Amount (g)</th>
                <th style={{width: "40%"}}>Ingredient</th>
                <th style={{width: "40%"}}>Food Type</th>
            </tr>
            {
                ing.map((ing1, index) => {
                    return (
                        <tr>
                            <td>{ingGrams[index]}g</td>
                            <td>{ing1}</td>
                            <td>{ingType[index]}</td>
                        </tr>
                    )
                })
            }
        </table>
    }

    const nut = {
        ingCalories: 357,
        ingCalcium: 0.1,
        ingPhosphorus: 0.2,
        ingIron: 0.3,
        ingSodium: 0.4,
        ingA: 0.5,
        ingBC: 0.6,
        ingRAE: 0.7,
        ingB1: 0.8,
        ingB2: 0.9,
        ingNiacin: 1.0,
        ingC: 1.1,
        ingK: 1.2,
        ingZn: 1.3,
        ingNT: 1.4
    }

    const nutRet = () => {
        return <table className='nutTable'>
            <tr>
                <th>Energy, calculated (kcal)</th>
                <th>{nut.ingCalories} kcal</th>
            </tr>
            <tr><th colspan="2">Minerals</th></tr>
            <tr>
                <td>Sodium, Na</td>
                <td>{Number.isInteger(nut.ingSodium) ? nut.ingSodium+".0" : nut.ingSodium} mg</td>
            </tr>
            <tr>
                <td>Calcium, Ca</td>
                <td>{Number.isInteger(nut.ingCalcium) ? nut.ingCalcium+".0" : nut.ingCalcium} mg</td>
            </tr>
            <tr>
                <td>Phosphorus, P</td>
                <td>{Number.isInteger(nut.ingPhosphorus) ? nut.ingPhosphorus+".0" : nut.ingPhosphorus} mg</td>
            </tr>
            <tr>
                <td>Iron, Fe</td>
                <td>{Number.isInteger(nut.ingIron) ? nut.ingIron+".0" : nut.ingIron} mg</td>
            </tr>
            <tr>
                <td>Potassium, K</td>
                <td>{Number.isInteger(nut.ingK) ? nut.ingK+".0" : nut.ingK} mg</td>
            </tr>
            <tr>
                <td>Zinc, Zn</td>
                <td>{Number.isInteger(nut.ingZn) ? nut.ingZn+".0" : nut.ingZn} mg</td>
            </tr>
            <tr><th colspan="2">Water-Soluble Vitamins</th></tr>
            <tr>
                <td>Retinol, Vitamin A</td>
                <td>{Number.isInteger(nut.ingA) ? nut.ingA+".0" : nut.ingA} µg</td>
            </tr>
            <tr>
                <td>beta-Carotene</td>
                <td>{Number.isInteger(nut.ingBC) ? nut.ingBC+".0" : nut.ingBC} µg</td>
            </tr>
            <tr>
                <td>Retinol Activity Equivalent, RAE</td>
                <td>{Number.isInteger(nut.ingRAE) ? nut.ingRAE+".0" : nut.ingRAE} µg</td>
            </tr>
            <tr>
                <th>Water-Soluble Vitamins</th>
            </tr>
            <tr>
                <td>Thiamin, Vitamin B1</td>
                <td>{Number.isInteger(nut.ingB1) ? nut.ingB1+".0" : nut.ingB1} mg</td>
            </tr>
            <tr>
                <td>Riboflavin, Vitamin B2</td>
                <td>{Number.isInteger(nut.ingB2) ? nut.ingB2+".0" : nut.ingB2} mg</td>
            </tr>
            <tr>
                <td>Niacin</td>
                <td>{Number.isInteger(nut.ingNiacin) ? nut.ingNiacin+".0" : nut.ingNiacin} mg</td>
            </tr>
            <tr>
                <td>Niacin from Trytophan</td>
                <td>{Number.isInteger(nut.ingNT) ? nut.ingNT+".0" : nut.ingNT} mg</td>
            </tr>
            <tr>
                <td>Ascorbic Acid, Vitamin C</td>
                <td>{Number.isInteger(nut.ingC) ? nut.ingC+".0" : nut.ingC} mg</td>
            </tr>
        </table>
    }

    const [NutIngRevTag, setNutIngRevTag] = useState(0);
    const [walkdel, setWalkDel] = useState(true);

    const imgList = [
        "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505",
        "https://www.escoffier.edu/wp-content/uploads/2019/03/Plating-has-a-major-impact-on-how-your-customers-enjoy-their-food_1028_40183381_0_14144266_1000.jpg",
        "https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg",
        "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505",
        "https://www.escoffier.edu/wp-content/uploads/2019/03/Plating-has-a-major-impact-on-how-your-customers-enjoy-their-food_1028_40183381_0_14144266_1000.jpg",
        "https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg",
        "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505",
        "https://www.escoffier.edu/wp-content/uploads/2019/03/Plating-has-a-major-impact-on-how-your-customers-enjoy-their-food_1028_40183381_0_14144266_1000.jpg",
        "https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg",
        "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505",
        "https://www.escoffier.edu/wp-content/uploads/2019/03/Plating-has-a-major-impact-on-how-your-customers-enjoy-their-food_1028_40183381_0_14144266_1000.jpg",
        "https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg",
    ]

    const [width, setWidth] = useState(window.innerWidth)
    const [height, setHeight] = useState(window.innerHeight)

    window.onresize = function(event) {
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
    }
    const style1 = {
        height: height-(isMobile? 160 : 93), 
        textAlign: isMobile ? 'center' : 'left',
    }
    const style2 = {
        marginLeft: width/2+40,
    }

    const style3 = {
        marginLeft: "auto",
        marginRight: "auto"
    }

    const style4 = {
        borderBottom: "1px solid rgba(0, 0, 0, 0)",
        opacity: 1
    }

    const cedReview = [
        "Add", "Edit", "Delete" 
    ]
    const cedReviewIndex = 0;

    return (
        <div className='DishPage' style={style1}>
            <div style={{width: isMobile ? width-15 : width/2}} className={isMobile ? "" : "Carousel"}>
                <Carousel useKeyboardArrows={true} showArrows={true} swipeable={true}
                    statusFormatter={(current, total) => {
                        return (
                            <p className='status' 
                            style={{fontSize: 13, 
                                // textShadow: "0 0 1px grey"
                            }}>{current} of {total}</p>
                        )
                    }}
                    renderArrowPrev={(clickHandler, hasPrev) => {
                        return (
                            <div className='ArrowBack' onClick={clickHandler} style={{opacity: hasPrev ? 1 : 0}}>
                                <IoIosArrowBack size={50}/>
                            </div>
                        );
                    }}
                    
                    renderArrowNext={(clickHandler, hasNext) => {
                        return (
                            <div onClick={clickHandler} className='ArrowNext' style={{opacity: hasNext ? 1 : 0}}>
                                <IoIosArrowForward size={50}/>
                            </div>
                        );
                    }}
                >
                    {imgList.map((URL, index) => (
                        <div>
                            <img className="slideImg" alt="sample_file" src={URL} key={index} />
                        </div>
                    ))}
                </Carousel>
            </div>
            <div className="dishBody" style={isMobile ? {} : style2}>
                <table className='resto'>
                    <tr>
                        <td>
                        <button onClick={() => navigate('/restaurant')}
                        className='address' style={{fontFamily: "Rubik"}}><u>{rname}</u></button> 
                        </td>
                        <td style={{width:"70%"}}>
                            <button className='address' style={{fontFamily: "Rubik"}}><MdLocationPin /> <u>{address}</u></button>
                        </td>
                    </tr>
                </table>
                <p id='dname'>{dname}</p>
                <table id='rateTable' style={isMobile ? style3 : {left: "-6px"}}>
                    <tr>
                        <td>
                            <p id='stars'>{
                                stars.map((star) => star)
                            }</p>
                        </td>
                        <td>
                            <p>{Number.isInteger(rating) ? rating+".0" : rating} ({numRev}) </p>
                        </td>
                    </tr>
                </table>

                <table className='priceTable' style={isMobile ? style3 : {left: "-3px"}}>
                    <tr>
                        <td id="p0">
                            <p id='price'>{walkdel ? "Walk-in" : "Online App"} Price: </p> 
                        </td>
                        <td id="p1">
                            <p>P {walkdel ? walkinPrice : delPrice}</p>
                        </td>
                        <td id="p2">
                            <button onClick={() => setWalkDel(!walkdel)}> Check Prices </button>
                        </td>
                    </tr>
                </table>
                <p className='tags1'>Accepting Payments via: {
                    paymentTags.map((pay) => {
                        return (
                            <button className='paymentTags'> {pay} </button>
                        )
                    })
                }</p> 
                <p className='tags'>Breakdown: </p>
                <table className="catTable" style={isMobile ? style3 : {left: "-3px"}}>{
                    Categories.map((cat, index) => {
                        return (
                                <tr>
                                    <td style={{width: 40}}> {catPercent[index]}% </td>
                                    <td> {cat} </td>
                                </tr>
                        )
                    })
                }</table>
                <button className="switch1" style={NutIngRevTag == 0 ? style4 : {}} onClick={() => setNutIngRevTag(0)}>Nutrition Table</button> 
                <button className="switch1" style={NutIngRevTag == 1 ? style4 : {}} onClick={() => setNutIngRevTag(1)}>Reviews</button> 
                <button className="switch1" style={NutIngRevTag == 2 ? style4 : {}} onClick={() => setNutIngRevTag(2)}>Ingredients</button>
                {NutIngRevTag == 1 ? <button className="switch1" style={{opacity: 1}}>{cedReview[cedReviewIndex]} Review <FiPlusCircle/></button>:<div></div>}
                <div className='switchable-textarea'>
                    {
                        NutIngRevTag == 0 ? nutRet() :
                        NutIngRevTag == 1 ? ReviewsRet() :
                        NutIngRevTag == 2 ? ingRet() :
                        ""
                    }
                </div>
            </div>
        </div>
    );
}
    
export default DishPage;