#!/bin/bash

# Script de test pour l'API CV Generator
echo "🧪 Test de l'API CV Generator"
echo "================================"

# URL de base de l'API
BASE_URL="http://localhost:3000"

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les résultats
show_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Test 1: Vérifier que le serveur répond
echo -e "${YELLOW}📡 Test 1: Vérification du serveur...${NC}"
response=$(curl -s -w "%{http_code}" -o /dev/null "$BASE_URL/api/health")
if [ "$response" = "200" ]; then
    show_result 0 "Serveur accessible"
else
    show_result 1 "Serveur non accessible (code: $response)"
    echo "⚠️  Assurez-vous que le serveur est démarré avec 'npm start'"
    exit 1
fi

# Test 2: Test de génération de CV avec données valides
echo -e "${YELLOW}📝 Test 2: Génération de CV avec données valides...${NC}"
cat > test_cv_data.json << EOF
{
    "firstName": "Jean",
    "name": "Dupont",
    "email": "jean.dupont@example.com",
    "linkedin": "https://linkedin.com/in/jeandupont",
    "github": "https://github.com/jeandupont",
    "profile": "Développeur passionné avec 3 ans d'expérience en développement web full-stack.",
    "skills": ["JavaScript", "React", "Node.js", "Python", "Docker"],
    "experiences": [
        {
            "position": "Développeur Full-Stack",
            "company": "TechCorp",
            "startDate": "2022",
            "endDate": "2024",
            "description": "Développement d'applications web modernes avec React et Node.js"
        }
    ],
    "projects": [
        {
            "name": "E-commerce Platform",
            "description": "Plateforme e-commerce complète avec paiement en ligne",
            "technologies": "React, Node.js, MongoDB"
        }
    ],
    "diploma": "Master en Informatique - Université de Paris",
    "languages": "Français (natif), Anglais (courant), Espagnol (notions)"
}
EOF

response=$(curl -s -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d @test_cv_data.json \
    "$BASE_URL/api/generate-cv")

http_code=$(echo "$response" | tail -c 4)
response_body=$(echo "$response" | sed '$ s/...$//')

if [ "$http_code" = "200" ]; then
    show_result 0 "Génération de CV réussie"
    echo "📄 Réponse: $response_body"
else
    show_result 1 "Échec de la génération (code: $http_code)"
    echo "📄 Erreur: $response_body"
fi

# Test 3: Test avec données invalides
echo -e "${YELLOW}❌ Test 3: Test avec données invalides...${NC}"
cat > test_invalid_data.json << EOF
{
    "firstName": "",
    "name": "Dupont",
    "email": "email-invalide",
    "linkedin": "url-invalide"
}
EOF

response=$(curl -s -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d @test_invalid_data.json \
    "$BASE_URL/api/generate-cv")

http_code=$(echo "$response" | tail -c 4)
response_body=$(echo "$response" | sed '$ s/...$//')

if [ "$http_code" = "400" ]; then
    show_result 0 "Validation des erreurs fonctionne"
    echo "📄 Erreurs détectées: $response_body"
else
    show_result 1 "La validation devrait rejeter ces données"
fi

# Test 4: Test de limite de taux (rate limiting)
echo -e "${YELLOW}⏱️ Test 4: Test de limitation de taux...${NC}"
echo "Envoi de 5 requêtes rapides..."

for i in {1..5}; do
    response=$(curl -s -w "%{http_code}" -X POST \
        -H "Content-Type: application/json" \
        -d @test_cv_data.json \
        "$BASE_URL/api/generate-cv")
    
    http_code=$(echo "$response" | tail -c 4)
    echo "Requête $i: HTTP $http_code"
    
    if [ "$http_code" = "429" ]; then
        show_result 0 "Rate limiting activé"
        break
    fi
done

# Nettoyage
rm -f test_cv_data.json test_invalid_data.json

echo ""
echo -e "${GREEN}🎉 Tests terminés!${NC}"
echo ""
echo "📋 Pour tester manuellement:"
echo "1. Démarrez le serveur: npm start"
echo "2. Ouvrez http://localhost:3000 dans votre navigateur"
echo "3. Remplissez le formulaire et générez un CV"
echo ""
echo "📁 Les CV générés sont sauvegardés dans: backend/generated/"
