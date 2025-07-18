export function createHeader() {
  const header = document.createElement('header');
  header.classList.add('header');

  header.innerHTML = `
    <h1> Dev CV Generator</h1>
    <p>Générez facilement un CV pro pour développeur</p>
  `;

  return header;
}
