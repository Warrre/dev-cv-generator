export function createFooter() {
  const footer = document.createElement('footer');
  footer.classList.add('footer');

  footer.innerHTML = `
    <p>Fait avec lors d'un hackathon</p>
    <p>&copy; 2025 DevTeam</p>
  `;

  return footer;
}
