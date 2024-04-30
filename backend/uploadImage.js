import multer from "multer";
import cloudinary from "cloudinary";
import "dotenv";
import { response } from "express";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const myUploadMiddleware = upload.array("file");

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
      fn(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

export default async function uploadImage(req, res) {
    await runMiddleware(req, res, myUploadMiddleware);
    // console.log(req);
    // console.log(req.files);
    const images = [];

    for (const file of req.files) {
        try {
            const b64 = Buffer.from(file.buffer).toString("base64");
            let dataURI = "data:" + file.mimetype + ";base64," + b64;
            const response = await cloudinary.uploader.upload(dataURI, {
                folder: "dropzone-images",
            });

            console.log(response.secure_url);
            images.push(response.secure_url);

            // res.status(200).json({ imageUrl: response.secure_url });     
        } catch (error) {
            res.status(400).json(error);
            return;
        }
    }
    res.status(200).json({ imageUrl: images });     
}