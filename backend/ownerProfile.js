import { conn } from './connpool.js';

// const retrieveRestosOwnedByID = async (req, res) => {
//     try {
//         const id = req.body.userID;
//         const res2 = await conn.query(`SELECT restoID, restoname, restoLocation FROM restaurant WHERE userID=${id}`);
        
//         if(res2.length > 0) {
//             const restos = res2[0];
//             res.send({
//                 success: true,
//                 restos
//             });
//         } else {
//             res.send({
//                 success: false,
//                 message: "User no longer exist in this system."
//             });
//         }

//     } catch (err) {
//         console.log(err.toString());

//         res.send({
//             success: false,
//             message: "Check console to view error."
//         });
//     }
// }

const retrieveDishesOwnedbyResto1 = async (req, res) => {
    try {
        const id = req.body.restoID;
        const res2 = await conn.query(`SELECT * FROM dish WHERE restoID=${id}`);
        
        for (let k=0; k<res2.length; k++) {
            const dish = res2[k];
            const id = dish.dishID;

            const restoRes = await conn.query(`SELECT restoname, daysOfTheWeek, openingTime, closingTime FROM restaurant WHERE restoID=${dish.restoID}`);
            const res4 = await conn.query(`SELECT rating FROM review WHERE dishID=${id}`);
            const res5 = await conn.query(`SELECT proteinText FROM protein WHERE dishID=${id}`);
            const res6 = await conn.query(`SELECT imageText FROM dishImages WHERE dishID=${id}`);

            res2[k].restoname = restoRes[0].restoname;
            res2[k].daysOfTheWeek = restoRes[0].daysOfTheWeek;
            res2[k].openingTime = restoRes[0].openingTime;
            res2[k].closingTime = restoRes[0].closingTime;
            res2[k].minerals = ""
            let minCounter = 0;

            if (res2[k].ingCalciumFinal > 0) {
                res2[k].minerals += "calcium";
                minCounter += 1;
            }
            if (res2[k].ingZnFinal > 0) {
                if(minCounter > 0) {
                    res2[k].minerals += ", zinc";
                } else {
                    res2[k].minerals += "zinc";
                }
                minCounter += 1;
            }

            if (res2[k].ingIronFinal > 0) {
                if(minCounter > 0) {
                    res2[k].minerals += ", iron";
                } else {
                    res2[k].minerals += "iron";
                }
                minCounter += 1;
            }
            if (res2[k].ingPhosphorusFinal > 0) {
                if(minCounter > 0) {
                    res2[k].minerals += ", phosphorus";
                } else {
                    res2[k].minerals += "phosphorus";
                }
            }

            res2[k].vitamins = ""
            let vitCounter = 0;

             if (res2[k].ingAFinal > 0) {
                res2[k].vitamins += "A";
                vitCounter += 1;
             }
             if (res2[k].ingB1Final > 0) {
                if (vitCounter > 0) {
                    res2[k].vitamins += ", B1";
                } else {
                    res2[k].vitamins += "B1";
                }
                vitCounter += 1;
             }
             if (res2[k].ingB2Final > 0) {
                if (vitCounter > 0) {
                    res2[k].vitamins += ", B2";
                } else {
                    res2[k].vitamins += "B2";
                }
                vitCounter += 1;
             }
             if (res2[k].ingNiacinFinal > 0) {
                if (vitCounter > 0) {
                    res2[k].vitamins += ", B3";
                } else {
                    res2[k].vitamins += "B3";
                }
                vitCounter += 1;
             }
             if (res2[k].ingCFinal > 0) {
                if (vitCounter > 0) {
                    res2[k].vitamins += ", C";
                } else {
                    res2[k].vitamins += "C";
                }
                vitCounter += 1;
             }
             if (res2[k].ingKFinal > 0) {
                if (vitCounter > 0) {
                    res2[k].vitamins += ", K";
                } else {
                    res2[k].vitamins += "K";
                }
                vitCounter += 1;
             }

            delete res2[k]["ingCalciumFinal"];
            delete res2[k]["ingPhosphorusFinal"];
            delete res2[k]["ingIronFinal"];
            delete res2[k]["ingAFinal"];
            delete res2[k]["ingBCFinal"];
            delete res2[k]["ingRAEFinal"];
            delete res2[k]["ingB1Final"];
            delete res2[k]["ingB2Final"];
            delete res2[k]["ingNiacinFinal"];
            delete res2[k]["ingCFinal"];
            delete res2[k]["ingKFinal"];
            delete res2[k]["ingZnFinal"];
            delete res2[k]["ingNTFinal"];
            
            if (res6.length > 0) {
                res2[k].images = res6[0].imageText;
            }

            res2[k].ratings = 0
            res2[k].reviewCount = res4.length
            if(res2[k].reviewCount > 0) {
                res4.forEach(async (res) => {
                    res2[k].ratings += res.rating
                });
                res2[k].ratings = (res2[k].ratings / res4.length).toFixed(1);
            }

            res2[k].protein = ""
            for (let i=0; i < res5.length; i++) {
                if (i==0) {
                    res2[k].protein = res5[i].proteinText
                } else {
                    res2[k].protein += ", " + res5[i].proteinText
                }
            }
        }

        res.send({
            success: true,
            count: res2.length,
            dishList: res2
        });

    } catch (err) {
        console.log(err.toString());
        
        res.send({
            success: false,
            message: "Check console to view error.",
        });
    }
}

