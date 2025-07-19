// main.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cv-form");

  // Champs input
  const inputs = {
    name: document.getElementById("name"),
    firstName: document.getElementById("first-name"),
    email: document.getElementById("email"),
    linkedin: document.getElementById("linkedin"),
    github: document.getElementById("github"),
    photo: document.getElementById("photo"),
    profile: document.getElementById("profile"),
    skills: document.getElementById("skills"),
    diploma: document.getElementById("diploma"),
    experience: document.getElementById("experience"),
    project: document.getElementById("project"),
    languages: document.getElementById("languages"),
  };

  // Aperçu éléments
  const preview = {
    photo: document.getElementById("preview-photo"),
    firstName: document.getElementById("preview-first-name"),
    name: document.getElementById("preview-name"),
    email: document.getElementById("preview-email"),
    linkedin: document.getElementById("preview-linkedin"),
    github: document.getElementById("preview-github"),
    profile: document.getElementById("preview-profile"),
    skills: document.getElementById("preview-skills"),
    diploma: document.getElementById("preview-diploma"),
    experience: document.getElementById("preview-experience"),
    project: document.getElementById("preview-project"),
    languages: document.getElementById("preview-languages"),
  };

  // Sélecteurs
  const layoutSelect = document.getElementById("layout");
  const themeColorSelect = document.getElementById("theme-color");

  // Container de l'aperçu pour changer la mise en page
  const cvOutput = document.getElementById("cv-output");

  // Fonction pour mettre à jour l'aperçu
  function updatePreview() {
    // Texte
    preview.firstName.textContent = inputs.firstName.value || "Prénom";
    preview.name.textContent = inputs.name.value || "Nom";
    preview.email.textContent = inputs.email.value || "Email";

    preview.linkedin.textContent = inputs.linkedin.value ? formatLink(inputs.linkedin.value, "LinkedIn") : "";
    preview.github.textContent = inputs.github.value ? formatLink(inputs.github.value, "GitHub") : "";

    preview.profile.textContent = inputs.profile.value || "-";

    // Compétences - transforme chaîne "html, css, js" en liste <li>
    if (inputs.skills.value.trim()) {
      preview.skills.innerHTML = inputs.skills.value
        .split(",")
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0)
        .map(skill => `<li>${skill}</li>`)
        .join("");
    } else {
      preview.skills.innerHTML = "<li>-</li>";
    }

    preview.diploma.textContent = inputs.diploma.value || "-";
    preview.experience.textContent = inputs.experience.value || "-";
    preview.project.textContent = inputs.project.value || "-";
    preview.languages.textContent = inputs.languages.value || "-";

    // Photo
    if (inputs.photo.value.trim()) {
      preview.photo.src = inputs.photo.value.trim();
      preview.photo.classList.remove("hidden");
    } else {
      preview.photo.src = "";
      preview.photo.classList.add("hidden");
    }

    // Mise en page
    switch (layoutSelect.value) {
      case "simple":
        cvOutput.className = "bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg space-y-6 text-gray-800 dark:text-gray-100";
        break;
      case "compact":
        cvOutput.className = "bg-white dark:bg-gray-900 p-3 rounded-lg shadow space-y-2 text-gray-800 dark:text-gray-100 text-sm";
        break;
      case "modern":
        cvOutput.className = "bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg text-gray-800 dark:text-gray-100 grid grid-cols-2 gap-6";
        break;
    }

    // Couleur principale (exemple sur le nom et bordure photo)
    const color = themeColorSelect.value;
    const colorClasses = {
      blue: "text-blue-600 dark:text-blue-300 border-blue-500 dark:border-blue-300",
      red: "text-red-600 dark:text-red-400 border-red-500 dark:border-red-400",
      green: "text-green-600 dark:text-green-400 border-green-500 dark:border-green-400",
      purple: "text-purple-600 dark:text-purple-400 border-purple-500 dark:border-purple-400",
      black: "text-gray-900 dark:text-gray-100 border-gray-900 dark:border-gray-100",
      yellow: "text-yellow-600 dark:text-yellow-400 border-yellow-500 dark:border-yellow-400",
      pink: "text-pink-600 dark:text-pink-400 border-pink-500 dark:border-pink-400",
      white: "text-white border-white",
      grey: "text-gray-600 dark:text-gray-400 border-gray-600 dark:border-gray-400",
      orange: "text-orange-600 dark:text-orange-400 border-orange-500 dark:border-orange-400",
    };

    // Nettoyer les classes de couleur existantes avant d'ajouter les nouvelles
    Object.values(colorClasses).forEach(c => {
      preview.name.classList.remove(...c.split(" "));
      preview.firstName.classList.remove(...c.split(" "));
      preview.photo.classList.remove(...c.split(" "));
    });

    // Ajouter la nouvelle couleur
    const chosenColor = colorClasses[color] || colorClasses.blue;
    preview.name.classList.add(...chosenColor.split(" "));
    preview.firstName.classList.add(...chosenColor.split(" "));
    preview.photo.classList.add(...chosenColor.split(" "));
  }

  // Fonction helper pour créer un lien cliquable
  function formatLink(url, label) {
    try {
      const urlObj = new URL(url);
      return `<a href="${urlObj.href}" target="_blank" class="underline hover:text-blue-700 dark:hover:text-blue-400">${label}</a>`;
    } catch {
      return label;
    }
  }

  // Mise à jour en live à chaque input change
  Object.values(inputs).forEach(input => {
    input.addEventListener("input", updatePreview);
  });
  layoutSelect.addEventListener("change", updatePreview);
  themeColorSelect.addEventListener("change", updatePreview);

  // Empêcher le submit et afficher juste l'aperçu
  form.addEventListener("submit", e => {
    e.preventDefault();
    updatePreview();
  });

  // Initialisation au chargement
  updatePreview();

  // --- COPIER URL PHOTO ---
  // Ajoutons un bouton copier à côté du champ photo, et on le gère ici :
  // Puisqu'il n'existe pas dans le HTML donné, on peut le créer ici dynamiquement :

  const photoInput = inputs.photo;
  const copyBtn = document.createElement("button");
  copyBtn.type = "button";
  copyBtn.textContent = "Copier URL";
  copyBtn.className = "ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition";
  photoInput.insertAdjacentElement("afterend", copyBtn);

  // Message temporaire de confirmation
  const copyMsg = document.createElement("span");
  copyMsg.textContent = "URL copiée !";
  copyMsg.className = "ml-3 text-green-600 dark:text-green-400 hidden";
  copyBtn.insertAdjacentElement("afterend", copyMsg);

  copyBtn.addEventListener("click", () => {
    if (!photoInput.value.trim()) {
      alert("Veuillez entrer une URL de photo avant de copier !");
      return;
    }
    navigator.clipboard.writeText(photoInput.value.trim()).then(() => {
      copyMsg.classList.remove("hidden");
      setTimeout(() => copyMsg.classList.add("hidden"), 2000);
    }).catch(() => {
      alert("Erreur lors de la copie de l'URL.");
    });
  });

  // ================================
  // INTÉGRATION API BACKEND
  // ================================

  // Fonction pour collecter toutes les données du formulaire
  function collectFormData() {
    return {
      firstName: inputs.firstName.value.trim(),
      name: inputs.name.value.trim(),
      email: inputs.email.value.trim(),
      linkedin: inputs.linkedin.value.trim(),
      github: inputs.github.value.trim(),
      photo: inputs.photo.value.trim(),
      profile: inputs.profile.value.trim(),
      skills: inputs.skills.value.trim().split(',').map(s => s.trim()).filter(s => s),
      diploma: inputs.diploma.value.trim(),
      experience: inputs.experience.value.trim(),
      project: inputs.project.value.trim(),
      languages: inputs.languages.value.trim()
    };
  }

  // Fonction pour générer le PDF via l'API
  async function generatePDF() {
    const generateBtn = document.getElementById('generate-pdf-btn');
    const originalText = generateBtn?.textContent || 'Générer PDF';
    
    try {
      // Afficher l'état de chargement
      if (generateBtn) {
        generateBtn.textContent = 'Génération en cours...';
        generateBtn.disabled = true;
      }

      // Collecter les données du formulaire
      const formData = collectFormData();
      
      // Validation basique côté client
      if (!formData.firstName || !formData.name || !formData.email) {
        throw new Error('Veuillez remplir au moins le prénom, nom et email');
      }

      console.log('📤 Envoi des données au backend:', formData);

      // Envoyer la requête à l'API
      const response = await fetch('/api/generate-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Erreur HTTP ${response.status}`);
      }

      if (result.success) {
        console.log('✅ CV généré avec succès:', result);
        
        // Afficher le message de succès
        showNotification('CV généré avec succès! 🎉', 'success');
        
        // Ouvrir le PDF dans un nouvel onglet
        if (result.downloadUrl) {
          window.open(result.downloadUrl, '_blank');
        }
        
        // Optionnel: proposer le téléchargement direct
        if (result.filename) {
          const downloadLink = document.createElement('a');
          downloadLink.href = result.downloadUrl;
          downloadLink.download = result.filename;
          downloadLink.style.display = 'none';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
      } else {
        throw new Error(result.error || 'Erreur inconnue');
      }

    } catch (error) {
      console.error('❌ Erreur lors de la génération du PDF:', error);
      showNotification(`Erreur: ${error.message}`, 'error');
    } finally {
      // Restaurer le bouton
      if (generateBtn) {
        generateBtn.textContent = originalText;
        generateBtn.disabled = false;
      }
    }
  }

  // Fonction pour afficher des notifications
  function showNotification(message, type = 'info') {
    // Créer l'élément notification
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full`;
    
    // Styles selon le type
    const styles = {
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      info: 'bg-blue-500 text-white',
      warning: 'bg-yellow-500 text-black'
    };
    
    notification.className += ` ${styles[type] || styles.info}`;
    notification.textContent = message;
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    // Suppression automatique après 5 secondes
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
    
    // Permettre la fermeture au clic
    notification.addEventListener('click', () => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    });
  }

  // Ajouter le bouton de génération PDF s'il n'existe pas
  function addGeneratePDFButton() {
    const existingBtn = document.getElementById('generate-pdf-btn');
    if (existingBtn) return;

    const container = document.querySelector('.container') || document.body;
    const pdfSection = document.createElement('div');
    pdfSection.className = 'pdf-section mt-6 text-center';
    pdfSection.innerHTML = `
      <button id="generate-pdf-btn" class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105">
        📄 Générer PDF
      </button>
      <p class="text-sm text-gray-600 mt-2">
        Cliquez pour générer et télécharger votre CV en PDF
      </p>
    `;
    
    // Insérer avant la prévisualisation ou à la fin
    const previewSection = document.querySelector('.cv-output') || container;
    previewSection.parentNode.insertBefore(pdfSection, previewSection);
    
    // Attacher l'événement
    document.getElementById('generate-pdf-btn').addEventListener('click', generatePDF);
  }

  // Initialiser le bouton PDF
  addGeneratePDFButton();

  // Test de connexion API au chargement
  async function testAPIConnection() {
    try {
      const response = await fetch('/api/health');
      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Connexion API établie:', result.message);
      } else {
        console.warn('⚠️ API réponse inattendue:', result);
      }
    } catch (error) {
      console.error('❌ Impossible de se connecter à l\'API:', error);
      showNotification('Attention: API backend non disponible', 'warning');
    }
  }

  // Tester la connexion API
  testAPIConnection();

});
