// Times Table Trainer
// Vanilla JS, no external deps.

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
  const maxA = parseIntOrDefault(maxAInput.value,
