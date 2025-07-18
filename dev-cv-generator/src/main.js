document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cv-form');

  const fields = [
    'name',
    'first-name',
    'email',
    'linkedin',
    'github',
    'skills'
  ];

  fields.forEach((field) => {
    const input = document.getElementById(field);
    const preview = document.getElementById(`preview-${field}`);
    
    input.addEventListener('input', () => {
      if (field === 'skills') {
        const skills = input.value.split(',').map(skill => skill.trim()).filter(Boolean);
        preview.textContent = skills.join(', ');
      } else {
        preview.textContent = input.value;
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Les données ont été enregistrées. Bientôt envoyées au backend...');
    // Ici tu pourras appeler une API plus tard
  });
});
