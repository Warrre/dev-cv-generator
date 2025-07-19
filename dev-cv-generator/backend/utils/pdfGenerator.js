const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Génère un PDF à partir des données CV
 * @param {Object} cvData - Données du CV
 * @returns {Object} - Informations sur le fichier généré
 */
async function generatePDF(cvData) {
  let browser;
  
  try {
    console.log('🚀 Démarrage de la génération PDF...');
    
    // Créer le HTML du CV
    const htmlContent = await generateCVHTML(cvData);
    
    // Lancer Puppeteer
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Charger le contenu HTML
    await page.setContent(htmlContent, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Générer le PDF
    const filename = `CV_${cvData.firstName}_${cvData.name}_${Date.now()}.pdf`;
    const outputPath = path.join(__dirname, '../generated', filename);
    
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    console.log('✅ PDF généré avec succès:', filename);
    
    return {
      filename,
      path: outputPath,
      size: (await fs.stat(outputPath)).size
    };
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération PDF:', error);
    throw new Error(`Échec de la génération PDF: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Génère le HTML du CV à partir des données
 * @param {Object} cvData - Données du CV
 * @returns {String} - HTML généré
 */
async function generateCVHTML(cvData) {
  // Lire le template HTML
  const templatePath = path.join(__dirname, '../templates/cv-template.html');
  let template;
  
  try {
    template = await fs.readFile(templatePath, 'utf8');
  } catch (error) {
    console.log('📝 Template non trouvé, utilisation du template par défaut');
    template = getDefaultTemplate();
  }
  
  // Remplacer les placeholders par les vraies données
  let html = template
    .replace(/{{firstName}}/g, escapeHtml(cvData.firstName || ''))
    .replace(/{{name}}/g, escapeHtml(cvData.name || ''))
    .replace(/{{email}}/g, escapeHtml(cvData.email || ''))
    .replace(/{{linkedin}}/g, escapeHtml(cvData.linkedin || ''))
    .replace(/{{github}}/g, escapeHtml(cvData.github || ''))
    .replace(/{{profile}}/g, escapeHtml(cvData.profile || ''))
    .replace(/{{photo}}/g, cvData.photo || '');
  
  // Traiter les compétences
  if (cvData.skills && Array.isArray(cvData.skills)) {
    const skillsHtml = cvData.skills.map(skill => 
      `<span class="skill-tag">${escapeHtml(skill)}</span>`
    ).join('');
    html = html.replace(/{{skills}}/g, skillsHtml);
  } else {
    html = html.replace(/{{skills}}/g, escapeHtml(cvData.skills || ''));
  }
  
  // Traiter les expériences
  if (cvData.experiences && Array.isArray(cvData.experiences)) {
    const experiencesHtml = cvData.experiences.map(exp => `
      <div class="experience-item">
        <div class="experience-header">
          <h4>${escapeHtml(exp.position || '')}</h4>
          <span class="company">${escapeHtml(exp.company || '')}</span>
        </div>
        <div class="experience-dates">${escapeHtml(exp.startDate || '')} - ${escapeHtml(exp.endDate || '')}</div>
        <p class="experience-description">${escapeHtml(exp.description || '')}</p>
      </div>
    `).join('');
    html = html.replace(/{{experiences}}/g, experiencesHtml);
  } else {
    html = html.replace(/{{experiences}}/g, escapeHtml(cvData.experience || ''));
  }
  
  // Traiter les projets
  if (cvData.projects && Array.isArray(cvData.projects)) {
    const projectsHtml = cvData.projects.map(project => `
      <div class="project-item">
        <h4>${escapeHtml(project.name || '')}</h4>
        <p>${escapeHtml(project.description || '')}</p>
        ${project.technologies ? `<div class="project-tech">${escapeHtml(project.technologies)}</div>` : ''}
      </div>
    `).join('');
    html = html.replace(/{{projects}}/g, projectsHtml);
  } else {
    html = html.replace(/{{projects}}/g, escapeHtml(cvData.project || ''));
  }
  
  // Autres champs
  html = html.replace(/{{diploma}}/g, escapeHtml(cvData.diploma || ''));
  html = html.replace(/{{languages}}/g, escapeHtml(cvData.languages || ''));
  
  return html;
}

/**
 * Échappe les caractères HTML pour éviter les injections
 * @param {String} text - Texte à échapper
 * @returns {String} - Texte échappé
 */
function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Template HTML par défaut si le fichier template n'existe pas
 */
function getDefaultTemplate() {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV - {{firstName}} {{name}}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #2563eb;
        }
        
        .header h1 {
            color: #2563eb;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
        }
        
        .contact-info span {
            font-size: 0.9em;
            color: #666;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section h2 {
            color: #2563eb;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        
        .skill-tag {
            display: inline-block;
            background: #e1f5fe;
            color: #0277bd;
            padding: 4px 8px;
            margin: 2px;
            border-radius: 4px;
            font-size: 0.9em;
        }
        
        .experience-item, .project-item {
            margin-bottom: 20px;
            padding: 15px;
            border-left: 3px solid #2563eb;
            background: #f8f9fa;
        }
        
        .experience-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
        }
        
        .experience-header h4 {
            color: #2563eb;
        }
        
        .company {
            font-weight: bold;
            color: #666;
        }
        
        .experience-dates {
            font-size: 0.9em;
            color: #888;
            margin-bottom: 10px;
        }
        
        .project-tech {
            margin-top: 8px;
            font-size: 0.9em;
            color: #666;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{firstName}} {{name}}</h1>
        <div class="contact-info">
            <span>📧 {{email}}</span>
            <span>💼 {{linkedin}}</span>
            <span>🔗 {{github}}</span>
        </div>
    </div>
    
    ${cvData.profile ? `
    <div class="section">
        <h2>Profil</h2>
        <p>{{profile}}</p>
    </div>
    ` : ''}
    
    <div class="section">
        <h2>Compétences</h2>
        <div>{{skills}}</div>
    </div>
    
    <div class="section">
        <h2>Expériences</h2>
        {{experiences}}
    </div>
    
    ${cvData.projects ? `
    <div class="section">
        <h2>Projets</h2>
        {{projects}}
    </div>
    ` : ''}
    
    ${cvData.diploma ? `
    <div class="section">
        <h2>Formation</h2>
        <p>{{diploma}}</p>
    </div>
    ` : ''}
    
    ${cvData.languages ? `
    <div class="section">
        <h2>Langues</h2>
        <p>{{languages}}</p>
    </div>
    ` : ''}
</body>
</html>`;
}

module.exports = {
  generatePDF,
  generateCVHTML
};
