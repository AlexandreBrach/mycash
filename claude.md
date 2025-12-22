# Architecture

## Docker compose

Se référer au fichier docker-compose pour :

- connaitre les routes et les ports accessible de l'extérieur : le backend est accessible via localhost:$APPLICATION_PORT

# Règle de code

## Typescript

- pas de export default sans pour les composants react (préférer une synthaxe `export const`)
- les noms des interfaces doivent avoir pour suffixe le mot `Interface`. L'implémentation principale doit avoir le même nom, sans le mot `Interface`.

## Backend

- l'application utilise yarn
- category are represented in database as a Preorder Tree Traversal

## Database

- pour se connecter à la base, utiliser le container db

## Backend

- aucun fichier ne doit s'appeller 'index.ts'
- les routes sont définies içi : `./backend-express/code/src/routes/`
- l'accès au services depuis les controlleurs se fait via `res.locals.factory`
- les routers express sont instanciés par la fabrique `./backend-express/code/src/routes/RouteFactory.ts`
- les middlewares express sont instanciés par la fabrique `./backend-express/code/src/middlewares/factoryMiddleware.ts`
