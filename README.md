# Medchain - Projet mastercamp 2021
*Samuel BADER, Yann COURTEMANCHE, Enzo FILANGI, Adrien GIRARD, Jonathan WITT*

## Rappel du sujet

Un acte médical est souvent associé à une ordonnance émise par un professionnel de santé. Cette ordonnance est traditionnellement rédigée sur une feuille de papier. Afin -entre autres-de réduire cette consommation significative de papier, l’idéal serait de supprimer ce support physique.

Une solution pour dématérialiser les ordonnances médicales. Le but est d’avoir le même niveau de confiance dans ce document (notamment par rapport aux pharmacies et à la règlementation en vigueur), un niveau de sécurité optimal (pour éviter par exemple une modification de l’ordonnance qui peut se révéler catastrophique), et une communication encore plus fluide entre les professionnels de santé, la CPAM, les mutuelles, etc...La solution miracle serait-elle par exemple la technologie blockchain?

## Présentation de la solution

Medchain est un système visant à remplacer les ordonnances papier par une version dématérialisée.
Nous proposons un système innovant et sécurisé à destinations des médecins, des pharmacies, et de la population.

Notre système propose aux médecins de remplir une ordonnance numérique qui sera anonymisée puis stockée sur nos serveurs. Son ou sa patient(e) recevra ensuite un email contenant un code représentant cette ordonnance, qu'il ou elle pourra stocker dans une application mobile. Une fois arrivée à la pharmacie, il suffira de présenter le code que le ou la pharmacien(ne) pourra scanner afin d'obtenir le détail de l'ordonnance et délivrer les médicaments.



## Installation

#### Dépendances

- Node 14.16.1

- NPM 6.14.9

#### Installation des librairies

Commencez par cloner le repository GitHub disponible à [cette adresse](https://github.com/Samrhan/MedChain).

Ensuite, placez vous à la racine du projet, puis exécutez les commandes suivantes (cela peut prendre un moment en fonction de votre connexion internet et de la rapidité de votre disque dur) :
```Bash
$ cd server
$ npm install
$ cd ../pharmacist
$ npm install
$ cd ../doctor
$ npm install
$ cd ../client
$ npm install
```

#### Exécution

Nous conseillons d'utiliser un IDE produit par JetBrains, dans le cas présent, Webstorm. En effet, nous avons laissé dans notre repository le dossier .idea/runConfigurations dans lequel nous avons inclus l'ensemble des commandes à taper pour lancer les diverses parties du projet. Il suffit d'utiliser le menu déroulant en haut à droite pour sélectionner une composante et la lancer.

Autrement, nous avons également configuré les package.json de chaque application pour que la commande `npm start` exécute chaque programme. Cependant, il est nécessaire d'employer à la place la commande `npm start:electron` pour les application *doctor* et *pharmacist* afin d'avoir l'expérience réelle de l'utilisateur. En effet, `npm start` ouvrira l'application dans le navigateur, pratique pour le développement, tandis que `npm start:electron` ouvrira l'application dans Electron, pratique pour avoir une application de bureau.

## Delivery 
Voici nos documents de réponse à l'appel d'offre

- [Product backlog](https://docs.google.com/spreadsheets/d/1SBvTJV0y4y8bq4qgkLeObZ_JpNazzO685MI8ER3VM80/edit?usp=sharing)
- [Macro planning](https://docs.google.com/spreadsheets/d/1g5p_NwAsMYhRnEssgjeaDCxFJFGaFThBgNQYuc2Q6PU/edit?usp=sharing)

## Calendrier des livrables

Au 18 juin 2021, nous serons en mesure de présenter :
- Le product backlog
- Le digramme UML des cas d'utilisation
- Le macro-planning prévisionnel
- Les documents de conception de la base de données (MCD/MLD)
- Les premières routes de l'API
- Les premières interfaces utilisateur

