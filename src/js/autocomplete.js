let suggestions = [];

export async function setupAutocomplete(selectCallback) {
    try {
        const response = await fetch('/.netlify/functions/get-suggestions');
        suggestions = await response.json();
    } catch (error) {
        console.error('Error loading suggestions:', error);
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
