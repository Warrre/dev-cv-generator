/**
 * Valide les données du CV reçues du frontend
 * @param {Object} data - Données à valider
 * @returns {Object} - Résultat de la validation
 */
function validateCVData(data) {
  const errors = [];
  
  // Vérifications obligatoires
  if (!data.firstName || data.firstName.trim().length === 0) {
    errors.push('Le prénom est obligatoire');
  }
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Le nom est obligatoire');
  }
  
  if (!data.email || data.email.trim().length === 0) {
    errors.push('L\'email est obligatoire');
  } else if (!isValidEmail(data.email)) {
    errors.push('L\'email n\'est pas valide');
  }
  
  // Vérifications optionnelles mais importantes
  if (data.linkedin && !isValidUrl(data.linkedin)) {
    errors.push('L\'URL LinkedIn n\'est pas valide');
  }
  
  if (data.github && !isValidUrl(data.github)) {
    errors.push('L\'URL GitHub n\'est pas valide');
  }
  
  // Validation des expériences si présentes
  if (data.experiences && Array.isArray(data.experiences)) {
    data.experiences.forEach((exp, index) => {
      if (!exp.position || exp.position.trim().length === 0) {
        errors.push(`Expérience ${index + 1}: Le poste est obligatoire`);
      }
      if (!exp.company || exp.company.trim().length === 0) {
        errors.push(`Expérience ${index + 1}: L'entreprise est obligatoire`);
      }
    });
  }
  
  // Validation des projets si présents
  if (data.projects && Array.isArray(data.projects)) {
    data.projects.forEach((project, index) => {
      if (!project.name || project.name.trim().length === 0) {
        errors.push(`Projet ${index + 1}: Le nom est obligatoire`);
      }
    });
  }
  
  // Validation de la taille des champs texte
  const maxLengths = {
    firstName: 50,
    name: 50,
    email: 100,
    profile: 1000,
    skills: 500,
    diploma: 500,
    languages: 200
  };
  
  Object.keys(maxLengths).forEach(field => {
    if (data[field] && data[field].length > maxLengths[field]) {
      errors.push(`Le champ ${field} est trop long (max ${maxLengths[field]} caractères)`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors: errors,
    data: sanitizeData(data)
  };
}

/**
 * Nettoie et sanitise les données
 * @param {Object} data - Données à nettoyer
 * @returns {Object} - Données nettoyées
 */
function sanitizeData(data) {
  const sanitized = {};
  
  // Nettoyer les chaînes de caractères
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'string') {
      sanitized[key] = data[key].trim();
    } else if (Array.isArray(data[key])) {
      // Pour les tableaux (compétences, expériences, etc.)
      sanitized[key] = data[key].map(item => {
        if (typeof item === 'string') {
          return item.trim();
        } else if (typeof item === 'object' && item !== null) {
          // Pour les objets dans les tableaux (expériences, projets)
          const cleanItem = {};
          Object.keys(item).forEach(subKey => {
            if (typeof item[subKey] === 'string') {
              cleanItem[subKey] = item[subKey].trim();
            } else {
              cleanItem[subKey] = item[subKey];
            }
          });
          return cleanItem;
        }
        return item;
      });
    } else {
      sanitized[key] = data[key];
    }
  });
  
  return sanitized;
}

/**
 * Valide une adresse email
 * @param {String} email - Email à valider
 * @returns {Boolean} - True si valide
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valide une URL
 * @param {String} url - URL à valider
 * @returns {Boolean} - True si valide
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Convertit les données du formulaire en format structuré
 * @param {Object} formData - Données du formulaire
 * @returns {Object} - Données structurées
 */
function parseFormData(formData) {
  const parsed = { ...formData };
  
  // Convertir les compétences en tableau si c'est une chaîne
  if (typeof parsed.skills === 'string') {
    parsed.skills = parsed.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
  }
  
  // Convertir les langues en tableau si nécessaire
  if (typeof parsed.languages === 'string') {
    parsed.languages = parsed.languages.split(',').map(lang => lang.trim()).filter(lang => lang);
  }
  
  // Si les expériences sont des chaînes, les convertir en objets
  if (typeof parsed.experience === 'string' && parsed.experience.trim()) {
    parsed.experiences = [{
      position: 'Non spécifié',
      company: 'Non spécifié',
      startDate: '',
      endDate: '',
      description: parsed.experience
    }];
    delete parsed.experience;
  }
  
  // Si les projets sont des chaînes, les convertir en objets
  if (typeof parsed.project === 'string' && parsed.project.trim()) {
    parsed.projects = [{
      name: 'Projet',
      description: parsed.project,
      technologies: ''
    }];
    delete parsed.project;
  }
  
  return parsed;
}

module.exports = {
  validateCVData,
  sanitizeData,
  parseFormData,
  isValidEmail,
  isValidUrl
};
