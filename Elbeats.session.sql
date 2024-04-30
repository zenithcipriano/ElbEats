-- ALTER TABLE dish ADD (servings INT);
-- ALTER TABLE restaurant ADD (daysOfTheWeek VARCHAR(10));
-- ALTER TABLE restaurant ADD (twitter VARCHAR(30));

-- ALTER TABLE images RENAME TO dishImages;
-- CREATE TABLE restoImages AS SELECT * FROM dishImages;
-- ALTER TABLE restoImages CHANGE COLUMN `imageID` `imageID` INT NOT NULL AUTO_INCREMENT;
-- ALTER TABLE restaurant CHANGE COLUMN `daysOfTheWeek` `daysOfTheWeek` varchar(20);
-- ALTER TABLE restoImages CHANGE COLUMN `imageText` `imageText` varchar(300);


-- ALTER TABLE dishImages CHANGE COLUMN `dishID` `dishID` INT NOT NULL AUTO_INCREMENT;
-- ALTER TABLE restaurant
-- ADD CONSTRAINT restoImages_imageID_pk PRIMARY KEY(imageID);
-- DROP TABLE restoImages;

-- CREATE TABLE mealHistory (
--     dishID INT,
--     userID INT,
--     CONSTRAINT mealHistory_du_pk PRIMARY KEY(dishID, userID)
-- )

-- INSERT INTO socials (restoID, socialText) VALUES (2,"facebookTrese"), (2, "instagramTrese"), (2,"messengerTrese"), (2, "twitterTrese");
-- INSERT INTO paymentoptions (restoID, paymentOptionText) VALUES (2,"GCASH"), (2, "Credit/Debit Card"), (2,"Cash"), (2, "LandBank");

-- INSERT INTO restaurant (restoname, restoLocation, openingTime, closingTime, restoDesc, 
-- cpNum, userID) VALUES ("Trese Siyete LB", "Manila South Road, Brgy. Pansol Purok 7 , Calamba, Philippines", 
-- "11:00:00", "21:00:00", "Great tasting food does not have to be expensive.",
-- "09503672254", 3);

-- UPDATE dish SET servings=1;
-- SELECT MAX(onlineprice), MIN(onlineprice) FROM dish WHERE restoID=${id}
DELETE FROM dish WHERE permission=0;