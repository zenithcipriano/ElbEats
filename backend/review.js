import { conn } from './connpool.js';

const createReview = async (req, res) => {
    try {
        const userID = req.body.userID;
        const dishID = req.body.dishID;
        
        const userRes = await conn.query(`SELECT COUNT(userID) FROM user WHERE userID=${userID} AND userType=0`);
        const res0 = await conn.query(`SELECT COUNT(reviewID) FROM review WHERE userID=${userID} AND dishID=${dishID}`);

        if (userRes[0]['COUNT(userID)'] == 0) {
            res.send({
                success: false,
                message: `Owners can't submit reviews.`,
            });

        } else if (res0[0]['COUNT(reviewID)'] > 0) {
            res.send({
                success: false,
                message: `You already submitted a review for this dish`,
            });

        } else {
            const res1 = await conn.query("INSERT INTO review (reviewText, rating, userID, dishID, posted) VALUES (?, ?, ?, ?, ?)",
            [req.body.reviewText, req.body.rating, userID, dishID, req.body.posted]);

            res.send({
                success: true,
                message: `Successfully submitted your review`,
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

const retrieveReviewById = async (req, res) => {
    try {
        const id = req.body.reviewID;
        const res2 = await conn.query(`SELECT * FROM review WHERE reviewID=${id}`);

        if(res2.length > 0) {
            const review = res2[0];
            const res3 = await conn.query(`SELECT username FROM user WHERE userID=${review.userID}`);

            review.username = res3[0].username;
            res.send({
                success: true,
                review
            });

        } else {
            res.send({
                success: false,
                message: `Review (ReviewID:${id}) no longer exist in this system`
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

const updateReview = async (req, res) => {
    try {
        const id = req.body.reviewID;
        const userID = req.body.userID;

        const userRes = await conn.query(`SELECT COUNT(userID) FROM review WHERE userID=${userID} AND reviewID=${id}`);
        const res0 = await conn.query(`SELECT COUNT(reviewID) FROM review WHERE reviewID=${id}`);
        if (res0[0]['COUNT(reviewID)'] == 0) {
            res.send({
                success: false,
                message: `Review (ReviewID:${id}) no longer exist in this system`
            });

        } else if (userRes[0]['COUNT(userID)'] == 0) {
            res.send({
                success: false,
                message: `You don't have permission to update this review.`
            });
            
        } else {
            const res1 = await conn.query("UPDATE review SET reviewText=?, rating=?, posted=? WHERE reviewID=?", 
            [req.body.reviewText, req.body.rating, req.body.posted, id]);

            res.send({
                success: true,
                message: `Successfully updated your review (ReviewID:${id})`,
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

const deleteReview = async (req, res) => {
    try {
        const id = req.body.reviewID;
        const userID = req.body.userID;

        const res0 = await conn.query(`SELECT COUNT(reviewID) FROM review WHERE reviewID=${id}`);
        const userRes = await conn.query(`SELECT COUNT(reviewID) FROM review WHERE reviewID=${id} AND userID=${userID}`);

        if (res0[0]['COUNT(reviewID)'] == 0) {
            res.send({
                success: false,
                message: `Review (ReviewID:${id}) no longer exist in this system`
            });
            
        } else if (userRes[0]['COUNT(reviewID)'] == 0) {
            res.send({
                success: false,
                message: `You don't have permission to delete this review.`
            });

        } else {
            const res1 = await conn.query(`DELETE FROM review WHERE reviewID=${id}`);

            res.send({
                success: true,
                message: `Successfully deleted your review (ReviewID:${id})`,
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

export { createReview, retrieveReviewById, updateReview, deleteReview }