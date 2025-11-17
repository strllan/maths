// Times Table Trainer - auto-focus version

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

  if (minA < 0 || maxA < 0 || minB < 0 || maxB < 0)
    throw new Error("Bounds must be zero or positive.");

  if (minA > maxA) throw new Error("For A: Min must be ≤ Max.");
  if (minB > maxB) throw new Error("For B: Min must be ≤ Max.");

  bounds = { minA, maxA, minB, maxB };
}

function randomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function focusInput() {
  // 30ms delay avoids browser blocking the focus
  setTimeout(() => {
    answerInput.focus();
    answerInput.select();
  }, 30);
}

function generateQuestion() {
  const a = randomIntInclusive(bounds.minA, bounds.maxA);
  const b = randomIntInclusive(bounds.minB, bounds.maxB);

  currentQuestion = { a, b };
  questionText.textContent = `${a} × ${b} = ?`;

  feedbackEl.textContent = "";
  feedbackEl.classList.remove("correct", "incorrect");

  answerInput.value = "";
  focusInput();
}

function updateStats(isCorrect) {
  stats.total++;
  if (isCorrect) {
    stats.correct++;
    stats.streak++;
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

function handleAnswerSubmit(e) {
  if (e) e.preventDefault();

  const userAnswer = parseInt(answerInput.value, 10);
  const correctAnswer = currentQuestion.a * currentQuestion.b;

  if (Number.isNaN(userAnswer)) {
    feedbackEl.textContent = "Please type a number.";
    feedbackEl.classList.remove("correct");
    feedbackEl.classList.add("incorrect");
    focusInput();
    return;
  }

  const isCorrect = userAnswer === correctAnswer;
  updateStats(isCorrect);

  if (isCorrect) {
    feedbackEl.textContent = "✅ Correct!";
    feedbackEl.classList.remove("incorrect");
    feedbackEl.classList.add("correct");

    setTimeout(() => {
      generateQuestion();
      focusInput();
    }, 350);
  } else {
    feedbackEl.textContent = `❌ Incorrect. Answer: ${correctAnswer}`;
    feedbackEl.classList.remove("correct");
    feedbackEl.classList.add("incorrect");

    // Let user type a new answer
    focusInput();
  }
}

function handleApplySettings() {
  try {
    validateAndSetBounds();
    settingsError.textContent = "";
    generateQuestion();
    focusInput();
  } catch (err) {
    settingsError.textContent = err.message;
  }
}

function init() {
  applySettingsBtn.addEventListener("click", handleApplySettings);

  answerForm.addEventListener("submit", handleAnswerSubmit);

  answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAnswerSubmit();
    }
  });

  generateQuestion();
  focusInput();
}

// Ensure initialization
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
