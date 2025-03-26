export class NoClueQuiz {
    constructor() {
        this.quoteEl = document.getElementById("movie-quote");
        this.buttons = document.querySelectorAll("#clue-buttons button");
        this.guessInput = document.getElementById("movie-guess");
        this.submitBtn = document.getElementById("submit-btn");
        this.skipBtn = document.getElementById("skip-btn");
        this.modal = document.getElementById("modal");
        this.resultMessage = document.getElementById("result-message");
        this.closeModalBtn = document.getElementById("close-modal");

        this.currentQuestion = null;
        this.shownClues = 0;

        this.init();
    }

    async init() {
        const res = await fetch("/.netlify/functions/get-question");
        this.currentQuestion = await res.json();
        this.quoteEl.textContent = `“${this.currentQuestion.quote}”`;

        this.buttons.forEach((btn, index) => {
            btn.addEventListener("click", () => this.showClue(index));
        });

        this.submitBtn.addEventListener("click", () => this.checkAnswer());
        this.closeModalBtn.addEventListener("click", () => this.modal.hidden = true);
    }

    showClue(index) {
        if (this.currentQuestion && this.currentQuestion.clues[index]) {
            alert(this.currentQuestion.clues[index]);
        }
    }

    checkAnswer() {
        const guess = this.guessInput.value.trim().toLowerCase();
        const answer = this.currentQuestion.answer.toLowerCase();
        const correct = guess === answer;

        this.resultMessage.textContent = correct
            ? "Correct! 🎉"
            : `Nope! The answer was "${this.currentQuestion.answer}".`;

        this.modal.hidden = false;
    }
}