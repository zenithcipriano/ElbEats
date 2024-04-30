import { conn } from './connpool.js';

const calculateNut1 = async (fidList, weightList, servings) => {
    try {
        let ingCaloriesFinal = 0;
        let ingCalciumFinal = 0;
        let ingPhosphorusFinal = 0;
        let ingIronFinal = 0;
        let ingSodiumFinal = 0;
        let ingAFinal = 0;
        let ingBCFinal = 0;
        let ingRAEFinal = 0;
        let ingB1Final = 0;
        let ingB2Final = 0;
        let ingNiacinFinal = 0;
        let ingCFinal = 0;
        let ingKFinal = 0;
        let ingZnFinal = 0;
        let ingNTFinal = 0;
        
        for (let i=0; i<fidList.length ; i++) {
            if(fidList[i] != "") {
                const res1 = await conn.query(`SELECT * FROM ingredients WHERE ingNameDesc="${fidList[i]}"`);
                ingCaloriesFinal += res1[0].ingCalories * 100 * weightList[i];
                ingCalciumFinal += res1[0].ingCalcium * 100 * weightList[i];
                ingPhosphorusFinal += res1[0].ingPhosphorus * 100 * weightList[i];
                ingIronFinal += res1[0].ingIron * 100 * weightList[i];
                ingSodiumFinal += res1[0].ingSodium * 100 * weightList[i];
                ingAFinal += res1[0].ingA * 100 * weightList[i];
                ingBCFinal += res1[0].ingBC * 100 * weightList[i];
                ingRAEFinal += res1[0].ingRAE * 100 * weightList[i];
                ingB1Final += res1[0].ingB1 * 100 * weightList[i];
                ingB2Final += res1[0].ingB2 * 100 * weightList[i];
                ingNiacinFinal += res1[0].ingNiacin * 100 * weightList[i];
                ingCFinal += res1[0].ingC * 100 * weightList[i];
                ingKFinal += res1[0].ingK * 100 * weightList[i];
                ingZnFinal += res1[0].ingZn * 100 * weightList[i];
                ingNTFinal += res1[0].ingNT * 100 * weightList[i];
            }
        }
        
        return {
            success: true,
            ingCaloriesFinal: ingCaloriesFinal / (10000 * servings),
            ingCalciumFinal: ingCalciumFinal / (10000 * servings),
            ingPhosphorusFinal: ingPhosphorusFinal / (10000 * servings),
            ingIronFinal: ingIronFinal / (10000 * servings),
            ingSodiumFinal: ingSodiumFinal / (10000 * servings),
            ingAFinal: ingAFinal / (10000 * servings),
            ingBCFinal: ingBCFinal / (10000 * servings),
            ingRAEFinal: ingRAEFinal / (10000 * servings),
            ingB1Final: ingB1Final / (10000 * servings),
            ingB2Final: ingB2Final / (10000 * servings),
            ingNiacinFinal: ingNiacinFinal / (10000 * servings),
            ingCFinal: ingCFinal / (10000 * servings),
            ingKFinal: ingKFinal / (10000 * servings),
            ingZnFinal: ingZnFinal / (10000 * servings),
            ingNTFinal: ingNTFinal / (10000 * servings)
        }

    } catch (err) {
        console.log(err.toString());
        
        return {
            success: false,
            message: "Check console to view error.",
        }
    }
}

