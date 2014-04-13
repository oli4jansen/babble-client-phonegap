# Babble - Phonegap App #

Deze repo bevat de Phonegap app die gebruikt wordt als client voor de Babble backend. Wanneer een commit naar deze repo gepushed is, wordt automatisch een nieuwe build gecompiled van de laatste source code. [Download laatste build](https://build.phonegap.com/apps/850932/share). Deze build zijn echter niet altijd verzekerd van stabiliteit. __Download [hier](https://github.com/oli4jansen/babble-client-phonegap/releases) de laatste release__, waarvan verzekerd is dat hij stabiel is.

## Inhoud ##

- [Bestanden structuur](#bestanden-structuur)
	- [Phonegap Build](#phonegap-build)
	- [Angular](#angular)
	- [Overig](#overig)
- [API](#api)

## Bestanden structuur ##

### Phonegap Build ###

Phonegap Build projecten moeten bestaan uit een `www/` folder met daarin een `index.html` (wordt opgestart bij het openen van de app), `config.xml` (configuratie voor het build proces) en een map met icoontjes voor de app, `res/`.

### Angular ###

Angular projecten bestaan doorgaans uit een `app.js` met alle app configuratie, die in ons geval aangevraagd wordt door `index.html`. Daarnaast bevat de map `app` alle angular controllers, factories en views.

### Overig ###

`www/libs/` bevat alle Javascript libraries die we nodig hebben, zoals jQuery, Angular en Hammer. Daanaast bevat `www/` ook mappen met CSS-bestanden, lettertypes en afbeeldingen.

## API ##

De API die we gebruiken is een NodeJS server die de laatste versie van de [babble-server](https://github.com/oli4jansen/babble-server/) Git repo draaien. Zie de [bijbehorende Github pagina](https://github.com/oli4jansen/babble-server/) voor meer info over deze repo.
