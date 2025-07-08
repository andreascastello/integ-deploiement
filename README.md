# 🎨 Front-end React + Back-end Python/FastAPI

## 📋 Vue d'ensemble

Ce projet combine un **front-end React** moderne avec un **back-end Python/FastAPI** pour créer une application web complète avec authentification, gestion d'utilisateurs et interface utilisateur responsive.

## 🏗️ Architecture

### Front-end React
- **Framework** : React 19 avec Vite
- **Styling** : CSS moderne avec animations
- **Tests** : Vitest (unitaires) + Cypress (E2E)
- **Build** : Vite pour la production

### Back-end Python/FastAPI
- **Framework** : FastAPI avec Uvicorn
- **Base de données** : MySQL
- **Authentification** : JWT avec rôles admin
- **API** : RESTful avec documentation automatique

## 🚀 Installation et lancement

### Prérequis
- Node.js 18+
- Python 3.11+
- Docker et Docker Compose
- MySQL (optionnel pour le développement local)

### 1. Installation des dépendances

```bash
# Front-end React
cd integ-deploiement
npm install

# Back-end Python
cd server
pip install -r requirements.txt
```

### 2. Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Front-end
VITE_API_URL=http://localhost:8000
VITE_NODE_API_URL=http://localhost:3000

# Back-end Python
MYSQL_HOST=localhost
MYSQL_DATABASE=users
MYSQL_USER=root
MYSQL_PASSWORD=password
JWT_SECRET=your-secret-key
```

## 🐳 Déploiement avec Docker

### Architecture Docker complète

Le projet inclut plusieurs configurations Docker :

#### 1. Architecture principale (React + Python + MySQL + Adminer)

```bash
# Lancer l'architecture complète
docker-compose up --build

# Services disponibles :
# - Front React : http://localhost:3000
# - Back Python : http://localhost:8000
# - MySQL : localhost:3306
# - Adminer : http://localhost:8080
```

#### 2. Architecture avec MongoDB

```bash
# Lancer avec MongoDB
docker-compose -f docker-compose-v4-mongo.yml up --build
```

#### 3. Architecture de test

```bash
# Lancer les tests
docker-compose -f docker-compose-test.yml up --build
```

### Configuration Docker

#### Front-end React
```dockerfile
# DockerfileReact
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

#### Back-end Python
```dockerfile
# DockerfilePython
FROM python:3.11
WORKDIR /server
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🧪 Tests

### Tests Front-end (React)

#### Tests unitaires avec Vitest
```bash
# Lancer les tests unitaires
npm test

# Tests avec coverage
npm run coverage

# Tests en mode watch
npm run test:watch
```

#### Tests E2E avec Cypress
```bash
# Ouvrir Cypress
npm run cypress

# Lancer les tests E2E
npx cypress run
```

**Tests E2E disponibles :**
- `basic.cy.js` - Tests de base de l'interface
- `formulaire.cy.js` - Tests du formulaire d'inscription
- `admin-auth.cy.js` - Tests d'authentification admin
- `blog.cy.js` - Tests d'affichage des blogposts
- `integration-flow.cy.js` - Tests d'intégration complète

### Tests Back-end (Python)

```bash
# Tests unitaires
cd server
python -m pytest

# Tests avec coverage
python -m pytest --cov=server
```

## 📊 Fonctionnalités

### Front-end React
- ✅ **Formulaire d'inscription** avec validation
- ✅ **Affichage des utilisateurs** (liste publique)
- ✅ **Interface admin** avec authentification
- ✅ **Affichage des blogposts** depuis l'API Node.js
- ✅ **Design responsive** et moderne
- ✅ **Gestion des erreurs** et états de chargement

### Back-end Python/FastAPI
- ✅ **API RESTful** avec documentation automatique
- ✅ **Authentification JWT** avec rôles
- ✅ **Gestion des utilisateurs** (CRUD)
- ✅ **Connexion MySQL** avec pool de connexions
- ✅ **Validation des données** avec Pydantic
- ✅ **CORS** configuré pour le front-end

## 🔧 Scripts utiles

### Développement
```bash
# Front-end en mode développement
npm run dev

# Back-end en mode développement
cd server
uvicorn server:app --reload --host 0.0.0.0 --port 8000

# Build de production
npm run build
```

### Déploiement
```bash
# Build Docker
docker build -f DockerfileReact -t react-app .
docker build -f server/DockerfilePython -t python-api .

# Déploiement Scalingo
./deploy-scalingo.sh
```

## 📁 Structure du projet

```
integ-deploiement/
├── src/                    # Code source React
│   ├── components/         # Composants React
│   ├── utils/             # Utilitaires
│   └── assets/            # Images et ressources
├── server/                # Back-end Python
│   ├── server.py          # Point d'entrée FastAPI
│   ├── requirements.txt   # Dépendances Python
│   └── Procfile          # Configuration Scalingo
├── cypress/               # Tests E2E
│   ├── e2e/              # Tests Cypress
│   └── fixtures/         # Données de test
├── public/                # Fichiers statiques
├── docker-compose.yml     # Architecture Docker principale
├── docker-compose-test.yml # Architecture de test
└── package.json           # Configuration Node.js
```

## 🔐 Sécurité

- **Variables d'environnement** séparées pour dev/prod
- **Authentification JWT** sécurisée
- **Validation des données** côté serveur
- **CORS** configuré pour les domaines autorisés
- **Secrets** gérés via GitHub Secrets

## 🚀 Déploiement Scalingo

### Configuration automatique
Le déploiement se fait automatiquement via GitHub Actions :

1. **Build de l'application React**
2. **Déploiement via Git SSH** sur Scalingo
3. **Configuration des variables d'environnement**

### Variables d'environnement Scalingo
```env
VITE_API_URL=https://fastapi-mysql-api-enzo.osc-fr1.scalingo.io
VITE_NODE_API_URL=https://express-mongodb-api-enzo.osc-fr1.scalingo.io
NODE_ENV=production
```

## 📚 API Documentation

### Endpoints FastAPI

#### Authentification
- `POST /login` - Connexion admin
- `POST /register` - Inscription utilisateur

#### Utilisateurs
- `GET /users` - Liste des utilisateurs (admin)
- `GET /public-users` - Liste publique des utilisateurs
- `DELETE /users` - Suppression utilisateur (admin)

### Documentation interactive
- **Swagger UI** : `http://localhost:8000/docs`
- **ReDoc** : `http://localhost:8000/redoc`

## 🐛 Dépannage

### Problèmes courants

#### Front-end ne se connecte pas au back-end
- Vérifiez `VITE_API_URL` dans `.env`
- Vérifiez que le back-end est démarré
- Vérifiez les logs CORS

#### Erreurs de base de données
- Vérifiez la connexion MySQL
- Vérifiez les variables d'environnement
- Vérifiez les migrations SQL

#### Tests qui échouent
- Vérifiez que tous les services sont démarrés
- Vérifiez les variables d'environnement de test
- Relancez les conteneurs Docker

**🎯 Objectif atteint** : Application web complète avec front-end React moderne, back-end Python robuste, tests automatisés et déploiement Scalingo.