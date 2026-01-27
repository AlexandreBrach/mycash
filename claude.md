Ne jamais faire de commit.
Ne pas formatter le code.

# Architecture

## Docker compose

Conformement au fichier `docker-compose.yml` et au fichier `.env` :

- le backend est accessible via localhost:$APPLICATION_PORT
- le backend est buildé automatiquement à chaque modification de code, inutile de relancer le serveur

## Database

- pour se connecter à la base de donnée, utiliser la commande `psql` comme suit : `docker compose exec db psql -U alex -d comptes`

## Backend Express

### Repositories

- Utiliser `GenericRepository<T>` pour les entités TypeORM par défaut
- Ne créer un repository spécifique que si des méthodes custom sont nécessaires
- Pattern: `const service = Service(GenericRepository<Entity>(EntityOrmRepository))`

# Règle de code

## Typescript

- pas de export default sans pour les composants react (préférer une synthaxe `export const`)
- les noms des interfaces doivent avoir pour suffixe le mot `Interface`. L'implémentation principale doit avoir le même nom, sans le mot `Interface`.

## Backend

- le backend en python dans le dossier `backend` est legacy : il est non fonctionnel et ne doit pas être modifié
- l'application utilise yarn
- category are represented in database as a Preorder Tree Traversal
- aucun fichier ne doit s'appeller 'index.ts'
- les routes sont définies içi : `./backend-express/code/src/routes/`
- l'accès au services depuis les controlleurs se fait via `res.locals.factory`
- les routers express sont instanciés par la fabrique `./backend-express/code/src/routes/RouteFactory.ts`
- les middlewares express sont instanciés par la fabrique `./backend-express/code/src/middlewares/factoryMiddleware.ts`
- les repository utilisent GenericRepository tant qu'il n'y a rien d'autre que du CRUD basique à effectuer.

**IMPORTANT** : Ne PAS créer de repository custom pour du CRUD basique. Utiliser `GenericRepository` tant qu'il n'y a que des opération
s CRUD standards à effectuer.

Le GenericRepository fournit automatiquement :

- getAll() - récupère toutes les entités
- getById(id) - récupère par ID
- find(filter) - recherche avec options TypeORM
- create(data) - crée une nouvelle entité
- update(id, data) - met à jour
- delete(id) - supprime

Quand créer un repository custom

Créer un repository custom UNIQUEMENT si :

- Besoin de requêtes SQL complexes (jointures multiples, agrégations)
- Besoin de méthodes métier spécifiques (ex: getDistinctMonths())
- Besoin de logique custom qui ne rentre pas dans le CRUD standard

Voir ExtraitRepository.ts pour un exemple de repository custom.
