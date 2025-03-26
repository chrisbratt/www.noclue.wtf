import { NoClueQuiz } from '../components/Quiz.js';
import { setupAutocomplete } from './autocomplete.js';

async function testDataFetching() {
    try {
        console.log('Testing question fetch...');
        const questionResponse = await fetch('/.netlify/functions/get-question');
        const questionData = await questionResponse.json();
        console.log('Question data:', questionData);

        console.log('Testing suggestions fetch...');
        const suggestionsResponse = await fetch('/.netlify/functions/get-suggestions');
        const suggestionsData = await suggestionsResponse.json();
        console.log('Suggestions data:', suggestionsData);
    } catch (error) {
        console.error('Data fetching test failed:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    testDataFetching();
    setupAutocomplete();
    new NoClueQuiz();
});