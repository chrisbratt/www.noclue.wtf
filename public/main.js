// main.js
import { NoClueQuiz } from './Quiz.js';
import { setupAutocomplete } from './autocomplete.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Fetch and populate autocomplete suggestions first
    await setupAutocomplete();

    // Initialize the quiz functionality
    new NoClueQuiz();
  } catch (error) {
    console.error('Initialization failed:', error);
  }
});
