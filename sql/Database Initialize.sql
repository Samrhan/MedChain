#------------------------------------------------------------
#       Création de la base de données
#		MedChain
#
#		Auteurs :
#			Samuel BADER, 
#			Yann COURTEMANCHE, 
#			Enzo FILANGI, 
#			Adrien GIRARD, 
#			Jonathan WITT
#------------------------------------------------------------

#------------------------------------------------------------
# Suppression des données existantes
#------------------------------------------------------------

DROP DATABASE IF EXISTS medchain;
CREATE DATABASE medchain;
use medchain;


#------------------------------------------------------------
# Table: Specialites
#------------------------------------------------------------

CREATE TABLE Specialites(
        Specialite Varchar (200) NOT NULL
	,CONSTRAINT Specialites_PK PRIMARY KEY (Specialite)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Medecins
#------------------------------------------------------------

CREATE TABLE Medecins(
        Id_medecin      Int  Auto_increment  NOT NULL ,
        Nom_medecin     Varchar (200) NOT NULL ,
        Prenom_medecin  Varchar (200) NOT NULL ,
        Numero          Varchar (200) NOT NULL ,
        Rue             Varchar (200) NOT NULL ,
        Ville           Varchar (200) NOT NULL ,
        CodePostal      Char (5) NOT NULL ,
        Telephone       Char (10) NOT NULL ,
        RPPS            Char (11) NOT NULL ,
        Password        Text NOT NULL ,
        Droit_connexion Bool NOT NULL DEFAULT True,
        Specialite      Varchar (200) NOT NULL
	,CONSTRAINT Medecins_PK PRIMARY KEY (Id_medecin)

	,CONSTRAINT Medecins_Specialites_FK FOREIGN KEY (Specialite) REFERENCES Specialites(Specialite)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Ordonnances
#------------------------------------------------------------

CREATE TABLE Ordonnances(
        Id_ordonnance       Char(36) NOT NULL ,
        Identifiant_patient text NOT NULL ,
        Renouvellements     Int NOT NULL ,
        Date_maximum        Date NOT NULL ,
        Date_prescription   Datetime NOT NULL ,
        Id_medecin          Int NOT NULL
	,CONSTRAINT Ordonnances_PK PRIMARY KEY (Id_ordonnance)

	,CONSTRAINT Ordonnances_Medecins_FK FOREIGN KEY (Id_medecin) REFERENCES Medecins(Id_medecin)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Prescriptions
#------------------------------------------------------------

CREATE TABLE Prescriptions(
        Id_prescription Int  Auto_increment  NOT NULL ,
        Nom_medicament  Varchar (200) NOT NULL ,
        Dosage          Varchar (200) NOT NULL ,
        Duree           Int NOT NULL ,
        Prises_par_jour Int NOT NULL ,
        Id_ordonnance   Char(36) NOT NULL
	,CONSTRAINT Prescriptions_PK PRIMARY KEY (Id_prescription)

	,CONSTRAINT Prescriptions_Ordonnances_FK FOREIGN KEY (Id_ordonnance) REFERENCES Ordonnances(Id_ordonnance)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Pharmacie
#------------------------------------------------------------

CREATE TABLE Pharmacies(
        Id_pharmacie Int  Auto_increment  NOT NULL ,
        Numero       Varchar (200) NOT NULL ,
        Rue          Varchar (200) NOT NULL ,
        Ville        Varchar (200) NOT NULL ,
        CodePostal   Char (5) NOT NULL ,
        Telephone    Char (10) NOT NULL
	,CONSTRAINT Pharmacie_PK PRIMARY KEY (Id_pharmacie)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Pharmacien
#------------------------------------------------------------

CREATE TABLE Pharmaciens(
        Id_pharmacien     Int  Auto_increment  NOT NULL ,
        Nom_pharmacien    Varchar (200) NOT NULL ,
        Prenom_pharmacien Varchar (200) NOT NULL ,
        Numero            Varchar (200) NOT NULL ,
        Rue               Varchar (200) NOT NULL ,
        Ville             Varchar (200) NOT NULL ,
        CodePostal        Char (5) NOT NULL ,
        Telephone         Char (10) NOT NULL ,
        Password          Text NOT NULL ,
        Username          Text NOT NULL ,
        Droit_connexion   Bool NOT NULL DEFAULT True ,
        Id_pharmacie      Int NOT NULL
	,CONSTRAINT Pharmacien_PK PRIMARY KEY (Id_pharmacien)

	,CONSTRAINT Pharmacien_Pharmacie_FK FOREIGN KEY (Id_pharmacie) REFERENCES Pharmacies(Id_pharmacie)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Delivre
#------------------------------------------------------------

CREATE TABLE Delivre(
        Id_Delivre     Int  Auto_increment  NOT NULL ,
        Id_ordonnance     Char(36) NOT NULL ,
        Id_pharmacien     Int NOT NULL ,
        Date_delivrance   Datetime NOT NULL ,
		Delivre_en_entier Bool DEFAULT False
	,CONSTRAINT Delivre_PK PRIMARY KEY (Id_Delivre,Id_ordonnance,Id_pharmacien,Date_delivrance)

	,CONSTRAINT Delivre_Ordonnances_FK FOREIGN KEY (Id_ordonnance) REFERENCES Ordonnances(Id_ordonnance)
	,CONSTRAINT Delivre_Pharmacien0_FK FOREIGN KEY (Id_pharmacien) REFERENCES Pharmaciens(Id_pharmacien)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Note
#------------------------------------------------------------

CREATE TABLE Notes(
        Id_Notes     Int  Auto_increment  NOT NULL ,
        Id_ordonnance Char(36) NOT NULL ,
        Id_pharmacie  Int NOT NULL ,
        Contenu       Text NOT NULL ,
        Date_ecriture Date NOT NULL ,
        Utilise Bool NOT NULL DEFAULT False

	,CONSTRAINT Note_PK PRIMARY KEY (Id_Notes,Id_ordonnance,Id_pharmacie,Date_ecriture)

	,CONSTRAINT Note_Ordonnances_FK FOREIGN KEY (Id_ordonnance) REFERENCES Ordonnances(Id_ordonnance)
	,CONSTRAINT Note_Pharmacie0_FK FOREIGN KEY (Id_pharmacie) REFERENCES Pharmacies(Id_pharmacie)
)ENGINE=InnoDB;

#------------------------------------------------------------
#       Création des vues
#		MedChain
#
#		Auteurs :
#			Samuel BADER, 
#			Yann COURTEMANCHE, 
#			Enzo FILANGI, 
#			Adrien GIRARD, 
#			Jonathan WITT
#------------------------------------------------------------

#------------------------------------------------------------
# Suppression des données existantes
#------------------------------------------------------------

DROP VIEW IF EXISTS medecins_complet;
DROP VIEW IF EXISTS pharmaciens_complet;
DROP VIEW IF EXISTS ordonnances_complet;
DROP VIEW IF EXISTS utilisations_ordonnance;
DROP VIEW IF EXISTS prescription_utile;
DROP VIEW IF EXISTS notes_utile;


#------------------------------------------------------------
# Création des vues
#------------------------------------------------------------

CREATE OR REPLACE VIEW medecins_complet AS
SELECT * FROM medecins
NATURAL JOIN specialites;

CREATE OR REPLACE VIEW pharmaciens_complet AS
SELECT Nom_pharmacien, Prenom_pharmacien, pharmaciens.Numero as pharmacienNumero, pharmaciens.Rue as pharmacienRue, pharmaciens.Ville as pharmacienVille, pharmaciens.CodePostal as pharmacienCodePostal, pharmaciens.Telephone as pharmacienTelephone, Password, Username, Droit_connexion, pharmacies.Id_pharmacie, pharmacies.Numero as pharmacieNumero, pharmacies.Rue as pharmacieRue, pharmacies.Ville as pharmacieVille, pharmacies.CodePostal as pharmacieCodePostal, pharmacies.Telephone as pharmacieTelephone
FROM pharmaciens
LEFT JOIN pharmacies ON pharmaciens.id_pharmacie = pharmacies.id_pharmacie;

CREATE OR REPLACE VIEW ordonnances_complet AS
SELECT * FROM ordonnances
NATURAL JOIN prescriptions
NATURAL JOIN medecins;

CREATE OR REPLACE VIEW info_ordonnance AS
SELECT Renouvellements, Date_maximum, Date_prescription, nom_medecin, prenom_medecin, Numero, Rue, Ville, CodePostal, Telephone, Specialite, Id_ordonnance FROM ordonnances
NATURAL JOIN medecins;

CREATE OR REPLACE VIEW utilisations_ordonnance AS
SELECT id_ordonnance, Renouvellements, Date_maximum, SUM(Delivre_en_entier = true) AS Utilisations FROM Delivre NATURAL JOIN Ordonnances
GROUP BY id_ordonnance;

CREATE OR REPLACE VIEW prescriptions_utile AS
SELECT Nom_medicament, Dosage, Duree, Prises_par_jour, Id_ordonnance
FROM Prescriptions;

CREATE OR REPLACE VIEW notes_utile AS
SELECT Contenu, Date_ecriture, Id_ordonnance, Numero, Rue, Ville, CodePostal, Telephone FROM Notes
NATURAL JOIN Pharmacies;

#------------------------------------------------------------
#       Insertions de valeurs par défaut dans la base de données
#		MedChain
#
#		Auteurs :
#			Samuel BADER, 
#			Yann COURTEMANCHE, 
#			Enzo FILANGI, 
#			Adrien GIRARD, 
#			Jonathan WITT
#------------------------------------------------------------


DELETE FROM Prescriptions;
DELETE FROM Notes;
DELETE FROM Delivre;
DELETE FROM Ordonnances;
DELETE FROM Pharmaciens;
DELETE FROM Pharmacies;
DELETE FROM Medecins;
DELETE FROM Specialites;

ALTER TABLE Medecins AUTO_INCREMENT = 1;
ALTER TABLE Pharmacies AUTO_INCREMENT = 1;
ALTER TABLE Pharmaciens AUTO_INCREMENT = 1;
ALTER TABLE Prescriptions AUTO_INCREMENT = 1;

INSERT INTO Specialites VALUES ("Généraliste");
INSERT INTO Specialites VALUES ("Cardiologue");
INSERT INTO Specialites VALUES ("Dentiste");

-- Nom_medecin, Prenom_medecin, Numero, Rue, Ville, CodePostal, Telephone, RPPS, Password, Droit_connexion, Specialite
-- Mots de passe : azerty
INSERT INTO Medecins(Nom_medecin, Prenom_medecin, Numero, Rue, Ville, CodePostal, Telephone, RPPS, Password, Droit_connexion, Specialite) VALUES ("Girard", "Adrien", "64", "Rue des Nations Unies", "Saint-Benoît", "97470", "0145875203", "00000000001", "$2b$10$bLtyV6/RHaVjUlmAw6.sCegr5WpCvGzBF4BVUdHaqRYAPjV3ime1q", True, "Généraliste");
INSERT INTO Medecins(Nom_medecin, Prenom_medecin, Numero, Rue, Ville, CodePostal, Telephone, RPPS, Password, Droit_connexion, Specialite) VALUES ("Courtemanche", "Yann", "76", "Rue Charles Corbeau", "Fécamp", "76400", "0147586932", "12345678910", "$2b$10$bLtyV6/RHaVjUlmAw6.sCegr5WpCvGzBF4BVUdHaqRYAPjV3ime1q", True, "Généraliste");
INSERT INTO Medecins(Nom_medecin, Prenom_medecin, Numero, Rue, Ville, CodePostal, Telephone, RPPS, Password, Droit_connexion, Specialite) VALUES ("Angot", "Valentin", "16", "Rue Charles Miterrant", "Montargis", "45200", "0147586932", "12345678911", "$2b$10$bLtyV6/RHaVjUlmAw6.sCegr5WpCvGzBF4BVUdHaqRYAPjV3ime1q", False, "Généraliste");

-- Numero, Rue, Ville, CodePostal, Telephone
INSERT INTO Pharmacies(Numero, Rue, Ville, CodePostal, Telephone) VALUES ("41", "Avenue Anatole France", "Choisy-le-roi", "94600", "0148847477");
INSERT INTO Pharmacies(Numero, Rue, Ville, CodePostal, Telephone) VALUES ("3", "Avenue de la République", "Villejuif", "94800", "0146788006");
INSERT INTO Pharmacies(Numero, Rue, Ville, CodePostal, Telephone) VALUES ("2", "Avenue Lucien Français", "Vitry-sur-seine", "94400", "0146825321");

-- Nom_pharmacien, Prenom_pharmacien, Numero, Rue, Ville, CodePostal, Telephone, Password, Username, Droit_connexion, Id_pharmacie
-- Mots de passe : 1234
INSERT INTO Pharmaciens(Nom_pharmacien, Prenom_pharmacien, Numero, Rue, Ville, CodePostal, Telephone, Password, Username, Droit_connexion, Id_pharmacie) VALUES ("Filangi", "Enzo", "30", "Avenue de la république", "Villejuif", "94800", "0102030405", "$2b$10$azJNEMC.zteHusdAT8Oc3epz0TX9s3khpIIed7Ys5S8EQCIswIemK", "enzo.filangi", True, 1);
INSERT INTO Pharmaciens(Nom_pharmacien, Prenom_pharmacien, Numero, Rue, Ville, CodePostal, Telephone, Password, Username, Droit_connexion, Id_pharmacie) VALUES ("Bader", "Samuel", "32", "Avenue de la république", "Villejuif", "94800", "0602030405", "$2b$10$azJNEMC.zteHusdAT8Oc3epz0TX9s3khpIIed7Ys5S8EQCIswIemK", "samuel.bader", True, 2);
INSERT INTO Pharmaciens(Nom_pharmacien, Prenom_pharmacien, Numero, Rue, Ville, CodePostal, Telephone, Password, Username, Droit_connexion, Id_pharmacie) VALUES ("Witt", "Jonathan", "15", "Rue Clement Marot", "Périgueux", "24000", "0195087238", "$2b$10$azJNEMC.zteHusdAT8Oc3epz0TX9s3khpIIed7Ys5S8EQCIswIemK", "jonathan.witt", True, 3);

-- Id_ordonnance, Identifiant_patient, Renouvellements, Date_maximum, Date_prescription, Id_medecin
-- Identifiant patient = 000000000000000 + 8d87cb1c-4806-401e-82cf-c3956135cf2d
INSERT INTO Ordonnances(Id_ordonnance, Identifiant_patient, Renouvellements, Date_maximum, Date_prescription, Id_medecin) VALUES ("483472b1-c9d7-4cf3-91c6-42530141c628", "$2b$10$Qsc6s8ikL9PWSftPWJgBhOoeu.mD3EIaPSnJgTsI.hFLROtTFT6aK", 1, "2022-06-12", "2021-06-12", 1);
INSERT INTO Ordonnances(Id_ordonnance, Identifiant_patient, Renouvellements, Date_maximum, Date_prescription, Id_medecin) VALUES ("4ef7b9c8-c94d-4fa6-ae48-ec007eba8dc6", "$2b$10$Qsc6s8ikL9PWSftPWJgBhOoeu.mD3EIaPSnJgTsI.hFLROtTFT6aK", 3, "2021-05-20", "2020-05-20", 1);
INSERT INTO Ordonnances(Id_ordonnance, Identifiant_patient, Renouvellements, Date_maximum, Date_prescription, Id_medecin) VALUES ("75f3e768-5853-446f-b739-d37f31dea755", "$2b$10$Qsc6s8ikL9PWSftPWJgBhOoeu.mD3EIaPSnJgTsI.hFLROtTFT6aK", 1, "2022-06-16", "2021-06-16", 1);
INSERT INTO Ordonnances(Id_ordonnance, Identifiant_patient, Renouvellements, Date_maximum, Date_prescription, Id_medecin) VALUES ("a32b3105-44fe-47e0-b336-39d219c71856", "$2b$10$Qsc6s8ikL9PWSftPWJgBhOoeu.mD3EIaPSnJgTsI.hFLROtTFT6aK", 5, "2021-12-04", "2021-06-04", 1);
INSERT INTO Ordonnances(Id_ordonnance, Identifiant_patient, Renouvellements, Date_maximum, Date_prescription, Id_medecin) VALUES ("47753d54-c9d0-4f9c-bd73-973d9f359422", "$2b$10$Qsc6s8ikL9PWSftPWJgBhOoeu.mD3EIaPSnJgTsI.hFLROtTFT6aK", 15, "2021-10-12", "2020-10-12", 1);
INSERT INTO Ordonnances(Id_ordonnance, Identifiant_patient, Renouvellements, Date_maximum, Date_prescription, Id_medecin) VALUES ("eb924924-2bfe-445a-a013-8be34d8c1e12", "$2b$10$Qsc6s8ikL9PWSftPWJgBhOoeu.mD3EIaPSnJgTsI.hFLROtTFT6aK", 1, "2022-03-21", "2021-03-21", 2);
INSERT INTO Ordonnances(Id_ordonnance, Identifiant_patient, Renouvellements, Date_maximum, Date_prescription, Id_medecin) VALUES ("ce8aeb44-460d-4da0-81c2-4e3d01a981d5", "$2b$10$Qsc6s8ikL9PWSftPWJgBhOoeu.mD3EIaPSnJgTsI.hFLROtTFT6aK", 1, "2022-04-01", "2021-04-01", 2);
INSERT INTO Ordonnances(Id_ordonnance, Identifiant_patient, Renouvellements, Date_maximum, Date_prescription, Id_medecin) VALUES ("64be2240-105c-4c3b-8e93-2ab4ff35fade", "$2b$10$Qsc6s8ikL9PWSftPWJgBhOoeu.mD3EIaPSnJgTsI.hFLROtTFT6aK", 1, "2021-12-05", "2020-12-05", 2);
INSERT INTO Ordonnances(Id_ordonnance, Identifiant_patient, Renouvellements, Date_maximum, Date_prescription, Id_medecin) VALUES ("287c6493-b166-49d9-9b09-d629000f5c9d", "$2b$10$Qsc6s8ikL9PWSftPWJgBhOoeu.mD3EIaPSnJgTsI.hFLROtTFT6aK", 5, "2021-08-27", "2020-08-27", 2);
INSERT INTO Ordonnances(Id_ordonnance, Identifiant_patient, Renouvellements, Date_maximum, Date_prescription, Id_medecin) VALUES ("eb4b84bb-e2f0-469b-9c69-495a3234957f", "$2b$10$Qsc6s8ikL9PWSftPWJgBhOoeu.mD3EIaPSnJgTsI.hFLROtTFT6aK", 2, "2021-01-01", "2020-01-01", 2);

-- Id_ordonnance, Id_pharmacien, Date_delivrance, Delivre_en_entier
INSERT INTO Delivre(Id_ordonnance, Id_pharmacien, Date_delivrance, Delivre_en_entier) VALUES ("483472b1-c9d7-4cf3-91c6-42530141c628", 1, "2021-06-12", False);
INSERT INTO Delivre(Id_ordonnance, Id_pharmacien, Date_delivrance, Delivre_en_entier) VALUES ("4ef7b9c8-c94d-4fa6-ae48-ec007eba8dc6", 1, "2021-05-20", True);
INSERT INTO Delivre(Id_ordonnance, Id_pharmacien, Date_delivrance, Delivre_en_entier) VALUES ("4ef7b9c8-c94d-4fa6-ae48-ec007eba8dc6", 2, "2021-06-20", True);
INSERT INTO Delivre(Id_ordonnance, Id_pharmacien, Date_delivrance, Delivre_en_entier) VALUES ("a32b3105-44fe-47e0-b336-39d219c71856", 1, "2021-06-04", True);
INSERT INTO Delivre(Id_ordonnance, Id_pharmacien, Date_delivrance, Delivre_en_entier) VALUES ("a32b3105-44fe-47e0-b336-39d219c71856", 2, "2021-07-04", True);
INSERT INTO Delivre(Id_ordonnance, Id_pharmacien, Date_delivrance, Delivre_en_entier) VALUES ("a32b3105-44fe-47e0-b336-39d219c71856", 1, "2021-08-05", True);
INSERT INTO Delivre(Id_ordonnance, Id_pharmacien, Date_delivrance, Delivre_en_entier) VALUES ("47753d54-c9d0-4f9c-bd73-973d9f359422", 1, "2020-10-12", True);
INSERT INTO Delivre(Id_ordonnance, Id_pharmacien, Date_delivrance, Delivre_en_entier) VALUES ("eb924924-2bfe-445a-a013-8be34d8c1e12", 1, "2021-03-21", True);
INSERT INTO Delivre(Id_ordonnance, Id_pharmacien, Date_delivrance, Delivre_en_entier) VALUES ("ce8aeb44-460d-4da0-81c2-4e3d01a981d5", 1, "2021-06-12", True);
INSERT INTO Delivre(Id_ordonnance, Id_pharmacien, Date_delivrance, Delivre_en_entier) VALUES ("ce8aeb44-460d-4da0-81c2-4e3d01a981d5", 1, "2021-08-14", True);
INSERT INTO Delivre(Id_ordonnance, Id_pharmacien, Date_delivrance, Delivre_en_entier) VALUES ("64be2240-105c-4c3b-8e93-2ab4ff35fade", 2, "2020-02-27", True);
INSERT INTO Delivre(Id_ordonnance, Id_pharmacien, Date_delivrance, Delivre_en_entier) VALUES ("287c6493-b166-49d9-9b09-d629000f5c9d", 1, "2021-02-27", True);
INSERT INTO Delivre(Id_ordonnance, Id_pharmacien, Date_delivrance, Delivre_en_entier) VALUES ("eb4b84bb-e2f0-469b-9c69-495a3234957f", 1, "2020-01-01", True);
INSERT INTO Delivre(Id_ordonnance, Id_pharmacien, Date_delivrance, Delivre_en_entier) VALUES ("eb4b84bb-e2f0-469b-9c69-495a3234957f", 1, "2020-07-01", True);


-- Id_ordonnance, Id_pharmacie, Contenu, Date_ecriture
INSERT INTO Notes(Id_ordonnance, Id_pharmacie, Contenu, Date_ecriture) VALUES ("483472b1-c9d7-4cf3-91c6-42530141c628", 1, "Délivré : Paracétamol", "2021-06-12");
INSERT INTO Notes(Id_ordonnance, Id_pharmacie, Contenu, Date_ecriture, Utilise) VALUES ("47753d54-c9d0-4f9c-bd73-973d9f359422", 3, "Délivré : Paracétamol", "2021-06-13",true);

-- Nom_medicament, Dosage, Duree, Prises_par_jour, Id_ordonnance
INSERT INTO Prescriptions(Nom_medicament, Dosage, Duree, Prises_par_jour, Id_ordonnance) VALUES ("Paracétamol", "1000mg", 5, 2, "483472b1-c9d7-4cf3-91c6-42530141c628");
INSERT INTO Prescriptions(Nom_medicament, Dosage, Duree, Prises_par_jour, Id_ordonnance) VALUES ("Imodium", "2mg", 4, 3, "483472b1-c9d7-4cf3-91c6-42530141c628");
INSERT INTO Prescriptions(Nom_medicament, Dosage, Duree, Prises_par_jour, Id_ordonnance) VALUES ("Ibuprofène", "400mg", 5, 2, "4ef7b9c8-c94d-4fa6-ae48-ec007eba8dc6");
INSERT INTO Prescriptions(Nom_medicament, Dosage, Duree, Prises_par_jour, Id_ordonnance) VALUES ("Spasfon", "2 comprimés", 1, 3, "75f3e768-5853-446f-b739-d37f31dea755");
INSERT INTO Prescriptions(Nom_medicament, Dosage, Duree, Prises_par_jour, Id_ordonnance) VALUES ("Paracétamol", "1000mg", 1, 2, "75f3e768-5853-446f-b739-d37f31dea755");
INSERT INTO Prescriptions(Nom_medicament, Dosage, Duree, Prises_par_jour, Id_ordonnance) VALUES ("Isimig", "1 comprimé", 1, 1, "a32b3105-44fe-47e0-b336-39d219c71856");
INSERT INTO Prescriptions(Nom_medicament, Dosage, Duree, Prises_par_jour, Id_ordonnance) VALUES ("Tahor", "1 comprimé", 30, 1, "47753d54-c9d0-4f9c-bd73-973d9f359422");
INSERT INTO Prescriptions(Nom_medicament, Dosage, Duree, Prises_par_jour, Id_ordonnance) VALUES ("Clamoxyl", "500mg", 7, 2, "eb924924-2bfe-445a-a013-8be34d8c1e12");
INSERT INTO Prescriptions(Nom_medicament, Dosage, Duree, Prises_par_jour, Id_ordonnance) VALUES ("Paracétamol", "1000mg", 7, 2, "eb924924-2bfe-445a-a013-8be34d8c1e12");
INSERT INTO Prescriptions(Nom_medicament, Dosage, Duree, Prises_par_jour, Id_ordonnance) VALUES ("Ixprim", "1 comprimé", 5, 3, "ce8aeb44-460d-4da0-81c2-4e3d01a981d5");
INSERT INTO Prescriptions(Nom_medicament, Dosage, Duree, Prises_par_jour, Id_ordonnance) VALUES ("Forlax", "10g", 3, 2, "64be2240-105c-4c3b-8e93-2ab4ff35fade");
INSERT INTO Prescriptions(Nom_medicament, Dosage, Duree, Prises_par_jour, Id_ordonnance) VALUES ("Rhinofluimucil", "2 pulvérisations", 7, 3, "287c6493-b166-49d9-9b09-d629000f5c9d");
INSERT INTO Prescriptions(Nom_medicament, Dosage, Duree, Prises_par_jour, Id_ordonnance) VALUES ("Piascledine", "300mg", 30, 1, "eb4b84bb-e2f0-469b-9c69-495a3234957f");
INSERT INTO Prescriptions(Nom_medicament, Dosage, Duree, Prises_par_jour, Id_ordonnance) VALUES ("Paracétamol", "1000mg", 30, 2, "eb4b84bb-e2f0-469b-9c69-495a3234957f");