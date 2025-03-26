import { NoClueQuiz } from './components/Quiz.js';
import { setupAutocomplete } from './autocomplete.js';

// Debugging function to log fetch errors
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

// Utility function to initialize the application
function initializeApp() {
    // Check for required DOM elements
    const requiredElements = [
        'movie-quote', 
        'current-clue', 
        'clue-buttons', 
        'movie-guess', 
        'submit-btn', 
        'skip-btn', 
        'modal'
    ];

    const missingElements = requiredElements.filter(id => !document.getElementById(id));

    if (missingElements.length > 0) {
        console.error('Missing required DOM elements:', missingElements);
        return;
    }

    // Test data fetching before initializing
    testDataFetching();

    // Initialize autocomplete
    setupAutocomplete();

    // Initialize the quiz
    new NoClueQuiz();
}

// Error handling for unhandled promises
function handleUnhandledErrors() {
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled Promise Rejection:', event.reason);
    });
}

// Entry point - run when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeApp();
        handleUnhandledErrors();
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// Export for potential external use or testing
export { initializeApp };