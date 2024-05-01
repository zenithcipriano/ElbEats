import mariadb from 'mariadb';
import {v2 as cloudinary} from 'cloudinary';

// const pool = mariadb.createPool({
//     host: '127.0.0.1',
//     port: 3306,
//     user:'root', 
//     password: 'zenith.09',
//     database: 'elbeats'
// });

const pool = mariadb.createPool({
    host: 'bcmzprqdm45etyfgzylf-mysql.services.clever-cloud.com',
    port: 3306,
    user:'ug9ldzd4w7bzux5h', 
    password: 'ZsLPJ8SqNZpu3fLkTrYg',
    database: 'bcmzprqdm45etyfgzylf',
    connectTimeout: 10000,
    acquireTimeout: 10000
});

let conn;

const connectToMariaDB = async () => {
    try {
        conn = await pool.getConnection();
        console.log(conn)

    } catch (err) {
        console.log(err);
        throw err;
    }
}
          
cloudinary.config({ 
    cloud_name: 'dallscgfp', 
    api_key: '166751186939533', 
    api_secret: 'meKTGcLeSjyv9V1B0-gqGcHfNmI' 
});

export {connectToMariaDB, conn, cloudinary}