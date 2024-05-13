CREATE TABLE IF NOT EXISTS history (
    historyID INT NOT NULL AUTO_INCREMENT,
    dishID INT,
    userID INT,
    dateSelected datetime,
    CONSTRAINT history_historyID_pk PRIMARY KEY(historyID)
)