import { NoClueQuiz } from './components/Quiz.js';
import { setupAutocomplete } from './autocomplete.js';

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

    // Initialize autocomplete
    setupAutocomplete();

    // Initialize the quiz
    new NoClueQuiz();
}

// Error handling for unhandled promises
function handleUnhandledErrors() {
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled Promise Rejection:', event.reason);
        // Optional: Show user-friendly error message
        const errorModal = document.getElementById('error-modal');
        if (errorModal) {
            errorModal.textContent = 'An unexpected error occurred. Please try again.';
            errorModal.style.display = 'block';
        }
    });
}

// Performance monitoring
function initPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = window.performance.now();
            console.log(`Page loaded in ${loadTime.toFixed(2)} milliseconds`);
        });
    }
}

// Entry point - run when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeApp();
        handleUnhandledErrors();
        initPerformanceMonitoring();
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// Optional: Add service worker for offline support and performance
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Export for potential external use or testing
export { initializeApp };
