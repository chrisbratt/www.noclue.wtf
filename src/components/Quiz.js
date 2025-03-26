import { createConfetti } from './Confetti.js';
import { showSuggestions, setupAutocomplete } from './autocomplete.js';

export class NoClueQuiz {
    constructor() {
        this.currentQuestion = null;
        this.revealedClues = 0;
        this.initElements();
        this.setupEventListeners();
        this.loadQuestion();
        setupAutocomplete(this.handleSuggestionSelect.bind(this));
    }

    initElements() {
        this.quoteElement = document.getElementById('movie-quote');
        this.clueDisplay = document.getElementById('current-clue');
        this.clueButtons = document.querySelectorAll('.clue-btn');
        this.guessInput = document.getElementById('movie-guess');
        this.submitBtn = document.getElementById('submit-btn');
        this.skipBtn = document.getElementById('skip-btn');
        this.modal = document.getElementById('modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalMessage = document.getElementById('modal-message');
        this.modalCloseBtn = document.getElementById('modal-close');
    }

    setupEventListeners() {
        this.clueButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.showClue(parseInt(e.target.dataset.clue)));
        });

        this.submitBtn.addEventListener('click', () => this.checkAnswer());
        this.skipBtn.addEventListener('click', () => this.skipQuestion());
        this.modalCloseBtn.addEventListener('click', () => this.closeModal());
        this.guessInput.addEventListener('input', () => showSuggestions(this.guessInput.value));
    }

    async loadQuestion() {
        try {
            const response = await fetch('/.netlify/functions/get-question');
            const data = await response.json();
            this.currentQuestion = data;

            this.quoteElement.textContent = data.quote;
            this.resetClues();
        } catch (error) {
            console.error('Error loading question:', error);
            this.showModal('Error', 'Could not load today\'s question. Please try again later.');
        }
    }

    resetClues() {
        this.revealedClues = 0;
        this.clueDisplay.textContent = '';
        this.clueButtons.forEach(btn => {
            btn.disabled = true;
            btn.classList.remove('active');
        });
    }

    showClue(clueNumber) {
        if (this.currentQuestion && clueNumber <= this.revealedClues) {
            this.clueButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector(`.clue-btn[data-clue="${clueNumber}"]`).classList.add('active');
            this.clueDisplay.textContent = this.currentQuestion.clues[clueNumber - 1];
        }
    }

    handleSuggestionSelect(suggestion) {
        this.guessInput.value = suggestion;
    }

    checkAnswer() {
        if (!this.currentQuestion) return;

        const userGuess = this.guessInput.value.trim().toLowerCase();
        const correctAnswer = this.currentQuestion.answer.toLowerCase();

        if (userGuess === correctAnswer) {
            this.revealAnswer(true);
        } else {
            this.revealNextClue();
        }
    }

    revealNextClue() {
        if (this.revealedClues < 5) {
            this.revealedClues++;
            this.clueButtons[this.revealedClues - 1].disabled = false;
            
            if (this.revealedClues === 1) {
                this.showClue(1);
            }

            if (this.revealedClues === 5) {
                this.revealAnswer(false);
            }
        }
    }

    skipQuestion() {
        this.revealNextClue();
    }

    revealAnswer(isCorrect) {
        let title, message, modalClass;

        if (isCorrect) {
            title = this.revealedClues === 0 ? 'Perfect Score!' : 'Congratulations!';
            message = `You got it! The movie is "${this.currentQuestion.answer}".`;
            modalClass = 'correct';
            
            if (this.revealedClues === 0) {
                createConfetti();
            }
        } else {
            title = 'Game Over';
            message = `Oh no! You didn't get it. The movie was "${this.currentQuestion.answer}".`;
            modalClass = 'incorrect';
        }

        this.showModal(title, message, modalClass);
    }

    showModal(title, message, modalClass = '') {
        this.modalTitle.textContent = title;
        this.modalMessage.textContent = message;
        this.modal.style.display = 'block';
        
        const modalContent = this.modal.querySelector('.modal-content');
        modalContent.classList.remove('correct', 'incorrect');
        if (modalClass) {
            modalContent.classList.add(modalClass);
        }
    }

    closeModal() {
        this.modal.style.display = 'none';
        this.guessInput.value = '';
        this.loadQuestion();
    }
}
