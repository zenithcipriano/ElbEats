import React  from 'react';
import HomePageCard from './HomePageCard';
import { useState } from "react";
import { FiPlusCircle } from 'react-icons/fi';
import AddDishModal from './AddDishModal';
import HomePageCardReview from './HomePageCardReview';

function DishCardTable ({dishList, navigate, privilege, loadingModalDish, height, restoID, reviewFlag}) {
    const [openDish, setOpenDish] = useState(false);
    const handleOpenDish = () => setOpenDish(true);
    const handleCloseDish = () => setOpenDish(false);

    const userInfo = {
        id: localStorage.getItem("user_reference"),
        type: localStorage.getItem("user_type")
    }

    return dishList.map((row, rindex) => {
        return <tr> 
        <td>{
                row.map((dish, dindex) => {
                    return  <td>
                    {privilege ? 
                        (rindex == 0 && dindex == 0 ? <div className="dishCard" style={{height: 125, padding: "110px 15px"}} onClick={handleOpenDish}> <FiPlusCircle size={100} /> </div>
                            :   <HomePageCard data={dish} navigate={navigate} userInfo={userInfo}/> )
                        : reviewFlag ? <HomePageCardReview data={dish} navigate={navigate} userInfo={userInfo} />
                        :<HomePageCard data={dish} navigate={navigate} userInfo={userInfo} />
                    }
                    </td>
                })    
            }</td>
            <AddDishModal open={openDish} handleClose={handleCloseDish} height={height} action={"Add"} loadingModal={loadingModalDish} restoID={restoID} dishData={{}}/>
        </tr>
        })
}
export default DishCardTable;