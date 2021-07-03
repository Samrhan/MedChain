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

- [NodeJS 14](https://nodejs.org/fr/)

- NPM 6

- [Angular CLI 11](https://angular.io/cli)

- [MySQL 8](https://dev.mysql.com/downloads/installer/)

#### Installation

Commencez par cloner le repository GitHub disponible à [cette adresse](https://github.com/Samrhan/MedChain).

#### Librairies
Placez vous à la racine du projet, puis exécutez les commandes suivantes (cela peut prendre un moment en fonction de votre connexion internet et de la rapidité de votre disque dur) :
```Bash
$ cd server
$ npm install
$ cd ../pharmacist
$ npm install
$ cd ../doctor
$ npm install
$ cd ../patient
$ npm install
```
#### Base de données
Veuillez exécuter le script `Database Initialize.sql` situé dans "MedChain\sql" pour recréer la base de données. Par la suite, si vous souhaitez rétablir les valeurs par défaut, veuillez exécuter le script `Default values.sql` situé dans "MedChain\sql\other scripts"

## Exécution

Nous conseillons d'utiliser un IDE produit par JetBrains, dans le cas présent, Webstorm. En effet, nous avons laissé dans notre repository le dossier .idea/runConfigurations dans lequel nous avons inclus l'ensemble des commandes à taper pour lancer les diverses parties du projet. Il suffit d'utiliser le menu déroulant en haut à droite pour sélectionner une composante et la lancer.

Autrement, nous avons également configuré les package.json de chaque application pour que la commande `npm start` exécute chaque programme. Cependant, il est nécessaire d'employer à la place la commande `npm start:electron` pour les application *doctor* et *pharmacist* afin d'avoir l'expérience réelle de l'utilisateur. En effet, `npm start` ouvrira l'application dans le navigateur, pratique pour le développement, tandis que `npm start:electron` ouvrira l'application dans Electron, pratique pour avoir une application de bureau.

À noter que procéder ainsi lancera l'application patient dans votre navigateur. Pour l'utiliser correctement, il vous sera nécéssaire d'ouvrir les DevTools de votre navigateur (crtl + shift + i) pour émuler un appareil mobile (dimensions recommandées, 360\*640). Si vous souhaitez y avoir accès depuis votre téléphone, vous pouvez vous rendre sur https://medchain.sbader.fr/

## Essayer les applications

### Avec des données prédéfinies

Voici une liste d'identifiants afin de pouvoir tester les applications

- Médecin
  - Identifiant : 00000000001
  - Mot de passe : azerty

- Pharmacien
  - Identifiant : enzo.filangi
  - Mot de passe : 1234

Voici également quelques ordonnances de test

- Ordonnance 1
  - Token : 483472b1-c9d7-4cf3-91c6-42530141c628
  - Mot de passe : 8d87cb1c-4806-401e-82cf-c3956135cf2d
  - Numéro de sécurité sociale : 000000000000000
- Ordonnance 2
  - Token : 4ef7b9c8-c94d-4fa6-ae48-ec007eba8dc6
  - Mot de passe : 8d87cb1c-4806-401e-82cf-c3956135cf2d
  - Numéro de sécurité sociale : 000000000000000
- Ordonnance 3
  - Token : 75f3e768-5853-446f-b739-d37f31dea755
  - Mot de passe : 8d87cb1c-4806-401e-82cf-c3956135cf2d
  - Numéro de sécurité sociale : 000000000000000

Afin de tester le bon fonctionnement de l'application Patient, nous recommandons le logiciel [BarcodeToPc](https://barcodetopc.com/) qui permet de transformer votre téléphone en scanner de code barre. Pour que ce workflow fonctionne, vous aurez cependant besoin de deux téléphones (un pour afficher le code grâce à l'application patient, l'autre pour lire le code). Il vous suffit ensuite sur le PC de lancer l'application Pharmacien, puis de placer votre curseur sur le premier champ dans l'écran d'entré des informations de l'ordonnance, et de scanner le code barre avec votre téléphone.

Si cela est impossible, vous pouvez afficher [ce code barre](https://drive.google.com/file/d/1rH7d3CfTboeM-9xdkvo-4zZq3zxinCTf/view?usp=sharing) sur votre écran de PC et le scanner. Ou bien copier/coller le texte suivant dans le premier champ de l'écran d'entré des informations de l'ordonnance de l'application Pharmacien : `47753d54-c9d0-4f9c-bd73-973d9f359422/8d87cb1c-4806-401e-82cf-c3956135cf2d`

L'application Patient dispose de deux moyens d'ajouter une ordonnance : en scannant un code, ou en cliquant sur le lien du mail. Cette seconde option n'est disponible à ce jour que pour des téléphones Android.

### Avec l'expérience utilisateur visée

1. Tout d'abord, veuillez lancer l'application médecin puis vous connecter.

2. Renseignez ensuite les champs de l'ordonnance, le mail du patient, et son numéro de sécurité sociale. Ces deux dernières informations seront importantes par la suite, conservez les donc quelque part.

3. Installez ensuite l'application patient sur votre téléphone. Un lien vers le site d'installation est contenu dans le mail que vous avez dû recevoir à l'addresse spécifiée à l'étape 2. Cliquez ensuite sur le lien contenu dans le mail ou bien scannez le code en pièce jointe. Si cela est impossible, ouvrez le code barre reçu dans la pièce jointe du mail sur votre pc.

4. Ouvrez ensuite l'application pharmacien, et connectez vous.

5. Vous pouvez alors utiliser l'application patient pour afficher le code barre en grand. Placez votre curseur dans le premier champ de texte et scannez ce code (ou l'image ouverte sur votre PC). Renseignez ensuite le numéro de sécurité sociale de l'étape 2.

6. Vous devriez désormais voir le contenu de l'ordonnance que vous avez renseigné à l'étape 2. Vous pouvez alors jouer le rôle du pharmacien et indiquer que vous avez délivré l'ordonnance en entier, ou bien ajouter une note pour indiquer à tous les pharmaciens que vous n'avez délivré qu'une partie seulement des médicaments.

## Suites de tests unitaires

Pour ce projet, nous avons rédigé des tests unitaires afin de s'assurer que chaque partie de chaque application fonctionne correctement. Nous avons ainsi réalisé plus de 250 tests que vous pouvez vous aussi lancer afin de vérifier que tout fonctionne correctement.

Pour ce faire, placez vous dans chaque sous-dossier, ouvrez un terminal, et entrez les commandes suivantes :

- `ng test --code_coverage` pour les applications Médecin, Pharmacien, et Patient
- `npm test` pour le serveur

Ces commandes génèrent également des rapports de *code coverage*. Ils indiquent quelle surface de notre code est couverte par des tests. Comme vous pourrez le constater en ouvrant le fichier index.html contenu dans les dossiers `coverage` ayant fait leur appartition, chaque application est couverte à 100% par des tests. Ainsi, nous pouvons avoir une confiance importante en la qualité de notre code et le fait qu'il réponde correctement au cahier des charges sans négliger de cas limite.
ATTENTION: Le test du serveur resetera votre base de donné.

## Delivery 
Voici nos documents de réponse à l'appel d'offre

- [Product backlog](https://docs.google.com/spreadsheets/d/1SBvTJV0y4y8bq4qgkLeObZ_JpNazzO685MI8ER3VM80/edit?usp=sharing)
- [Macro planning](https://docs.google.com/spreadsheets/d/1g5p_NwAsMYhRnEssgjeaDCxFJFGaFThBgNQYuc2Q6PU/edit?usp=sharing)

Vous pourrez également retrouver tous nos documents de conception

- [Liste des routes API](https://docs.google.com/spreadsheets/d/1nEHplq5ywhcbzmP-eloZyetQ8L_T3khuem05Y0tcaFY/edit?usp=sharing)
- [Diagramme UML des cas d'utilisation](https://drive.google.com/file/d/1oNMKI7QgM-aiQCplPbSInRWrZBxai-sB/view?usp=sharing)
- [Concepts d'interface application Patient](https://www.figma.com/file/YGE4sKjorCj9XLTtz2lSVb/MedChain-application-patient?node-id=0%3A1)
- [Concepts d'interface application Pharmcien](https://www.figma.com/file/tjV8CQiEugjeyHAQhh27e5/Application-Pharmacien)
- [Concepts d'interface application Médecin](https://www.figma.com/file/8lGBBpNKDdPkD1RP7O1dWa/Logiciel-M%C3%A9decin)

## Calendrier des livrables

Au 18 juin 2021, nous serons en mesure de présenter :
- Le product backlog
- Le digramme UML des cas d'utilisation
- Le macro-planning prévisionnel
- Les documents de conception de la base de données (MCD/MLD)
- Les premières routes de l'API
- Les premières interfaces utilisateur

Au 9 Juillet, nous serons en mesure de présenter :
- L'ensemble des documents de conception
- L'écosystème totalement déployé
- Le code source de toutes les applications