const retrieveDishesOwnedbyResto0 = async (restoID) => {
    try {
        const id = restoID;
        const res2 = await conn.query(`SELECT * FROM dish WHERE restoID=${id}`);
        
        for (let k=0; k<res2.length; k++) {
            const dish = res2[k];
            const id = dish.dishID;

            const restoRes = await conn.query(`SELECT restoname, daysOfTheWeek, openingTime, closingTime FROM restaurant WHERE restoID=${dish.restoID}`);
            const res4 = await conn.query(`SELECT rating FROM review WHERE dishID=${id}`);
            const res5 = await conn.query(`SELECT proteinText FROM protein WHERE dishID=${id}`);
            const res6 = await conn.query(`SELECT imageText FROM dishImages WHERE dishID=${id}`);

            res2[k].restoname = restoRes[0].restoname;
            res2[k].daysOfTheWeek = restoRes[0].daysOfTheWeek;
            res2[k].openingTime = restoRes[0].openingTime;
            res2[k].closingTime = restoRes[0].closingTime;
            res2[k].minerals = ""
            let minCounter = 0;

            if (res2[k].ingCalciumFinal > 0) {
                res2[k].minerals += "calcium";
                minCounter += 1;
            }
            if (res2[k].ingZnFinal > 0) {
                if(minCounter > 0) {
                    res2[k].minerals += ", zinc";
                } else {
                    res2[k].minerals += "zinc";
                }
                minCounter += 1;
            }

            if (res2[k].ingIronFinal > 0) {
                if(minCounter > 0) {
                    res2[k].minerals += ", iron";
                } else {
                    res2[k].minerals += "iron";
                }
                minCounter += 1;
            }
            if (res2[k].ingPhosphorusFinal > 0) {
                if(minCounter > 0) {
                    res2[k].minerals += ", phosphorus";
                } else {
                    res2[k].minerals += "phosphorus";
                }
            }

            res2[k].vitamins = ""
            let vitCounter = 0;

             if (res2[k].ingAFinal > 0) {
                res2[k].vitamins += "A";
                vitCounter += 1;
             }
             if (res2[k].ingB1Final > 0) {
                if (vitCounter > 0) {
                    res2[k].vitamins += ", B1";
                } else {
                    res2[k].vitamins += "B1";
                }
                vitCounter += 1;
             }
             if (res2[k].ingB2Final > 0) {
                if (vitCounter > 0) {
                    res2[k].vitamins += ", B2";
                } else {
                    res2[k].vitamins += "B2";
                }
                vitCounter += 1;
             }
             if (res2[k].ingNiacinFinal > 0) {
                if (vitCounter > 0) {
                    res2[k].vitamins += ", B3";
                } else {
                    res2[k].vitamins += "B3";
                }
                vitCounter += 1;
             }
             if (res2[k].ingCFinal > 0) {
                if (vitCounter > 0) {
                    res2[k].vitamins += ", C";
                } else {
                    res2[k].vitamins += "C";
                }
                vitCounter += 1;
             }
             if (res2[k].ingKFinal > 0) {
                if (vitCounter > 0) {
                    res2[k].vitamins += ", K";
                } else {
                    res2[k].vitamins += "K";
                }
                vitCounter += 1;
             }

            delete res2[k]["ingCalciumFinal"];
            delete res2[k]["ingPhosphorusFinal"];
            delete res2[k]["ingIronFinal"];
            delete res2[k]["ingAFinal"];
            delete res2[k]["ingBCFinal"];
            delete res2[k]["ingRAEFinal"];
            delete res2[k]["ingB1Final"];
            delete res2[k]["ingB2Final"];
            delete res2[k]["ingNiacinFinal"];
            delete res2[k]["ingCFinal"];
            delete res2[k]["ingKFinal"];
            delete res2[k]["ingZnFinal"];
            delete res2[k]["ingNTFinal"];
            
            if (res6.length > 0) {
                res2[k].images = res6[0].imageText;
            }

            res2[k].ratings = 0
            res2[k].reviewCount = res4.length
            if(res2[k].reviewCount > 0) {
                res4.forEach(async (res) => {
                    res2[k].ratings += res.rating
                });
                res2[k].ratings = (res2[k].ratings / res4.length).toFixed(1);
            }

            res2[k].protein = ""
            for (let i=0; i < res5.length; i++) {
                if (i==0) {
                    res2[k].protein = res5[i].proteinText
                } else {
                    res2[k].protein += ", " + res5[i].proteinText
                }
            }
        }

        // res.send({
        //     success: true,
        //     count: res2.length,
        //     dishList: res2
        // });
        return res2;

    } catch (err) {
        console.log(err.toString());
        
        return [];
        // res.send({
        //     success: false,
        //     message: "Check console to view error.",
        // });
    }
}

export {retrieveDishesOwnedbyResto1, retrieveDishesOwnedbyResto0} 