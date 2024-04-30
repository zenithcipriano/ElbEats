import { conn } from './connpool.js';
import { retrieveDishesOwnedbyResto0 } from './ownerProfile.js';
// import { runMiddleware, myUploadMiddleware } from './uploadImage.js';

const createResto = async (req, res) => {
    try {
        const restoname = req.body.restoname;
        const userID = req.body.userID;
        req.body.location, req.body.openingTime, req.body.closingTime, userID, req.body.restoDesc, req.body.images, req.body.paymentOptions, req.body.days

        const userRes = await conn.query(`SELECT COUNT(userID) FROM user WHERE userID="${userID}" AND userType=1`);
        
        if (userRes[0]['COUNT(userID)'] == 0) {
            res.send({
                success: false,
                message: "This user can't create restaurants."
            });

        } else {
            const res0 = await conn.query(`SELECT COUNT(restoID) FROM restaurant WHERE restoname="${restoname}"`);
            if(res0[0]['COUNT(restoID)'] > 0) {
                res.send({
                    success: false,
                    message: `A restaurant with the name '${restoname}' already exists in our system.`,
                });
            } else {
                const res1 = await conn.query("INSERT INTO restaurant (restoname, restoLocation, openingTime, closingTime, userID, restoDesc, cpNum, email, facebook, instagram, twitter, daysOfTheWeek) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [restoname, req.body.location, req.body.openingTime, req.body.closingTime, userID, req.body.restoDesc, req.body.cpNum, req.body.email, req.body.facebook, req.body.instagram, req.body.twitter, req.body.days]);

                const res2 = await conn.query(`SELECT restoID FROM restaurant WHERE restoname="${restoname}"`);
                const id = res2[0].restoID;

                const images = req.body.images;
                for (let i=0; i<images.length; i++) {
                    const imagesRes = await conn.query("INSERT INTO restoImages (restoID, imageText) VALUES (?, ?)", [id, images[i]]);
                }

                const payment = req.body.paymentOptions;
                for (let i=0; i<payment.length; i++) {
                    const paymentRes = await conn.query("INSERT INTO paymentoptions (restoID, paymentOptionText) VALUES (?, ?)", [id, payment[i]]);
                }

                res.send({
                    success: true,
                    message: `Successfully listed restaurant '${restoname}'`,
                });
            }
        }
    } catch (err) {
        console.log(err.toString());

        res.send({
            success: false,
            message: "Check console to view error.",
        });
    }
}

const retrieveRestoById = async (req, res) => {
    try {
        const id = req.body.restoID;
        const res2 = await conn.query(`SELECT * FROM restaurant WHERE restoID=${id}`);
        
        if(res2.length > 0) {
            const res3 = await conn.query(`SELECT imageText FROM restoImages WHERE restoID=${id}`);
            const res4 = await conn.query(`SELECT paymentOptionText FROM paymentoptions WHERE restoID=${id}`);
            const priceRes = await conn.query(`SELECT MAX(walkinprice), MIN(walkinprice), MAX(onlineprice), MIN(onlineprice) FROM dish WHERE restoID=${id}`);

            const resto = res2[0];
            if(priceRes[0]['MAX(walkinprice)']) {
                resto.walkPrices = priceRes[0]['MAX(walkinprice)'] == priceRes[0]['MIN(walkinprice)'] ? [priceRes[0]['MAX(walkinprice)']] : [priceRes[0]['MIN(walkinprice)'], priceRes[0]['MAX(walkinprice)']] 
                resto.onlinePrices = priceRes[0]['MAX(onlineprice)'] == priceRes[0]['MIN(onlineprice)'] ? [priceRes[0]['MAX(onlineprice)']] : [priceRes[0]['MIN(onlineprice)'], priceRes[0]['MAX(onlineprice)']] 
            } else {
                resto.walkPrices = [0];
                resto.onlinePrices = [0];
            }

            resto.dishes = await retrieveDishesOwnedbyResto0(id);

            resto.images = [];
            res3.forEach(img => {
                resto.images.push(img.imageText);
            });

            resto.paymentOptions = [];
            res4.forEach(pay => {
                resto.paymentOptions.push(pay.paymentOptionText);
            });

            res.send({
                success: true,
                resto
            });
        } else {
            res.send({
                success: false,
                message: "Restaurant no longer exist in this system."
            });
        }
    } catch (err) {
        console.log(err.toString());

        res.send({
            success: false,
            message: "Check console to view error.",
        });
    }
}

const updateResto = async (req, res) => {
    try {
        const id = req.body.restoID;
        const userID = req.body.userID;
        const res0 = await conn.query(`SELECT userID FROM restaurant WHERE restoID=${id}`);
        const restoRes = await conn.query(`SELECT COUNT(userID) FROM restaurant WHERE restoname="${req.body.restoname}" AND NOT restoID=${id}`);

        if (res0.length == 0) {
            res.send({
                success: false,
                message: "Restaurant no longer exist in this system."
            });

        } else {
            if(res0[0].userID != req.body.userID) {
                res.send({
                    success: false,
                    message: "This user can't update this restaurant."
                });

            } else {
                if(restoRes[0]['COUNT(userID)'] > 0) {
                    res.send({
                        success: false,
                        message: `Restaurant '${req.body.restoname}' already exists in this system.`
                    });

                } else {
                    const res1 = await conn.query("UPDATE restaurant SET restoname=?, restoLocation=?, openingTime=?, closingTime=?, restoDesc=?, cpNum=?, email=?, facebook=?, instagram=?, twitter=?, daysOfTheWeek=? WHERE restoID=?", 
                    [req.body.restoname, req.body.location, req.body.openingTime, req.body.closingTime, req.body.restoDesc, req.body.cpNum, req.body.email, req.body.facebook, req.body.instagram, req.body.twitter, req.body.days, id]);
                    
                    const del1 = await conn.query(`DELETE FROM restoImages WHERE restoID=${id}`);
                    const images = req.body.images;
                    for (let i=0; i<images.length; i++) {
                        const imagesRes = await conn.query("INSERT INTO restoImages (restoID, imageText) VALUES (?, ?)", [id, images[i]]);
                    }

                    const del2 = await conn.query(`DELETE FROM paymentoptions WHERE restoID=${id}`);
                    const payment = req.body.paymentOptions;
                    for (let i=0; i<payment.length; i++) {
                        const paymentRes = await conn.query("INSERT INTO paymentoptions (restoID, paymentOptionText) VALUES (?, ?)", [id, payment[i]]);
                    }

                    res.send({
                        success: true,
                        message: `Successfully updated restaurant ${req.body.restoname}`,
                    });
                }
            }
        }
    } catch (err) {
        console.log(err.toString());

        res.send({
            success: false,
            message: "Check console to view error.",
        });
    }
}

const deleteResto = async (req, res) => {
    try {
        const id = req.body.restoID;
        const userID = req.body.userID;

        const res0 = await conn.query(`SELECT restoname FROM restaurant WHERE restoID=${id}`);
        const userRes = await conn.query(`SELECT COUNT(restoname) FROM restaurant WHERE restoID=${id} AND userID=${userID}`);

        if (res0.length == 0) {
            res.send({
                success: false,
                message: "Restaurant no longer exist in this system."
            });

        } else if (userRes[0]['COUNT(restoname)'] == 0) {
            res.send({
                success: false,
                message: "This user can't delete this restaurant."
            });
            
        } else {
            const res2 = await conn.query(`DELETE FROM restaurant WHERE restoID=${id}`);
            const res1 = await conn.query(`DELETE FROM restoImages WHERE restoID=${id}`);
            const res3 = await conn.query(`DELETE FROM paymentoptions WHERE restoID=${id}`);

            res.send({
                success: true,
                message: `Successfully deleted restaurant ${res0[0].restoname}`,
            });
        }
    } catch (err) {
        console.log(err.toString());

        res.send({
            success: false,
            message: "Check console to view error.",
        });
    }
}

export { createResto, retrieveRestoById, updateResto, deleteResto }