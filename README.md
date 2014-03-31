# Babble - Phonegap App #

Deze repo bevat de Phonegap app die gebruikt wordt als client voor de Babble backend. [Download laatste build](https://build.phonegap.com/apps/850932/share).

## Inhoud ##

- [Bestanden structuur](#bestanden-structuur)
	- [Phonegap Build](#phonegap-build)
	- [Angular](#angular)
	- [Overig](#overig)

## Bestanden structuur ##

### Phonegap Build ###

Phonegap Build projecten moeten bestaan uit een `www/` folder met daarin een `index.html` (wordt opgestart bij het openen van de app), `config.xml` (configuratie voor het build proces) en een map met icoontjes voor de app, `res/`.

### Angular ###

Angular projecten bestaan doorgaans uit een `app.js` met alle app configuratie, die in ons geval aangevraagd wordt door `index.html`. Daarnaast bevat de map `app` alle angular controllers, factories en views.

### Overig ###

`www/libs/` bevat alle Javascript libraries die we nodig hebben, zoals jQuery, Angular en Hammer. Daanaast bevat `www/` ook mappen met CSS-bestanden, lettertypes en afbeeldingen.