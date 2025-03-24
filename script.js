document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const tabButtons = document.querySelectorAll('.tab-button');
    const questionElement = document.getElementById('question');
    const cluesList = document.getElementById('clues-list');
    const answerInput = document.getElementById('answer-input');
    const suggestionsDropdown = document.getElementById('suggestions');
    const submitAnswerButton = document.getElementById('submit-answer');
    const getClueButton = document.getElementById('get-clue');
    const resultMessage = document.getElementById('result-message');
    const scoreDisplay = document.getElementById('current-score');
    
    // Game state
    let currentCategory = 'movie-quotes';
    let currentScore = 10;
    let cluesRevealed = 0;
    let isGameOver = false;
    let questionAnswered = false;
    
    // Sample database - In a real app, this would be fetched from a server
    // Using a simple obfuscation for answers (Base64 encoding) - not secure, just basic obscurity
    const quizDatabase = {
        'movie-quotes': {
            question: "What movie is this quote from: \"I'm going to make him an offer he can't refuse.\"",
            answer: "The Godfather", // Base64: VGhlIEdvZGZhdGhlcg==
            encodedAnswer: "VGhlIEdvZGZhdGhlcg==",
            clues: [
                "This film was released in 1972",
                "It was directed by Francis Ford Coppola",
                "It stars Marlon Brando",
                "It's about a powerful Italian-American crime family",
                "The quote is spoken by Don Vito Corleone"
            ],
            suggestions: ["The Godfather", "Goodfellas", "Scarface", "Casino", "The Departed", "Pulp Fiction"]
        },
        'geography': {
            question: "Which country has the largest land area in South America?",
            answer: "Brazil", // Base64: QnJhemls
            encodedAnswer: "QnJhemls",
            clues: [
                "This country's official language is Portuguese",
                "It contains most of the Amazon Rainforest",
                "Its capital is Brasília",
                "It has a population of over 200 million people",
                "Its flag is green with a yellow diamond containing a blue circle"
            ],
            suggestions: ["Argentina", "Brazil", "Peru", "Colombia", "Chile", "Venezuela"]
        },
        'history': {
            question: "In which year did World War I begin?",
            answer: "1914", // Base64: MTkxNA==
            encodedAnswer: "MTkxNA==",
            clues: [
                "It began in the second decade of the 20th century",
                "It was triggered by the assassination of Archduke Franz Ferdinand",
                "It ended in 1918",
                "It was called 'The Great War' at the time",
                "It started after the assassination in Sarajevo"
            ],
            suggestions: ["1910", "1912", "1914", "1916", "1918", "1920"]
        }
    };
    
    // Initialize the game
    function initGame() {
        resetGameState();
        loadCategory(currentCategory);
        updateScoreDisplay();
    }
    
    // Reset game state
    function resetGameState() {
        currentScore = 10;
        cluesRevealed = 0;
        isGameOver = false;
        questionAnswered = false;
        cluesList.innerHTML = '';
        answerInput.value = '';
        resultMessage.innerHTML = '';
        resultMessage.className = 'result-message';
        getClueButton.disabled = false;
        submitAnswerButton.disabled = false;
    }
    
    // Load category data
    function loadCategory(category) {
        currentCategory = category;
        const categoryData = quizDatabase[category];
        
        // Update UI with category data
        questionElement.textContent = categoryData.question;
    }
    
    // Show a clue
    function revealClue() {
        if (cluesRevealed >= 5 || isGameOver) return;
        
        const categoryData = quizDatabase[currentCategory];
        const newClue = document.createElement('div');
        newClue.className = 'clue-item';
        newClue.textContent = `Clue ${cluesRevealed + 1}: ${categoryData.clues[cluesRevealed]}`;
        cluesList.appendChild(newClue);
        
        cluesRevealed++;
        currentScore--;
        updateScoreDisplay();
        
        // Check if we've reached the maximum number of clues
        if (cluesRevealed >= 5) {
            endGame(false);
        }
    }
    
    // Custom confetti function that doesn't rely on the library
    function createConfetti() {
        // Create a container for the confetti
        const confettiContainer = document.createElement('div');
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.zIndex = '1000';
        document.body.appendChild(confettiContainer);
        
        // Colors for confetti
        const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22'];
        
        // Create confetti pieces
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            
            // Random styles
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 10 + 5;
            const left = Math.random() * 100;
            
            confetti.style.position = 'absolute';
            confetti.style.backgroundColor = color;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.left = `${left}%`;
            confetti.style.top = '-50px';
            confetti.style.opacity = '1';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            confettiContainer.appendChild(confetti);
            
            // Animation
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 0.5;
            
            confetti.animate([
                { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
                { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: duration * 1000,
                delay: delay * 1000,
                easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
            });
            
            // Remove after animation
            setTimeout(() => {
                confetti.remove();
            }, (duration + delay) * 1000);
        }
        
        // Remove container after all confetti are gone
        setTimeout(() => {
            confettiContainer.remove();
        }, 6000);
    }
    
    // Check if the external confetti library is available
    function triggerConfetti() {
        // Try to use the external library first
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else {
            // Fall back to our custom implementation
            createConfetti();
        }
    }
    
    // Check the user's answer
    function checkAnswer() {
        if (isGameOver || questionAnswered) return;
        
        const userAnswer = answerInput.value.trim();
        const correctAnswer = quizDatabase[currentCategory].answer;
        
        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            // Correct answer
            questionAnswered = true;
            resultMessage.textContent = `Correct! The answer is "${correctAnswer}".`;
            resultMessage.className = 'result-message result-success';
            
            // Trigger confetti animation
            triggerConfetti();
            
            endGame(true);
        } else {
            // Wrong answer
            currentScore--; // Penalty for wrong answer
            resultMessage.textContent = `Sorry, that's not correct. Try again or get a clue.`;
            resultMessage.className = 'result-message result-error';
            
            // Reveal a clue after a wrong answer
            revealClue();
            updateScoreDisplay();
        }
    }
    
    // End the game
    function endGame(isSuccess) {
        isGameOver = true;
        getClueButton.disabled = true;
        
        if (!isSuccess) {
            const correctAnswer = quizDatabase[currentCategory].answer;
            resultMessage.textContent = `Tough luck! The correct answer was "${correctAnswer}".`;
            resultMessage.className = 'result-message result-neutral';
            currentScore = 0;
            updateScoreDisplay();
        }
    }
    
    // Update score display
    function updateScoreDisplay() {
        scoreDisplay.textContent = currentScore;
    }
    
    // Handle input and show suggestions
    function handleInput() {
        const input = answerInput.value.trim().toLowerCase();
        
        if (input.length < 2) {
            suggestionsDropdown.style.display = 'none';
            return;
        }
        
        const suggestions = quizDatabase[currentCategory].suggestions.filter(suggestion => 
            suggestion.toLowerCase().includes(input)
        );
        
        if (suggestions.length > 0) {
            suggestionsDropdown.innerHTML = '';
            suggestions.forEach(suggestion => {
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'suggestion-item';
                suggestionItem.textContent = suggestion;
                
                suggestionItem.addEventListener('click', () => {
                    answerInput.value = suggestion;
                    suggestionsDropdown.style.display = 'none';
                });
                
                suggestionsDropdown.appendChild(suggestionItem);
            });
            suggestionsDropdown.style.display = 'block';
        } else {
            suggestionsDropdown.style.display = 'none';
        }
    }
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(event) {
        if (!answerInput.contains(event.target) && !suggestionsDropdown.contains(event.target)) {
            suggestionsDropdown.style.display = 'none';
        }
    });
    
    // Event Listeners
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Only change if it's a different category
            if (this.dataset.category !== currentCategory) {
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                // Load new category
                resetGameState();
                loadCategory(this.dataset.category);
            }
        });
    });
    
    getClueButton.addEventListener('click', function() {
        if (!isGameOver && !questionAnswered) {
            revealClue();
        }
    });
    
    submitAnswerButton.addEventListener('click', checkAnswer);
    
    answerInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
    
    answerInput.addEventListener('input', handleInput);
    
    // Simple "obfuscation" helper functions
    function encodeString(str) {
        return btoa(str);
    }
    
    function decodeString(encoded) {
        return atob(encoded);
    }
    
    // Start the game
    initGame();
});