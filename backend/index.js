import express from 'express';
// import { saveUser, findUser} from "./user_functions.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import setUpRoutes from "./routes.js";
import { connectToMariaDB, cloudinary } from './connpool.js';

connectToMariaDB();
// cloudinary.uploader.upload("http://localhost:3000/8a2aca71-960b-4918-a9e7-ab43c0958fde",
//     { public_id: "simp" }, 
//     function(error, result) {
//         if (error) {
//             console.log(error)
//         } else {
//             console.log(result); 
//         }
//     }
// );

// const url = cloudinary.url("simp", {
//     width: 100,
//     height: 150,
//     crop: 'fill'
// });
// console.log(url);    

//instantiate the server
const app  = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: false}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
const corsConfig = {
    origin: true,
    credentials: true,
};
app.use(cors(corsConfig));
app.options('*', cors(corsConfig))
// app.use(cors());
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
setUpRoutes(app);

//tells out port to listen to port 3000
const port = process.env.PORT;
app.listen(port, (err) => {
    if (err) { console.log(err); }
    else { console.log(`Server listening at port ${port}`); }
});