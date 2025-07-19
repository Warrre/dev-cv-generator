#!/bin/bash

echo "🚀 Démarrage rapide du CV Generator"
echo "=================================="

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    echo "Installez Node.js depuis https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js détecté: $(node --version)${NC}"

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm n'est pas installé${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm détecté: $(npm --version)${NC}"

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installation des dépendances...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Échec de l'installation des dépendances${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Dépendances installées${NC}"
else
    echo -e "${GREEN}✅ Dépendances déjà installées${NC}"
fi

# Créer le dossier generated s'il n'existe pas
mkdir -p backend/generated
echo -e "${GREEN}✅ Dossier de génération créé${NC}"

# Rendre le script de test exécutable
chmod +x test_api.sh
echo -e "${GREEN}✅ Script de test configuré${NC}"

echo ""
echo -e "${YELLOW}🎯 Prêt à démarrer !${NC}"
echo ""
echo "Commandes disponibles:"
echo "  npm start     - Démarrer le serveur"
echo "  npm run dev   - Démarrer en mode développement"
echo "  ./test_api.sh - Tester l'API"
echo ""
echo "Une fois démarré, ouvrez: http://localhost:3000"
echo ""

# Proposer de démarrer immédiatement
read -p "Voulez-vous démarrer le serveur maintenant ? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}🚀 Démarrage du serveur...${NC}"
    npm start
fi