const proteins = ["Nuts, Dried Beans, & Seeds", "Meat & Animals", "Fish, Shellfish & Aquatic Animals", "Eggs"]
const createDish = async (req, res) => {
    try {
        const restoRes = await conn.query(`SELECT userID FROM restaurant WHERE restoID=${req.body.restoID}`);
        if (restoRes.length == 0) {
            res.send({
                success: false,
                message: `This restaurant no longer exist in this system.`
            });
        } else {
            const userID = restoRes[0].userID;
            if(userID != req.body.userID) {
                res.send({
                    success: false,
                    message: `You can't create dish for this restaurant.`
                });

            } else {
                const res0 = await conn.query(`SELECT dishID FROM dish WHERE restoID=${req.body.restoID} AND dishname="${req.body.dishname}"`);
                if (res0.length > 0) {
                    res.send({
                        success: false,
                        message: `Dish ${req.body.dishname} of resto ${req.body.restoID} already exists.`,
                    });
                } else {

                    // const fidList = req.body.fidList;
                    const weightList = req.body.weightList;
                    const servings = req.body.servings;
                    const ingList = req.body.ingList;
                    const typeList = req.body.typeList;

                    // const nut1 = await calculateNut1(fidList, weightList, servings);
                    const nut1 = await calculateNut1(ingList, weightList, servings);
                    
                    // console.log(nut1);
                    if(!nut1.success) {
                        res.send({
                            success: false,
                            message: "Nutrition Computation Error. Please contact your developer",
                        });
                    } else {
                        const res1 = await conn.query("INSERT INTO dish (restoID, dishname, walkinprice, onlineprice, ingCaloriesFinal, ingCalciumFinal, ingPhosphorusFinal, ingIronFinal, ingSodiumFinal, ingAFinal, ingBCFinal, ingRAEFinal, ingB1Final, ingB2Final, ingNiacinFinal, ingCFinal, ingKFinal, ingZnFinal, ingNTFinal, permission, servings) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", 
                        [req.body.restoID, req.body.dishname, req.body.walkinprice, req.body.onlineprice, nut1.ingCaloriesFinal, nut1.ingCalciumFinal, nut1.ingPhosphorusFinal, nut1.ingIronFinal, nut1.ingSodiumFinal, nut1.ingAFinal, nut1.ingBCFinal, nut1.ingRAEFinal, nut1.ingB1Final, nut1.ingB2Final, nut1.ingNiacinFinal, nut1.ingCFinal, nut1.ingKFinal, nut1.ingZnFinal, nut1.ingNTFinal, req.body.permission, servings]);

                        const res2 = await conn.query(`SELECT dishID FROM dish WHERE restoID=${req.body.restoID} AND dishname="${req.body.dishname}"`);
                        const id = res2[0].dishID;

                        for (let i=0; i < typeList.length; i++) {
                            if (proteins.includes(typeList[i])) {
                                const proteinRes = await conn.query("INSERT INTO protein (dishID, proteinText, proteinType) VALUES (?, ?, ?)", [id, ingList[i], typeList[i]])
                            }
                        } 

                        for (let i=0; i < ingList.length; i++) {
                            const res9 = await conn.query("INSERT INTO dishing (dishID, dishIngText, dishIngType, dishIngAmount) VALUES (?, ?, ?, ?)", [id, ingList[i], typeList[i], weightList[i]])
                        }

                        const images = req.body.images;
                        for (let i=0; i<images.length; i++) {
                            const res9 = await conn.query("INSERT INTO dishImages (dishID, imageText) VALUES (?, ?)", [id, images[i]]);
                        }

                        res.send({
                            success: true,
                            message: `Successfully listed dish ${req.body.dishname} of resto ${req.body.restoID}`,
                        });
                    }
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

const retrieveDishByID = async (req, res) => {
    try {
        const id = req.body.dishID;
        const res2 = await conn.query(`SELECT * FROM dish WHERE dishID=${id}`);
        if(res2.length > 0) {
            const dish = res2[0];

            const restoRes = await conn.query(`SELECT restoname, restoLocation FROM restaurant WHERE restoID=${dish.restoID}`);
            const res1 = await conn.query(`SELECT paymentOptionText FROM paymentoptions WHERE restoID=${dish.restoID}`);
            const res3 = await conn.query(`SELECT dishIngText, dishIngType, dishIngAmount FROM dishing WHERE dishID=${id}`);
            const res4 = await conn.query(`SELECT reviewID, reviewText AS review, rating AS rate, userID, posted AS datePosted FROM review WHERE dishID=${id}`);
            const res5 = await conn.query(`SELECT proteinText, proteinType FROM protein WHERE dishID=${id}`);
            const res6 = await conn.query(`SELECT imageText FROM dishImages WHERE dishID=${id}`);

            dish.nut = {
                ingCalories: dish.ingCaloriesFinal.toFixed(2),
                ingCalcium: dish.ingCalciumFinal.toFixed(2),
                ingPhosphorus: dish.ingPhosphorusFinal.toFixed(2),
                ingIron: dish.ingIronFinal.toFixed(2),
                ingSodium: dish.ingSodiumFinal.toFixed(2),
                ingA: dish.ingAFinal.toFixed(2),
                ingBC: dish.ingBCFinal.toFixed(2),
                ingRAE: dish.ingRAEFinal.toFixed(2),
                ingB1: dish.ingB1Final.toFixed(2),
                ingB2: dish.ingB2Final.toFixed(2),
                ingNiacin: dish.ingNiacinFinal.toFixed(2),
                ingC: dish.ingCFinal.toFixed(2),
                ingK: dish.ingKFinal.toFixed(2),
                ingZn: dish.ingZnFinal.toFixed(2),
                ingNT: dish.ingNTFinal.toFixed(2)
            }

            delete dish["ingCaloriesFinal"];
            delete dish["ingCalciumFinal"];
            delete dish["ingPhosphorusFinal"];
            delete dish["ingIronFinal"];
            delete dish["ingSodiumFinal"];
            delete dish["ingAFinal"];
            delete dish["ingBCFinal"];
            delete dish["ingRAEFinal"];
            delete dish["ingB1Final"];
            delete dish["ingB2Final"];
            delete dish["ingNiacinFinal"];
            delete dish["ingCFinal"];
            delete dish["ingKFinal"];
            delete dish["ingZnFinal"];
            delete dish["ingNTFinal"];


            dish.address = restoRes[0].restoLocation;
            dish.restoname = restoRes[0].restoname;
            dish.images = []
            res6.forEach(res => {
                dish.images.push(res.imageText);
            })

            dish.paymentOptions = [];
            res1.forEach(res => {
                dish.paymentOptions.push(res.paymentOptionText);
            });

            dish.reviews = []
            dish.ratings = 0
            if(res4.length > 0) {
                res4.forEach(async (res) => {
                    const reviewer = await conn.query(`SELECT username FROM user WHERE userID=${res.userID}`);
                    res.username = reviewer[0];
                    dish.reviews.push(res);
                    dish.ratings += res.rate
                });
                dish.ratings = (dish.ratings / res4.length).toFixed(1);
            }

            dish.ings = [];
            dish.types = [];
            dish.amounts = [];
            res3.forEach(res => {
                dish.ings.push(res.dishIngText);
                dish.types.push(res.dishIngType);
                dish.amounts.push(res.dishIngAmount);
            });

            dish.protein = []
            dish.proteinSource = []
            res5.forEach(res => {
                dish.protein.push(res.proteinText)
                dish.proteinSource.push(res.proteinType)
            })

            res.send({
                success: true,
                dish
            });
        } else {
            res.send({
                success: false,
                message: "Dish no longer exist in this system."
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

const updateDish = async (req, res) => {
    try {
        const id = req.body.dishID;
        const userID = req.body.userID;

        const userRes = await conn.query(`SELECT restoID FROM restaurant WHERE userID=${userID}`);
        const res0 = await conn.query(`SELECT restoID FROM dish WHERE dishID=${id}`);
        if (res0.length == 0) {
            res.send({
                success: false,
                message: "Dish no longer exist in this system."
            });

        } else {
            const restoID = res0[0].restoID;
            let found = false;
            userRes.forEach(res => {
                if (res.restoID == restoID) {
                    found = true;
                }
            });

            if (!found) {
                res.send({
                    success: false,
                    message: `You can't update dish for this restaurant.`
                });

            } else {

                // const fidList = req.body.fidList;
                const weightList = req.body.weightList;
                const servings = req.body.servings;
                const ingList = req.body.ingList;
                const typeList = req.body.typeList;

                // const nut1 = await calculateNut1(fidList, weightList, servings);
                const nut1 = await calculateNut1(ingList, weightList, servings);
                if(!nut1.success) {
                    res.send({
                        success: false,
                        message: "Nutrition Computation Error. Please contact your developer",
                    });
                } else {
                    const res1 = await conn.query(`UPDATE dish SET dishname=?, walkinprice=?, onlineprice=?, ingCaloriesFinal=?, ingCalciumFinal=?, ingPhosphorusFinal=?, ` +
                    `ingIronFinal=?, ingSodiumFinal=?, ingAFinal=?, ingBCFinal=?, ` +
                    `ingRAEFinal=?, ingB1Final=?, ingB2Final=?, ingNiacinFinal=?, ` +
                    `ingCFinal=?, ingKFinal=?, ingZnFinal=?, ingNTFinal=?, permission=?, servings=? WHERE dishID=?`, 
                    [req.body.dishname, req.body.walkinprice, req.body.onlineprice, nut1.ingCaloriesFinal, nut1.ingCalciumFinal, nut1.ingPhosphorusFinal, nut1.ingIronFinal, nut1.ingSodiumFinal, nut1.ingAFinal, nut1.ingBCFinal, nut1.ingRAEFinal, nut1.ingB1Final, nut1.ingB2Final, nut1.ingNiacinFinal, nut1.ingCFinal, nut1.ingKFinal, nut1.ingZnFinal, nut1.ingNTFinal, req.body.permission, servings, id]);

                    const res6 = await conn.query(`DELETE FROM dishImages WHERE dishID=${id}`);
                    const images = req.body.images;
                    for (let i=0; i < images.length; i++) {
                        const imagesRes = await conn.query("INSERT INTO dishImages (dishID, imageText) VALUES (?, ?)", [id, images[i]])
                    } 

                    const res5 = await conn.query(`DELETE FROM protein WHERE dishID=${id}`);
                    for (let i=0; i < typeList.length; i++) {
                        if (proteins.includes(typeList[i])) {
                            const proteinRes = await conn.query("INSERT INTO protein (dishID, proteinText, proteinType) VALUES (?, ?, ?)", [id, ingList[i], typeList[i]])
                        }
                    } 

                    const res3 = await conn.query(`DELETE FROM dishing WHERE dishID=${id}`);
                    for (let i=0; i < ingList.length; i++) {
                        const res9 = await conn.query("INSERT INTO dishing (dishID, dishIngText, dishIngType, dishIngAmount) VALUES (?, ?, ?, ?)", [id, ingList[i], typeList[i], weightList[i]])
                    }

                    res.send({
                        success: true,
                        message: `Successfully updated dish ${req.body.dishname}`,
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

const deleteDish = async (req, res) => {
    try {
        const id = req.body.dishID;
        const userID = req.body.userID;

        const userRes = await conn.query(`SELECT restoID FROM restaurant WHERE userID=${userID}`);
        const res0 = await conn.query(`SELECT dishname, restoID FROM dish WHERE dishID=${id}`);
        if (res0.length == 0) {
            res.send({
                success: false,
                message: "Dish no longer exist in this system."
            });
        } else {
            const restoID = res0[0].restoID;
            let found = false;
            userRes.forEach(res => {
                if (res.restoID == restoID) {
                    found = true;
                }
            });

            if (!found) {
                res.send({
                    success: false,
                    message: `You can't delete dish for this restaurant.`
                });

            } else {
                const res1 = await conn.query(`DELETE FROM dish WHERE dishID=${id}`);
                const res3 = await conn.query(`DELETE FROM dishing WHERE dishID=${id}`);
                const res4 = await conn.query(`DELETE FROM review WHERE dishID=${id}`);
                const res5 = await conn.query(`DELETE FROM protein WHERE dishID=${id}`);
                const res6 = await conn.query(`DELETE FROM dishImages WHERE dishID=${id}`);

                res.send({
                    success: true,
                    message: `Successfully deleted dish ${res0[0].dishname}`,
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


export { createDish, retrieveDishByID, updateDish, deleteDish }