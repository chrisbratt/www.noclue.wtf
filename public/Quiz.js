// Quiz.js
import confetti from "https://cdn.skypack.dev/canvas-confetti";

export class NoClueQuiz {
  renderCountdown() {
    const container = document.getElementById("countdown");
    if (!container) return;

    const countdownText = document.createElement("p");
    countdownText.className = "next-question-countdown";
    container.innerHTML = "";
    container.appendChild(countdownText);

    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const updateCountdown = () => {
      const remaining = Math.max(0, tomorrow - new Date());
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      countdownText.textContent = `⏳ New question in ${hours}h ${minutes}m ${seconds}s`;
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  constructor() {
    this.quoteEl = document.getElementById("movie-quote");
    this.clueEl = document.getElementById("current-clue");
    this.clueEl.classList.add("placeholder");
    this.buttons = document.querySelectorAll("#clue-buttons button");
    this.guessInput = document.getElementById("movie-guess");
    this.submitBtn = document.getElementById("submit-btn");
    this.modal = document.getElementById("modal");
    this.modalText = document.getElementById("result-message");
    this.closeBtn = document.getElementById("close-modal");
    this.incorrectList = document.getElementById("guesses");

    this.clueIndex = 0;
    this.currentQuestion = null;
    this.incorrectGuesses = [];

    this.loadSavedState();
    this.init();
  }

  disableGuessingUI() {
    if (this.guessInput && this.submitBtn) {
      this.guessInput.disabled = true;
      this.submitBtn.disabled = true;
      this.submitBtn.remove();

      const wrapper = this.guessInput.closest('.autocomplete-wrapper');
      if (wrapper) {
        const msg = document.createElement("p");
        msg.className = "result-banner";
        msg.textContent = this.incorrectGuesses.some(g => g.startsWith("✅"))
          ? "🎉 You got it right!"
          : "😢 Better luck next time.";
        wrapper.replaceWith(msg);
      }
    }
    this.saveState();
  }

  saveState() {
    const state = {
      clueIndex: this.clueIndex,
      guesses: this.incorrectGuesses
    };
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  loadSavedState() {
    this.clueIndex = 0;
    this.incorrectGuesses = [];
  }

  restoreState() {
    this.submitBtn.disabled = false;
    this.guessInput.disabled = false;
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      const state = JSON.parse(stored);
      if (state) {
        this.clueIndex = state.clueIndex || 0;
        this.incorrectGuesses = state.guesses || [];

        for (let i = 0; i < this.clueIndex; i++) {
          this.buttons[i].disabled = false;
          this.buttons[i].classList.add("revealed");
        }
        this.clueEl.textContent = this.currentQuestion.clues[this.clueIndex - 1] || "";
        if (this.clueIndex > 0) {
          this.clueEl.classList.remove("placeholder");
          this.buttons[this.clueIndex - 1].classList.add("active");
        }

        this.updateIncorrectList();

        const answeredCorrectly = this.incorrectGuesses.some(g => g.startsWith("✅"));
        const outOfClues = this.clueIndex >= this.currentQuestion.clues.length;
        if (answeredCorrectly || outOfClues) {
          this.disableGuessingUI();
          this.renderCountdown();
        }
      }
    }
  }

  async init() {
    const today = new Date().toISOString().split("T")[0];
    this.storageKey = `noclue-${today}`;
    const res = await fetch("/.netlify/functions/get-question");
    const data = await res.json();

    if (data && data.quote) {
      this.currentQuestion = data;
      this.quoteEl.textContent = `“${this.currentQuestion.quote}”`;
      this.restoreState();
      this.guessInput.disabled = false;
      this.submitBtn.disabled = false;
    } else {
      this.quoteEl.textContent = "⚠️ Failed to load question.";
    }

    this.buttons.forEach((btn, index) => {
      btn.addEventListener("click", () => this.showClue(index));
    });

    this.submitBtn.addEventListener("click", () => this.handleGuess());
    this.closeBtn.addEventListener("click", () => {
      this.modal.hidden = true;
      this.disableGuessingUI();
    });

    this.guessInput.addEventListener("input", () => {
      this.updateSubmitButtonLabel();
    });

    this.updateSubmitButtonLabel();
  }

  updateSubmitButtonLabel() {
    if (!this.submitBtn || !this.guessInput) return;
    this.submitBtn.textContent = this.guessInput.value.trim()
      ? "Submit guess"
      : "Skip and reveal clue";
  }

  handleGuess() {
    const rawGuess = this.guessInput.value.trim();

    if (!rawGuess) {
      this.incorrectGuesses.push("Skipped");
      this.updateIncorrectList();
      this.saveState();
      this.revealClue();
      return;
    }

    const guess = rawGuess.toLowerCase();
    const answer = this.currentQuestion.answer.toLowerCase();

    if (guess === answer) {
      this.triggerSuccess();
    } else {
      this.incorrectGuesses.push(rawGuess);
      this.updateIncorrectList();
      this.revealClue();
    }
    this.guessInput.value = "";
    this.updateSubmitButtonLabel();
  }

  revealClue() {
    this.guessInput.value = "";

    if (this.clueIndex < this.currentQuestion.clues.length) {
      const clue = this.currentQuestion.clues[this.clueIndex];
      this.clueEl.textContent = clue;
      this.clueEl.classList.remove("placeholder");

      this.buttons[this.clueIndex].disabled = false;
      this.buttons[this.clueIndex].classList.add("revealed");

      this.buttons.forEach(btn => btn.classList.remove("active"));
      this.buttons[this.clueIndex].classList.add("active");

      this.clueIndex++;
      this.saveState();
    } else {
      this.triggerFailure();
    }
  }

  showClue(index) {
    if (index < this.clueIndex) {
      this.clueEl.textContent = this.currentQuestion.clues[index];
      this.buttons.forEach(btn => btn.classList.remove("active"));
      this.buttons[index].classList.add("active");
    }
  }

  updateIncorrectList() {
    this.incorrectList.innerHTML = "";
    this.incorrectGuesses.forEach(guess => {
      const li = document.createElement("li");
      const emoji = guess === "Skipped" ? "⏭️" : guess.startsWith("✅") ? "" : "❌";
      li.textContent = guess.startsWith("✅") ? guess : `${emoji} ${guess}`;
      this.incorrectList.appendChild(li);
    });
  }

  triggerSuccess() {
    this.modal.classList.remove("fail");

    const msg =
      this.clueIndex === 0
        ? `Congrats, you beat No Clue!<br>The answer was ${this.currentQuestion.answer}`
        : `Congrats, you got it right with ${this.clueIndex} clue${this.clueIndex > 1 ? "s" : ""}!<br>The answer was ${this.currentQuestion.answer}`;

    this.incorrectGuesses.push(`✅ ${this.currentQuestion.answer}`);
    this.updateIncorrectList();
    this.modalText.innerHTML = msg;
    this.modal.hidden = false;
    this.disableGuessingUI();
    this.renderCountdown();
    this.saveState();

    setTimeout(() => confetti({ zIndex: 3000 }), 150);
  }

  triggerFailure() {
    this.disableGuessingUI();
    this.saveState();
    this.renderCountdown();
    this.modal.classList.add("fail");
    this.modalText.innerHTML = `Oh no! Better luck next time.<br>The answer was ${this.currentQuestion.answer}`;
    this.modal.hidden = false;
  }
}
