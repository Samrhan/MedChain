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
SELECT id_ordonnance, Renouvellements, Date_maximum, COUNT(*) AS Utilisations FROM Delivre NATURAL JOIN Ordonnances
GROUP BY id_ordonnance;

CREATE OR REPLACE VIEW prescriptions_utile AS
SELECT Nom_medicament, Dosage, Duree, Prises_par_jour, Id_ordonnance
FROM Prescriptions;

CREATE OR REPLACE VIEW notes_utile AS
SELECT Contenu, Date_ecriture, Id_ordonnance, Numero, Rue, Ville, CodePostal, Telephone FROM Notes
NATURAL JOIN Pharmacies;