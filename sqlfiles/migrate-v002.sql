USE ynov_ci;
CREATE TABLE utilisateur
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(255),
    date_naissance VARCHAR(10),
    ville VARCHAR(255),
    code_postal VARCHAR(5)
);
DESCRIBE utilisateur;