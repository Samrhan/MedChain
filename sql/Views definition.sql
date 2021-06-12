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

CREATE OR REPLACE VIEW utilisations_ordonnance AS
SELECT id_ordonnance, Renouvellements, Date_maximum, COUNT(*) AS Utilisations FROM Delivre NATURAL JOIN Ordonnances
GROUP BY id_ordonnance;