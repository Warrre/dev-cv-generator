import { createHeader } from './components/header.js';
import { createForm } from './components/form.js';
import { createFooter } from './components/footer.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  app.appendChild(createHeader());
  app.appendChild(createForm());
  app.appendChild(createFooter());
});
