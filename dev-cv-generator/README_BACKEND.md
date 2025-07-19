# 🚀 CV Generator Backend

Backend Node.js pour le générateur de CV de développeurs. Ce serveur fournit une API REST pour générer des CV en PDF à partir des données de formulaire.

## 🎯 Fonctionnalités

- ✅ API REST pour la génération de CV
- ✅ Validation des données côté serveur
- ✅ Génération de PDF avec Puppeteer
- ✅ Templates HTML personnalisables
- ✅ Rate limiting pour éviter l'abus
- ✅ Support CORS pour frontend séparé
- ✅ Gestion d'erreurs robuste
- ✅ Tests automatisés

## 🛠️ Installation

### Prérequis
- Node.js 16+ 
- npm ou yarn

### Installation des dépendances

```bash
npm install
```

### Démarrage du serveur

```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

Le serveur démarre sur `http://localhost:3000`

## 📡 API Endpoints

### `GET /api/health`
Test de santé de l'API
```json
{
  "status": "OK",
  "message": "API CV Generator fonctionne correctement",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### `POST /api/generate-cv`
Génère un CV en PDF à partir des données JSON

**Body attendu:**
```json
{
  "firstName": "Jean",
  "name": "Dupont", 
  "email": "jean.dupont@example.com",
  "linkedin": "https://linkedin.com/in/jeandupont",
  "github": "https://github.com/jeandupont",
  "profile": "Développeur passionné...",
  "skills": ["JavaScript", "React", "Node.js"],
  "experiences": [
    {
      "position": "Développeur Full-Stack",
      "company": "TechCorp",
      "startDate": "2022",
      "endDate": "2024",
      "description": "Description de l'expérience"
    }
  ],
  "projects": [
    {
      "name": "Mon Projet",
      "description": "Description du projet",
      "technologies": "React, Node.js"
    }
  ],
  "diploma": "Master Informatique",
  "languages": "Français, Anglais"
}
```

**Réponse de succès:**
```json
{
  "success": true,
  "message": "CV généré avec succès!",
  "downloadUrl": "/generated-cvs/CV_Jean_Dupont_1642678200000.pdf",
  "filename": "CV_Jean_Dupont_1642678200000.pdf"
}
```

**Réponse d'erreur:**
```json
{
  "success": false,
  "error": "Données invalides",
  "details": ["Le prénom est obligatoire", "L'email n'est pas valide"]
}
```

## 📁 Structure du Backend

```
backend/
├── utils/
│   ├── pdfGenerator.js    # Génération PDF avec Puppeteer
│   └── validator.js       # Validation des données
├── templates/
│   └── cv-template.html   # Template HTML pour le PDF
└── generated/             # Dossier des CV générés
```

## 🧪 Tests

### Tests automatisés
```bash
# Lancer le script de test
chmod +x test_api.sh
./test_api.sh
```

### Tests manuels avec cURL

```bash
# Test de santé
curl http://localhost:3000/api/health

# Test de génération
curl -X POST http://localhost:3000/api/generate-cv \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "name": "User", 
    "email": "test@example.com",
    "skills": ["JavaScript", "React"]
  }'
```

## ⚙️ Configuration

### Variables d'environnement
Créer un fichier `.env` (optionnel):
```env
PORT=3000
NODE_ENV=development
```

### Personnalisation du template
Modifiez `backend/templates/cv-template.html` pour changer l'apparence du CV généré.

## 🔧 Dépannage

### Problèmes courants

**1. Erreur Puppeteer**
```bash
# Sur Ubuntu/Debian
sudo apt-get install -y chromium-browser

# Variables d'environnement
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

**2. Port déjà utilisé**
```bash
# Changer le port
PORT=3001 npm start
```

**3. Permissions sur les fichiers générés**
```bash
chmod 755 backend/generated/
```

## 🚀 Déploiement

### Production

1. **Variables d'environnement:**
```env
NODE_ENV=production
PORT=3000
```

2. **Démarrage:**
```bash
npm start
```

### Docker (optionnel)

```dockerfile
FROM node:16-alpine
RUN apk add --no-cache chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔐 Sécurité

- Rate limiting activé (50 req/15min par IP)
- Validation stricte des données d'entrée
- Échappement HTML pour éviter les injections
- CORS configuré
- Taille de payload limitée (10MB)

## 📊 Monitoring

Les logs incluent:
- ✅ Requêtes réussies
- ❌ Erreurs de validation
- 🚫 Rate limiting
- 📁 Génération de fichiers

## 🤝 Développement

### Ajout de nouvelles fonctionnalités

1. **Nouveau template:**
   - Créer un fichier dans `backend/templates/`
   - Modifier `pdfGenerator.js` pour le supporter

2. **Nouvelle validation:**
   - Étendre `validator.js`
   - Ajouter les tests correspondants

3. **Nouveau endpoint:**
   - Ajouter la route dans `server.js`
   - Documenter dans ce README

## 📝 License

MIT License - voir le fichier LICENSE pour plus de détails.

---

**🎉 Bon hackathon ! N'hésitez pas à adapter ce backend selon vos besoins spécifiques.**
