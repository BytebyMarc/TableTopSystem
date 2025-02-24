

CREATE TABLE Users (
    ID_Users INTEGER PRIMARY KEY AUTO_INCREMENT,
    eMail VARCHAR(50) NOT NULL,
    DateInsertEntry DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Passwort(
    ID_Passwort INTEGER PRIMARY KEY AUTO_INCREMENT,
    ID_Users INTEGER,
    FOREIGN KEY (ID_Users) REFERENCES Users(ID_Users),
    Passwort VARCHAR(255) NOT NULL,
    DateLastUpdate DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE GameSystem(
  ID_GameSystem INTEGER PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(50)
);

CREATE TABLE ArmyList(
    ID_Army INTEGER PRIMARY KEY AUTO_INCREMENT,
    ID_Users INTEGER,
    FOREIGN KEY (ID_Users) REFERENCES Users(ID_Users),
    Name VARCHAR(100),
    ID_GameSystem INTEGER,
    Points INTEGER,
    FOREIGN KEY (ID_GameSystem) REFERENCES GameSystem(ID_GameSystem)
);

CREATE TABLE ArmeeComposition(
    ID_ArmeeComposition INTEGER PRIMARY KEY AUTO_INCREMENT,
    ID_Army INTEGER,
    FOREIGN KEY (ID_Army) REFERENCES ArmyList(ID_Army),
    Fraction INTEGER,
    Name VARCHAR(50),
    TroopData TEXT

);

CREATE TABLE Tournament (
    ID_Tournament INTEGER PRIMARY KEY AUTO_INCREMENT,
    ID_Users INTEGER,
    FOREIGN KEY (ID_Users) REFERENCES Users(ID_Users),
    Name VARCHAR(50),
    MaxSubscriber INTEGER,
    PLZ INTEGER,
    Ort VARCHAR(50),
    Price INTEGER,
    LastDate DATETIME,
    MaxPoint INTEGER,
    Start DATETIME,
    End DATETIME,
    Information TEXT,
    Paypal VARCHAR,
    DateInsertEntry DATETIME DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE Subscriber(
    ID_Subscriber INTEGER PRIMARY KEY AUTO_INCREMENT,
    ID_Tournament INTEGER,
    FOREIGN KEY (ID_Tournament) REFERENCES Tournament(ID_Tournament),
    ID_Users INTEGER,
    FOREIGN KEY (ID_Users) REFERENCES Users(ID_Users),
    ID_Army INTEGER,
    FOREIGN KEY (ID_Army) REFERENCES ArmyList(ID_Army),
    Payed TINYINT,
    DateInsertEntry DATETIME DEFAULT CURRENT_TIMESTAMP
)

