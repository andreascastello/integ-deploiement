#!/bin/bash

echo "🚀 Démarrage de l'application complète..."

# Vérifier si le fichier .env existe
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env à partir de env.example..."
    cp env.example .env
    echo "✅ Fichier .env créé !"
fi

# Vérifier que le dossier express-mongodb-app existe
if [ ! -d "../express-mongodb-app" ]; then
    echo "❌ Erreur: Le dossier ../express-mongodb-app n'existe pas"
    echo "   Assurez-vous que le projet express-mongodb-app est dans le même répertoire parent"
    exit 1
fi

# Arrêter les conteneurs existants
echo "🛑 Arrêt des conteneurs existants..."
docker compose -f docker-compose-v4-mongo.yml down

# Construire et démarrer les services
echo "🔨 Construction et démarrage des services..."
docker compose -f docker-compose-v4-mongo.yml up --build -d

echo "⏳ Attente du démarrage des services..."
sleep 10

# Afficher les logs
echo "📋 Logs des services :"
docker compose -f docker-compose-v4-mongo.yml logs --tail=20

echo ""
echo "🎉 Application démarrée !"
echo ""
echo "📱 Frontend React: http://localhost:3000"
echo "🔧 Backend FastAPI: http://localhost:8000"
echo "📝 API Node.js: http://localhost:3001"
echo "🗄️  Adminer (MySQL): http://localhost:8081"
echo "📊 Mongo Express: http://localhost:8082"
echo ""
echo "Pour voir les logs en temps réel :"
echo "docker-compose -f docker-compose-v4-mongo.yml logs -f" 