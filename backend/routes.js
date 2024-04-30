import { createDish, deleteDish, retrieveDishByID, updateDish } from "./dish.js";
import { retrieveAllDishes } from "./dishList.js";
import { calculateNut, searchIng } from "./ing.js";
import { signup, login, checkIfLoggedIn } from "./login.js";
import { retrieveDishesOwnedbyResto1 } from "./ownerProfile.js";
import { createResto, deleteResto, retrieveRestoById, updateResto } from "./resto.js";
import { createReview, retrieveReviewById, updateReview, deleteReview } from "./review.js";
import uploadImage from "./uploadImage.js";
import { updateUserPassword, updateUserViewedInfo, retrieveUserById, deleteUser } from "./user.js";

const setUpRoutes = (app) => {
    app.post("/", (req, res) => {
        res.send("Hello");
    })
    app.post("/signup", signup);
    app.post("/login", login);
    app.post("/checkifloggedin", checkIfLoggedIn);

    app.post("/searchIng", searchIng);
    app.post("/calculateNutritionValue", calculateNut);

    app.post("/createDish", createDish);
    app.post("/retrieveDishByID", retrieveDishByID);
    app.post("/updateDish", updateDish);
    app.post("/deleteDish", deleteDish);

    app.post("/createResto", createResto);
    app.post("/retrieveRestoById", retrieveRestoById)
    app.post("/updateResto", updateResto)
    app.post("/deleteResto", deleteResto);

    app.post("/createReview", createReview);
    app.post("/retrieveReviewById", retrieveReviewById)
    app.post("/updateReview", updateReview)
    app.post("/deleteReview", deleteReview);

    app.post("/updateUserPassword", updateUserPassword);
    app.post("/updateUserViewedInfo", updateUserViewedInfo);
    app.post("/retrieveUserById", retrieveUserById);
    app.post("/deleteUser", deleteUser);

    app.post("/retrieveAllDishes", retrieveAllDishes);
    app.post("/retrieveDishesOwnedbyResto", retrieveDishesOwnedbyResto1);
    app.post("/saveImages", uploadImage);
    // app.post("/retrieveRestosOwnedByID", retrieveRestosOwnedByID);
    // app.get("/", (req, res) => {
    //     res.send("Hello!");
    // })

    // app.post("/save-user", (req, res) => {   
    //     res.send({ success: saveUser(req.body.firstName, req.body.lastName, req.body.email, req.body.age) });
    // });

    // app.get("/find-by-name", (req, res) => {
    //     res.send(findUser(req.query.firstName, req.query.lastName));
    // })
}


export default setUpRoutes;