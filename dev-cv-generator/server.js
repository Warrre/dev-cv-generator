const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { generatePDF } = require('./backend/utils/pdfGenerator');
const { validateCVData } = require('./backend/utils/validator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de limitation de taux pour éviter l'abus
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limite chaque IP à 50 requêtes par fenêtre de temps
  message: { error: 'Trop de requêtes, veuillez réessayer plus tard.' }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(limiter);

// Servir les fichiers statiques (votre frontend)
app.use(express.static('public'));

// Route pour servir les CV générés
app.use('/generated-cvs', express.static(path.join(__dirname, 'backend/generated')));

// Routes API
app.post('/api/generate-cv', async (req, res) => {
  try {
    console.log('📨 Réception des données CV:', JSON.stringify(req.body, null, 2));
    
    // Validation des données
    const validation = validateCVData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Données invalides',
        details: validation.errors
      });
    }

    // Génération du PDF
    const result = await generatePDF(req.body);
    
    res.json({
      success: true,
      message: 'CV généré avec succès!',
      downloadUrl: `/generated-cvs/${result.filename}`,
      filename: result.filename
    });

  } catch (error) {
    console.error('❌ Erreur lors de la génération du CV:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur',
      details: error.message
    });
  }
});

// Route de test pour vérifier que l'API fonctionne
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API CV Generator fonctionne correctement',
    timestamp: new Date().toISOString()
  });
});

// Route principale - servir votre index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware de gestion d'erreur global
app.use((err, req, res, next) => {
  console.error('❌ Erreur non gérée:', err);
  res.status(500).json({
    success: false,
    error: 'Erreur interne du serveur'
  });
});

// Gestion des routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route non trouvée'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
  console.log(`📁 Fichiers statiques servis depuis: ${path.join(__dirname, 'public')}`);
  console.log(`🔗 API disponible sur: http://localhost:${PORT}/api/`);
});

module.exports = app;
