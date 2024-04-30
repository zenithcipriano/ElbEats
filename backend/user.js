import { conn } from './connpool.js';
import bcrypt from 'bcrypt';
import { retrieveDishesOwnedbyResto0 } from './ownerProfile.js';
const updateUserViewedInfo = async (req, res) => {
    try {
        const id = req.body.userID;
        const res0 = await conn.query(`SELECT COUNT(userID) FROM user WHERE userID=${id}`);

        if (res0[0]['COUNT(userID)'] == 0) {
            res.send({
                success: false,
                message: "User no longer exist in this system."
            });

        } else {
            const res1 = await conn.query("UPDATE user SET username=?, sex=?, userWeight=?, picture=?, aboutYou=? WHERE userID=?", 
            [req.body.username, req.body.sex, req.body.userWeight, req.body.picture, req.body.aboutYou, id]);
            
            res.send({
                success: true,
                message: `Successfully updated user (UserId:${id})`,
            });
        }
    } catch (err) {
        console.log(err.toString());

        res.send({
            success: false,
            message: "Check console to view error."
        });
    }
}

const updateUserPassword = async (req, res) => {
    try {
        const id = req.body.userID;
        const password = req.body.oldPassword;

        const res0 = await conn.query(`SELECT userPassword FROM user WHERE userID=${id}`);
        const savedPass = res0[0].userPassword;

        if (res0.length == 0) {
            res.send({
                success: false,
                message: "User no longer exist in this system."
            });

        } else if (await bcrypt.compare(password, savedPass)) {

            const res1 = await conn.query("UPDATE user SET email=?, userPassword=? WHERE userID=?", 
            [req.body.email, req.body.newPassword, id]);
            
            res.send({
                success: true,
                message: `Successfully updated user (UserId:${id})`,
            });

        } else {
            res.send({
                success: false,
                message:"Incorrect password."
            });
        }
    } catch (err) {
        console.log(err.toString());

        res.send({
            success: false,
            message: "Check console to view error."
        });
    }
}

const retrieveRestosOwnedByID = async (userID) => {
    try {
        const id = userID;
        const res2 = await conn.query(`SELECT restoID, restoname, restoLocation FROM restaurant WHERE userID=${id}`);
        
        if(res2.length > 0) {
            // const restos = res2[0];
            return res2
        } else {
            return [];
        }

    } catch (err) {
        console.log("retrieveRestosOwnedByID");
        console.log(err.toString());
        return [];
    }
}

const retrieveUserById = async (req, res) => {
    try {
        const id = req.body.userID;
        const res2 = await conn.query(`SELECT username, email, sex, userWeight, picture, userType, aboutYou FROM user WHERE userID=${id}`);
        
        if(res2.length > 0) {
            const user = res2[0];
            const restos = await retrieveRestosOwnedByID(id);
            let dishes = [];
            if(restos.length > 0) {
                dishes = await retrieveDishesOwnedbyResto0(restos[0].restoID);
            }

            res.send({
                success: true,
                user,
                restos,
                dishes
            });
        } else {
            res.send({
                success: false,
                message: "User no longer exist in this system."
            });
        }

    } catch (err) {
        console.log(err.toString());

        res.send({
            success: false,
            message: "Check console to view error."
        });
    }
}


const deleteUser = async (req, res) => {
    try {
        const id = req.body.userID;
        const password = req.body.password;

        const res0 = await conn.query(`SELECT userPassword FROM user WHERE userID=${id}`);
        const savedPass = res0[0].userPassword;

        if (res0.length == 0) {
            res.send({
                success: false,
                message: "User no longer exist in this system."
            });

        } else if (await bcrypt.compare(password, savedPass)) {

            const res1 = await conn.query(`DELETE FROM user WHERE userID=${id}`);
            res.send({
                success: true,
                message: `Successfully deleted user (UserId:${id})`,
            });

        } else {
            res.send({
                success: false,
                message:"Incorrect password."
            });
        }

    } catch (err) {
        console.log(err.toString());

        res.send({
            success: false,
            message: "Check console to view error."
        });
    }
}

export { updateUserPassword, updateUserViewedInfo, retrieveUserById, deleteUser }