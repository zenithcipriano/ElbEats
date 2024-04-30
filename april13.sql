-- ALTER TABLE review MODIFY `reviewID` INT NOT NULL AUTO_INCREMENT;

-- ALTER TABLE user
-- DROP FOREIGN KEY user_reviewID_fk;

-- ALTER TABLE user MODIFY `userType` BOOLEAN;

-- INSERT INTO user (username, email, userPassword, userType) VALUES ("zvc", "ah@md", "password", 0);
-- TRUNCATE TABLE user; 
-- INSERT INTO user (dishname, restoID, walkinPrice, onlinePrice, payments, ) VALUES (?, ?, ?, ?);
-- dishID        | int(11)      | NO   | PRI | NULL    | auto_increment |
-- | restoID       | int(11)      | YES  | MUL | NULL    |                |
-- | dishname      | varchar(100) | YES  |     | NULL    |                |
-- | ingredients   | varchar(50)  | YES  |     | NULL    |                |
-- | reviewID      | int(11)      | YES  | MUL | NULL    |                |
-- | tags          | varchar(20)  | YES  |     | NULL    |                |
-- | price         | int(11)      | YES  |     | NULL    |                |
-- | images        | varchar(100) | YES  |     | NULL    |                |
-- | meat          | varchar(20)  | YES  |     | NULL    |                |
-- | cookingMethod

-- ALTER TABLE restaurant ADD (restoDesc varchar(300));

-- INSERT INTO restaurant (restoname, restoLocation, openingTime, closingTime, restoDesc, 
-- socials, contacts, paymentOptions, userID) VALUES ("RecipeTin Eats", "F.O. Santos St., Los Baños, Philippines", 
-- "08:00:00", "22:00:00", "The best Korean BBQ Grill in Pansol, Laguna that also offers a private hotspring resort for you to enjoy and stay overnight.",
-- ["facebookRE", "instagramIE", "messengerRE", "twitterRE"], ["0908 811 2302", "dummy@gmail.com"], ["GCash", "Cash"], 3);

ALTER TABLE dish CHANGE COLUMN `price` `walkinprice` INT;
ALTER TABLE dish ADD (onlineprice INT);
ALTER TABLE dish ADD (ingCaloriesFinal FLOAT);
ALTER TABLE dish ADD (ingCalciumFinal FLOAT);
ALTER TABLE dish ADD (ingPhosphorusFinal FLOAT);
ALTER TABLE dish ADD (ingIronFinal FLOAT);
ALTER TABLE dish ADD (ingSodiumFinal FLOAT);
ALTER TABLE dish ADD (ingAFinal FLOAT);
ALTER TABLE dish ADD (ingBCFinal FLOAT);
ALTER TABLE dish ADD (ingRAEFinal FLOAT);
ALTER TABLE dish ADD (ingB1Final FLOAT);
ALTER TABLE dish ADD (ingB2Final FLOAT);
ALTER TABLE dish ADD (ingNiacinFinal FLOAT);
ALTER TABLE dish ADD (ingCFinal FLOAT);
ALTER TABLE dish ADD (ingKFinal FLOAT);
ALTER TABLE dish ADD (ingZnFinal FLOAT);
ALTER TABLE dish ADD (ingNTFinal FLOAT);
-- ALTER TABLE restaurant ADD (email VARCHAR(30));
ALTER TABLE dish DROP tags;
ALTER TABLE dish DROP reviewID;
ALTER TABLE dish DROP ingredients;
ALTER TABLE dish DROP images;
ALTER TABLE dish DROP cookingMethod;

CREATE TABLE images (
    imageID INT NOT NULL AUTO_INCREMENT,
    dishID INT,
    imageText VARCHAR(30),
    CONSTRAINT images_imageID_pk PRIMARY KEY(imageID)
);


-- CREATE TABLE dishIng (
--     dishIngID INT NOT NULL AUTO_INCREMENT,
--     dishID INT,
--     dishIngText VARCHAR(30),
--     dishIngType VARCHAR(30),
--     dishIngAmount FLOAT,
--     CONSTRAINT dishIng_dishIngID_pk PRIMARY KEY(dishIngID)
-- );

-- INSERT INTO socials (restoID, socialText) VALUES (2,"facebookTrese"), (2, "instagramTrese"), (2,"messengerTrese"), (2, "twitterTrese");
-- INSERT INTO paymentoptions (restoID, paymentOptionText) VALUES (2,"GCASH"), (2, "Credit/Debit Card"), (2,"Cash"), (2, "LandBank");

-- INSERT INTO restaurant (restoname, restoLocation, openingTime, closingTime, restoDesc, 
-- cpNum, userID) VALUES ("Trese Siyete LB", "Manila South Road, Brgy. Pansol Purok 7 , Calamba, Philippines", 
-- "11:00:00", "21:00:00", "Great tasting food does not have to be expensive.",
-- "09503672254", 3);

-- 2 lbs pork sliced into cubes
-- ▢2 medium potatoes cubed
-- ▢1/4 cup white vinegar
-- ▢1/2 cup soy sauce
-- ▢5 cloves crushed garlic
-- ▢3 pieces dried bay leaves
-- ▢1 tbsp whole pepper corn
-- ▢1 cup water
-- ▢2 tablespoons cooking oil
-- ▢Salt to taste

-- SELECT * FROM ingredients WHERE ingNameDesc LIKE "%Pork belly%" OR ingAltName LIKE "%Pork belly%";
