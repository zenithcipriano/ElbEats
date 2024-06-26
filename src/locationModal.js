import React, { useEffect }  from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import ProgressBar1 from './progress';

function GMaps({open, handleClose, height, width, coordinates, address, permissionGiven, restoName, setAddress, setCoordinates}) {
    const style = {
        position: 'absolute',
        fontFamily: "Rubik",
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: 700,
        width: width-40,
        // width: width/2,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        // width: window.innerWidth,
        // height: 3*height/4,
        // overflowY: "scroll",
        padding: 2
    };

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        libraries: ["places"]
    });

    const [address1, setAddress1] = useState(address);
    const [center, setCenter] = useState(coordinates);
    const [map, setMap] = useState(null)
    const [marker, setMarker] = useState(0);

    const setMarkerOfficial = (pos) => {
        if (marker) {
          marker.setPosition(pos);
        } else {
          const newMarker = new window.google.maps.Marker({
            map: map,
            position: pos,
          });
          setMarker(newMarker);
        }
    }

    const onSubmit = () => {
        setAddress(address1);
        setCoordinates({lng: (typeof center.lng) == "function" ? center.lng() : center.lng, 
                        lat: (typeof center.lat) == "function" ? center.lat() : center.lat});
        handleClose();
    }
    
    const onMapClick = (e) => {
        if (permissionGiven) {
            // centerSet(true);
            setMarkerOfficial(e.latLng);
            setCenter(e.latLng);
            map.panTo(e.latLng);
            map.setZoom(19);
            // Reverse geocode the clicked location to update the search bar text
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: e.latLng }, (results, status) => {
                if (status === window.google.maps.GeocoderStatus.OK && results.length > 0) {
                    setAddress1(results[0].formatted_address);
                    // setSearchBarValue(results[0].formatted_address);
                }
            });
        }
    };

    return <Modal 
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
            <Box sx={style}>
                <div>
                    <table style={{width: "100%", position: "relative", marginBottom: -5, marginTop: -10}}> 
                        <tr> 
                            <td style={{padding: 10}}>
                                <div style={{
                                // whiteSpace: "nowrap",
                                // overflow: "hidden", 
                                width: "100%",
                                // width: (width/2) - 23 - (permissionGiven ? 75 : 0) - 40,
                                textOverflow: "ellipsis"
                                }}>{address1 ? address1 : "Please pin your location on the map."}</div></td>
                            {permissionGiven ? <td style={{width: 50}} onClick={onSubmit}><div style={{border: "1px solid black", padding: "5px 10px"}}>Submit</div></td> : null }
                            <td onClick={handleClose} style={{padding: 10, width: 10, paddingRight: 0}}><IoIosCloseCircleOutline size={30} /></td>
                        </tr>
                    </table>
                </div>
                {!isLoaded ? 
                    <ProgressBar1 />
                    : 
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: (3*height/4)-100, position: 'relative'}}
                        center={ center }
                        zoom={18}
                        options={{
                            zoomControl: true,
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: false,
                        }}
                        onClick={onMapClick}
                        onLoad={map => {
                            setMap(map)

                            // Check if value is not empty
                            const initialMarker = new window.google.maps.Marker({
                                map,
                                // label: restoName,
                                position: center,
                            });
                            setMarker(initialMarker);

                        }}/>
                }
                <div style={{padding: "10px 0px", textAlign: "center", fontSize: 15, marginBottom: -15}}>
                {
                    permissionGiven ? "(Click to pin. Hold click to move.)" : "(Hold click to move map.)"
                }
                </div>
                </Box>
        </Modal>
}

export default GMaps;