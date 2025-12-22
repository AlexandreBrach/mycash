# Feature : Entity et Repository Prevision

## Contexte

Créer une entité TypeORM et un repository pour la table `comptes_prev` qui stocke les prévisions de dépenses.

## Structure de la table `comptes_prev`

```sql
Table "public.comptes_prev"
    Column    |     Type     |                         Modifiers
--------------+--------------+-----------------------------------------------------------
 id           | integer      | not null default nextval('comptes_prev_id_seq'::regclass)
 due_date     | date         | not null
 amount       | numeric(9,2) | not null
 categorie_id | integer      | not null

Indexes:
    "comptes_prev_pkey" PRIMARY KEY, btree (id)
    "comptes_prev_categorie_id_79f60579" btree (categorie_id)

Foreign-key constraints:
    "comptes_prev_categorie_id_79f60579_fk_comptes_categorie_id"
    FOREIGN KEY (categorie_id) REFERENCES comptes_categorie(id)
    DEFERRABLE INITIALLY DEFERRED
```

## Plan d'implémentation

### 1. Créer l'entité Prevision

**Fichier**: `backend-express/code/src/infra/typeorm/prevision/prevision.ts`

Structure à implémenter :
- `@Entity('comptes_prev')` : mapping sur la table
- `id`: PrimaryGeneratedColumn
- `due_date`: Date (not null) - date d'échéance de la prévision
- `amount`: number (decimal 9,2, not null) - montant de la prévision
- `categorie_id`: number (not null) - ID de la catégorie
- `categorie`: relation ManyToOne vers Category avec JoinColumn

Points d'attention :
- Utiliser les mêmes conventions que l'entité Encours (fichier de référence: `encours/encours.ts`)
- Le champ `amount` doit être de type `decimal` avec precision: 9, scale: 2
- La relation avec Category doit utiliser `@ManyToOne` et `@JoinColumn({ name: 'categorie_id' })`
- Tous les champs requis doivent avoir le modificateur `!` (non-null assertion)

### 2. Utiliser GenericRepository

**Important** : Selon les règles du projet (claude.md), ne PAS créer de repository custom pour du CRUD basique.

Le repository sera instancié via GenericRepository qui fournit automatiquement :
- `getAll()` - récupérer toutes les prévisions
- `getById(id)` - récupérer par ID
- `find(filter)` - recherche avec options TypeORM
- `create(data)` - créer une nouvelle prévision
- `update(id, data)` - mettre à jour
- `delete(id)` - supprimer

### 3. Enregistrer l'entité dans ormconfig.ts

**Fichier**: `backend-express/code/src/infra/typeorm/ormconfig.ts`

Actions :
- Importer l'entité Prevision
- Ajouter Prevision dans le tableau `entities` de AppDataSource

### 4. Créer le service PrevisionService (si nécessaire)

**Fichier**: `backend-express/code/src/services/PrevisionService.ts` (à créer)

Le service doit :
- Recevoir le repository TypeORM en injection
- Utiliser GenericRepository pour encapsuler les opérations CRUD
- Exposer une interface PrevisionServiceInterface

Structure type :
```typescript
export interface PrevisionServiceInterface {
  getAll(): Promise<Prevision[]>;
  getById(id: number): Promise<Prevision | null>;
  create(data: Prevision): Promise<Prevision>;
  update(id: number, data: Partial<Prevision>): Promise<Prevision | null>;
  delete(id: number): Promise<void>;
}
```

### 5. Intégrer dans les factories

**Fichiers à modifier** :
- Factory de services (à identifier dans le projet)
- Factory de middlewares si nécessaire (`middlewares/factoryMiddleware.ts`)

L'accès au service depuis les contrôleurs doit se faire via `res.locals.factory`.

## Critères de validation

- [ ] L'entité Prevision est créée avec tous les champs et relations
- [ ] L'entité est enregistrée dans ormconfig.ts
- [ ] Le service utilise GenericRepository (pas de repository custom)
- [ ] Les types TypeScript sont corrects (no `any`)
- [ ] Les noms suivent les conventions : interface avec suffixe `Interface`
- [ ] L'application démarre sans erreur
- [ ] Les opérations CRUD de base fonctionnent via le service

## Références

- Entité similaire : `backend-express/code/src/infra/typeorm/encours/encours.ts`
- GenericRepository : `backend-express/code/src/infra/typeorm/GenericRepository.ts`
- Configuration : `backend-express/code/src/infra/typeorm/ormconfig.ts`
- Règles du projet : `claude.md`
