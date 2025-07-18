export function createForm() {
  const form = document.createElement('form');
  form.classList.add('cv-form');

  form.innerHTML = `
    <h2>Créer mon CV</h2>

    <label for="name">Nom complet</label>
    <input type="text" id="name" name="name" required />

    <label for="email">Email</label>
    <input type="email" id="email" name="email" required />

    <label for="skills">Compétences (séparées par des virgules)</label>
    <input type="text" id="skills" name="skills" />

    <button type="submit">Générer</button>
  `;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value;
    const email = form.email.value;
    const skills = form.skills.value.split(',');

    console.log({ name, email, skills });
    // Ici on enverra les données vers l’aperçu plus tard
  });

  return form;
}
