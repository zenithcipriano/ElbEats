import React  from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { IoIosCloseCircleOutline } from "react-icons/io";
import "@fontsource/rubik";

function MicroModal ({open, handleClose, mlist, values, stanvalues}) {
    const style = {
        position: 'absolute',
        fontFamily: "Rubik",
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        // height: 3*height/4,
        // overflowY: "scroll",
        padding: 2
    };

    return <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
        <Box sx={style}>
            <table className='modalTable' style={{marginBottom: -10}}>
                <tr>
                    <td>
                        <h2>Micronutrient Details</h2>
                    </td>
                    <td style={{textAlign: "right"}}> <IoIosCloseCircleOutline size={40} onClick={handleClose}/> </td>
                </tr>
            </table>
            <table style={{position: 'relative', width: "100%", fontFamily: "Rubik", fontSize: 18, textAlign: 'left'}}>
                <tr>
                    <th style={{padding: 10, border: "1px solid rgba(0,0,0,0.15)"}}>Name</th>
                    <th style={{padding: 10, border: "1px solid rgba(0,0,0,0.15)"}}>Progress</th>
                    {/* <th style={{padding: 10, border: "1px solid rgba(0,0,0,0.15)"}}>Actual Value</th> */}
                </tr>
                {mlist.map((label, index) => {
                    return <tr>
                        <td style={{padding: 10, border: "1px solid rgba(0,0,0,0.15)"}}>{label}  ({parseFloat(values[index]).toFixed(2)} mg / {stanvalues[index]} mg)</td>
                        <td style={{padding: 10, border: "1px solid rgba(0,0,0,0.15)", width: 10, whiteSpace: "nowrap" }}>{Math.floor(values[index]/stanvalues[index]*100)}%</td>
                        {/* <td style={{padding: 10, border: "1px solid rgba(0,0,0,0.15)", width: 10, whiteSpace: "nowrap" }}>{parseFloat(values[index]).toFixed(2)} mg / {stanvalues[index]} mg</td> */}
                    </tr>
                })}
            </table>
            {/* <form onSubmit={handleSubmit} style={{fontFamily: "Rubik", marginBottom: -15}}>
                <table className="inputTables">
                    <tr>
                        <td colSpan={4} style={{fontSize: 25, textAlign: "center"}}>Are you sure?</td>
                    </tr>
                    <tr>
                        <td colSpan={4} style={{fontSize: 15, textAlign: "center", paddingBottom: 15}}>
                            {
                               type == "restaurant" ?
                               <p>Deleting this restaurant will also <b>delete all its listed dishes and reviews</b>.</p>
                               : type == "dish" ? <p>Deleting this dish will also <b>delete all its reviews</b>.</p>
                               : <p>You are deleting your review on <b> {name}</b> of <b>{rname}</b>.</p>
                            }
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{textAlign: "center", paddingBottom: 10}}> <input type="reset" value="Cancel" onClick={handleClose}  disabled={ret}/></td>
                        <td colSpan={2} style={{textAlign: "center", paddingBottom: 10}}> <input type="submit" value="Continue" disabled={ret}/></td>
                    </tr>
                </table>
            </form> */}
        </Box>
    </Modal>
}
export default MicroModal;