import { conn } from './connpool.js';

const searchIng = async (req, res) => {
    try{
        const ingName = req.body.ingName;
        if(ingName.length == 0) {
            res.send({
                success: false,
                message: "Empty Input",
            });
        }
        let resFinal = []
        let fidFinal = []
        const res1 = await conn.query(`SELECT ingFID, ingNameDesc, ingSciName, ingAltName, ingType FROM ingredients WHERE ingNameDesc LIKE "${ingName}%" OR ingAltName LIKE "${ingName}%"`);
        const res3 = await conn.query(`SELECT ingFID, ingNameDesc, ingSciName, ingAltName, ingType FROM ingredients WHERE ingNameDesc LIKE "%${ingName}%" OR ingAltName LIKE "%${ingName}%"`);

        res1.forEach((res) => {
            fidFinal.push(res.ingFID);
            resFinal.push(res);
        });

        res3.forEach((res) => {
            if (!fidFinal.includes(res.ingFID)) {
                fidFinal.push(res.ingFID);
                resFinal.push(res);
            }
        })

        res.send({
            success: true,
            resultsCount: resFinal.length,
            // fids: fidFinal,
            results: resFinal,
        })
    } catch (err) {
        console.log(err.toString());

        res.send({
            success: false,
            message: "Check console to view error.",
        });
    }
}


const calculateNut = async (req, res) => {
    try {
        const fidList = req.body.fidList;
        const weightList = req.body.weightList;
        const servings = req.body.servings;

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
                const res1 = await conn.query(`SELECT * FROM ingredients WHERE ingFID="${fidList[i]}"`);
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

        res.send({
            success: true,
            ingCaloriesFinal: ingCaloriesFinal / 10000 / servings,
            ingCalciumFinal: ingCalciumFinal / 10000 / servings,
            ingPhosphorusFinal: ingPhosphorusFinal / 10000 / servings,
            ingIronFinal: ingIronFinal / 10000 / servings,
            ingSodiumFinal: ingSodiumFinal / 10000 / servings,
            ingAFinal: ingAFinal / 10000 / servings,
            ingBCFinal: ingBCFinal / 10000 / servings,
            ingRAEFinal: ingRAEFinal / 10000 / servings,
            ingB1Final: ingB1Final / 10000 / servings,
            ingB2Final: ingB2Final / 10000 / servings,
            ingNiacinFinal: ingNiacinFinal / 10000 / servings,
            ingCFinal: ingCFinal / 10000 / servings,
            ingKFinal: ingKFinal / 10000 / servings,
            ingZnFinal: ingZnFinal / 10000 / servings,
            ingNTFinal: ingNTFinal / 10000 / servings
        })

    } catch (err) {
        console.log(err.toString());

        res.send({
            success: false,
            message: "Check console to view error.",
        });
    }
}
export { searchIng, calculateNut }