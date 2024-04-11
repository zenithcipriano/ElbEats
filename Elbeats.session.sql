CREATE TABLE dish (
    dishID INT,
    restoID INT,
    dishname VARCHAR(100),
    ingredients VARCHAR(50), 
    reviewID INT,
    tags VARCHAR(20),
    price INT,
    images VARCHAR(100),
    meat VARCHAR(20),
    cookingMethod VARCHAR(20),
    CONSTRAINT dish_restoID_fk FOREIGN KEY(restoID) REFERENCES restaurant(restoID),
    CONSTRAINT dish_dishID_pk PRIMARY KEY(dishID)
);