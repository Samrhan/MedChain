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
        Identifiant_patient TinyBlob NOT NULL ,
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
        Id_ordonnance   Char(36) NOT NULL ,
        Id_pharmacien   Int NOT NULL ,
        Date_delivrance Datetime NOT NULL
	,CONSTRAINT Delivre_PK PRIMARY KEY (Id_ordonnance,Id_pharmacien,Date_delivrance)

	,CONSTRAINT Delivre_Ordonnances_FK FOREIGN KEY (Id_ordonnance) REFERENCES Ordonnances(Id_ordonnance)
	,CONSTRAINT Delivre_Pharmacien0_FK FOREIGN KEY (Id_pharmacien) REFERENCES Pharmaciens(Id_pharmacien)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Note
#------------------------------------------------------------

CREATE TABLE Notes(
        Id_ordonnance Char(36) NOT NULL ,
        Id_pharmacie  Int NOT NULL ,
        Contenu       Text NOT NULL ,
        Date_ecriture Date NOT NULL
	,CONSTRAINT Note_PK PRIMARY KEY (Id_ordonnance,Id_pharmacie)

	,CONSTRAINT Note_Ordonnances_FK FOREIGN KEY (Id_ordonnance) REFERENCES Ordonnances(Id_ordonnance)
	,CONSTRAINT Note_Pharmacie0_FK FOREIGN KEY (Id_pharmacie) REFERENCES Pharmacies(Id_pharmacie)
)ENGINE=InnoDB;

