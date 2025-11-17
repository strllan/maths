// Times Table Trainer - fixed & improved

const minAInput = document.getElementById("minA");
const maxAInput = document.getElementById("maxA");
const minBInput = document.getElementById("minB");
const maxBInput = document.getElementById("maxB");

const applySettingsBtn = document.getElementById("applySettings");
const settingsError = document.getElementById("settingsError");

const questionText = document.getElementById("questionText");
const answerForm = document.getElementById("answerForm");
const answerInput = document.getElementById("answerInput");
const feedbackEl = document.getElementById("feedback");

const statTotal = document.getElementById("statTotal");
const statCorrect = document.getElementById("statCorrect");
const statAccuracy = document.getElementById("statAccuracy");
const statStreak = document.getElementById("statStreak");

let bounds = {
  minA: 1,
  maxA: 12,
  minB: 1,
  maxB: 12,
};

let currentQuestion = {
  a: null,
  b: null,
};

let stats = {
  total: 0,
  correct: 0,
  streak: 0,
};

function parseIntOrDefault(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? fallback : n;
}

function validateAndSetBounds() {
  const minA = parseIntOrDefault(minAInput.value, bounds.minA);
  const maxA = parseIntOrDefault(maxAInput.value, bounds.maxA);
  const minB = parseIntOrDefault(minBInput.value, bounds.minB);
  const maxB = parseIntOrDefault(maxBInput.value, bounds.maxB);

  if (minA < 0 || maxA < 0 || minB < 0 || maxB < 0) {
    throw new Error("Bounds must be zero or positive.");
  }

  if (minA > maxA) {
    throw new Error("For A: Min must be ≤ Max.");
  }

  if (minB > maxB) {
    throw new Error("For B: Min must be ≤ Max.");
  }

  bounds = { minA, maxA, minB, maxB };
}

function randomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
  const a = randomIntInclusive(bounds.minA, bounds.maxA);
  const b = randomIntInclusive(bounds.minB, bounds.maxB);

  currentQuestion = { a, b };

  questionText.textContent = `${a} × ${b} = ?`;

  // Reset feedback + input
  feedbackEl.textContent = "";
  feedbackEl.classList.remove("correct", "incorrect");

  answerInput.value = "";
  answerInput.focus();
}

function updateStats(isCorrect) {
  stats.total += 1;
  if (isCorrect) {
    stats.correct += 1;
    stats.streak += 1;
  } else {
    stats.streak = 0;
  }

  const accuracy =
    stats.total === 0 ? 0 : Math.round((stats.correct / stats.total) * 100);

  statTotal.textContent = stats.total;
  statCorrect.textContent = stats.correct;
  statAccuracy.textContent = `${accuracy}%`;
  statStreak.textContent = stats.streak;
}

function handleAnswerSubmit(event) {
  if (event) event.preventDefault();

  if (currentQuestion.a === null || currentQuestion.b === null) {
    return;
  }

  const userAnswer = parseInt(answerInput.value, 10);
  const correctAnswer = currentQuestion.a * currentQuestion.b;

  if (Number.isNaN(userAnswer)) {
    feedbackEl.textContent = "Please type a number.";
    feedbackEl.classList.remove("correct");
    feedbackEl.classList.add("incorrect");
    return;
  }

  const isCorrect = userAnswer === correctAnswer;
  updateStats(isCorrect);

  if (isCorrect) {
    feedbackEl.textContent = "✅ Correct! Nice.";
    feedbackEl.classList.remove("incorrect");
    feedbackEl.classList.add("correct");

    // Short pause to see result, then auto-next
    setTimeout(generateQuestion, 350);
  } else {
    feedbackEl.textContent = `❌ Oops. The answer is ${correctAnswer}.`;
    feedbackEl.classList.remove("correct");
    feedbackEl.classList.add("incorrect");
    // You can change your answer and hit Enter again for the next Q
  }
}

function handleApplySettings() {
  try {
    validateAndSetBounds();
    settingsError.textContent = "";
    generateQuestion();
  } catch (err) {
    settingsError.textContent = err.message;
  }
}

function init() {
  // Wire up Apply button
  applySettingsBtn.addEventListener("click", handleApplySettings);

  // Form submit (click or Enter in the input)
  answerForm.addEventListener("submit", handleAnswerSubmit);

  // EXTRA: allow Enter key in the answer box to submit fast
  answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAnswerSubmit();
    }
  });

  // Show an initial question with default bounds
  generateQuestion();
}

// Make sure DOM is ready before wiring up
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
