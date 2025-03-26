let suggestions = [];

export async function setupAutocomplete(selectCallback) {
    try {
        console.log('Fetching movie suggestions...');
        const response = await fetch('/.netlify/functions/get-suggestions');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        suggestions = await response.json();
        console.log(`Loaded ${suggestions.length} movie suggestions`);
    } catch (error) {
        console.error('Error loading suggestions:', error);
        suggestions = []; // Ensure suggestions is an empty array if fetch fails
    }

    const suggestionsDropdown = document.getElementById('suggestions-dropdown');
    const movieGuess = document.getElementById('movie-guess');

    movieGuess.addEventListener('input', () => showSuggestions(movieGuess.value));

    suggestionsDropdown.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggestion-item')) {
            movieGuess.value = e.target.textContent;
            suggestionsDropdown.style.display = 'none';
            if (selectCallback) selectCallback(e.target.textContent);
        }
    });
}

export function showSuggestions(input) {
    const suggestionsDropdown = document.getElementById('suggestions-dropdown');
    
    if (!input) {
        suggestionsDropdown.style.display = 'none';
        return;
    }

    const filteredSuggestions = suggestions
        .filter(movie => 
            movie.toLowerCase().includes(input.toLowerCase())
        )
        .slice(0, 10);

    suggestionsDropdown.innerHTML = filteredSuggestions
        .map(movie => `<div class="suggestion-item">${movie}</div>`)
        .join('');

    suggestionsDropdown.style.display = filteredSuggestions.length > 0 ? 'block' : 'none';
}