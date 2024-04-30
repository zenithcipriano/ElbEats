import bcrypt from 'bcrypt';
// import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
// import { emailConfirmation } from './config/nodemailer.config.js';
// import { config } from './config/auth.config.js';
import { conn } from './connpool.js';

const checkIfLoggedIn = (req, res) => {
    if (!req.cookies) {
        // console.log("No Cookies")
        return res.send({ isLoggedIn: false });
    }

    if (!req.cookies.authToken) {
        // console.log("No AuthToken")
        return res.send({ isLoggedIn: false });
    }
    // Token is present. Validate it
    const secretKey = "IP of Ms. Zenith Averi V. Cipriano";
    return jwt.verify(
        req.cookies.authToken,
        secretKey,
        async (err, tokenPayload) => {
        if (err) {
            // Error validating token
            // console.log("Error validating token")
            return res.send({ isLoggedIn: false });
        }
        // find user by id indicated in token
        const userId = tokenPayload._id;
        let usertype = tokenPayload.type1;
        if (usertype == "reviewer") {
            usertype = 0;
        } else if (usertype == "owner") {
            usertype = 1;
        } else {
            usertype = -1;
        }

        const res1 = await conn.query("SELECT userID, userType, userPassword FROM user WHERE userID="+userId+" AND userType='" +usertype+"'");
        // console.log(userId + " | " + usertype + " | " + JSON.stringify(res1));

        // Failed to find user based on id inside token payload
        if(res1.length == 0){
            // console.log("User not found");
            return res.send({ isLoggedIn: false });
        } else{
            //Token and user id are valid
            // console.log("User is currently logged in");
            return res.send({ isLoggedIn: true });
        }
    });
}

const signup = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10); 
        const res1 = await conn.query("INSERT INTO user (username, email, userPassword, userType) VALUES (?, ?, ?, ?);", [req.body.username, req.body.email, hashedPassword, req.body.type]);
        
        res.send({
            success: true,
            message: "Signed up successfully!",
        });
    } catch (err) {
        res.send({
            success: false,
            message: "User already exist. Please use a different email address.",
        });
    }
}

const login = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        
        const res1 = await conn.query("SELECT userID, userType, userPassword FROM user WHERE username='"+username+"'");
        
        if(res1.length == 0) {
            res.send({success: false, message: "User does not exist"});
        } else {
            const savedPass = res1[0].userPassword;

            if (await bcrypt.compare(password, savedPass)) {
                const saveduserType = res1[0].userType == 0 ? "reviewer" : "owner";
                const userID = res1[0].userID;
                
                // let restoID;
                // let reviewID;
                // if(res1[0].userType) {
                //     restoID = res1[0].restoID;
                // } else {
                //     reviewID = res1[0].reviewID;
                // }
                // console.log("Successfully logged in");
                const tokenPayload = {
                    _id: userID,
                    type1: saveduserType
                }

                const secretKey = "IP of Ms. Zenith Averi V. Cipriano";
                const token = jwt.sign(tokenPayload, secretKey);
                // return the token to the client
                return res.send({ success: true, token, id: userID, message: "Successfully logged in.", type: saveduserType});
            } else {
                res.send({success: false, message:"Incorrect password."})
            }
        }
    } catch (err) {
        console.log(err.toString());
        
        res.send({
            success: false,
            message: "Check console to view error."
        });
    }
}

export { signup, login, checkIfLoggedIn }