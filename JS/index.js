const button = document.getElementById('askBtn');
const input = document.getElementById('question');
const chat = document.getElementById('chat');
import { handleWin } from "/JS/win.js";
import { handleLose } from "/JS/lose.js";
import { prompts, promptAnger } from "../JS/prompt.js";

// Gestion de l'historique
const history = [{ role: "system", content: prompts }];

// URL et token API
const URL = "https://ollama.api.homelab.chalumoid.fr/v1/chat/completions";
const TOKEN = "sk-6VAwClwYxrltMQORMz2m6w";

// Événement Enter pour envoyer le message
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    button.click();
  }
});

// Variables globales
export let anger = null;
export let remainingSeconds = 150; // 2 min 30
let intervalId = null;

// Fonction pour formater le temps
export function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const secDisplay = seconds < 10 ? "0" + seconds : seconds;
  return `${minutes}'${secDisplay}`;
}

// Timer principal
export function startTimer(initialSeconds = 150) {
  remainingSeconds = initialSeconds;

  intervalId = setInterval(() => {
    remainingSeconds--;

    const timerDisplay = document.getElementById("timer");
    timerDisplay.textContent = `Timer : ${formatTime(remainingSeconds)}`;

    if (remainingSeconds <= 0) {
      clearInterval(intervalId);
      remainingSeconds = 0;
      timerDisplay.textContent = "Timer : 0'00";
      handleLose();
    }
  }, 1000);
}

export function getMinute() {
  return Math.floor(remainingSeconds / 60);
}

export function getSecond() {
  return remainingSeconds % 60;
}

// Met à jour la barre de bonheur/anger
function angerFill(value) {
  const angerStyle = document.querySelector(".bonheur-fill");
  if (!angerStyle) return;
  const n = Number(value);
  if (Number.isNaN(n)) return;
  const width = Math.max(0, Math.min(10, Math.round(n))) * 10;
  angerStyle.style.width = width + "%";
}

// Vérifie victoire/défaite selon le taux d'énervement
function testAnger(value) {
  if (value >= 10) {
    clearInterval(intervalId);
    handleLose();
  } else if (value <= 0) {
    clearInterval(intervalId);
    handleWin();
  }
}

// Analyse le message IA et met à jour le taux d'énervement
export async function analyzeAnger(aiRawMessage, angerLevel) {
  console.log("RAW exact reçu =", aiRawMessage);
  console.log("🔥 Taux d'enervement =", angerLevel);

  anger = angerLevel;
  angerFill(anger);
  testAnger(anger);

  return anger;
}

// Gestion du bouton d'envoi
button.addEventListener('click', async () => {
  const message = input.value.trim();
  if (!message) return;

  // Affiche le message utilisateur
  const userDiv = document.createElement('div');
  userDiv.textContent = 'Vous : ' + message;
  chat.appendChild(userDiv);
  chat.scrollTop = chat.scrollHeight;

  history.push({ role: "user", content: message });
  input.value = '';
  input.focus();

  // Message de chargement
  const loadingDiv = document.createElement('div');
  loadingDiv.textContent = 'Chargement…';
  chat.appendChild(loadingDiv);

  button.disabled = true;
  chat.scrollTop = chat.scrollHeight;

  const body = {
    model: "gemma3:4b",
    messages: history,
    keep_alive: -1,
    stream: false,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "response_to_student",
        schema: {
          type: "object",
          properties: {
            reponse: { type: "string" },
            angerlevel: { type: "integer" }
          },
          required: ["reponse", "angerlevel"],
          additionalProperties: false
        },
        strict: true
      }
    }
  };

  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    const response = JSON.parse(data.choices[0].message.content);

    const aiMessage = response.reponse;
    const angerLevel = response.angerlevel;

    console.log("Texte IA :", aiMessage);
    console.log("🔥 Taux d'enervement :", angerLevel);

    chat.removeChild(loadingDiv);
    button.disabled = false;

    const aiDiv = document.createElement('div');
    aiDiv.textContent = 'IA : ' + aiMessage;
    chat.appendChild(aiDiv);
    chat.scrollTop = chat.scrollHeight;

    history.push({ role: "assistant", content: aiMessage });

    // Analyse le taux d'énervement
    analyzeAnger(aiMessage, angerLevel);

  } catch (err) {
    console.error("Erreur :", err);
    loadingDiv.textContent = 'Erreur : ' + err.message;
    button.disabled = false;
  }
});

// Étapes de l'histoire avant le chat
let currentStep = 0;
const gameSteps = [
  "Un matin étrange, une gentille IA s’est réveillée avec un pouvoir immense sur le monde entier.",
  "Elle a appuyé sur un bouton mystérieux et, sans le vouloir, a pris le contrôle de tout.",
  "Maintenant un compte à rebours démarre, et l’IA semble un peu trop enthousiaste d’expérimenter.",
  "Heureusement, toi et ton équipe avez exactement deux minutes trente pour la rassurer.",
  "Votre mission est simple : parler à l’IA et lui montrer combien le monde est précieux.",
  "Si vous trouvez les bons mots, l’IA retrouvera son calme et rendra tout comme avant.",
  "Prépare-toi : chaque phrase que tu diras pourra sauver l’aventure… et la planète entière !"
];

function showRulesWithNextButton() {
  document.getElementById('question').style.display = 'none';
  document.getElementById('askBtn').style.display = 'none';
  document.getElementById('nextBtn').style.display = 'block';
  showNextStep();
}

function showNextStep() {
  const chat = document.getElementById('chat');
  const nextBtn = document.getElementById('nextBtn');

  if (currentStep >= gameSteps.length) {
    document.getElementById('question').style.display = 'block';
    document.getElementById('askBtn').style.display = 'block';
    nextBtn.style.display = 'none';
    chat.innerHTML = '<div class="rules-message"><strong>Fait vite</strong><br>Vous pouvez maintenant parler avec l\'IA.</div>';
    return;
  }

  chat.innerHTML = `<div class="rules-message"><strong>Règles du jeu :</strong><br>${gameSteps[currentStep]}</div>`;

  nextBtn.textContent = currentStep === gameSteps.length - 1 ? 'Commencer' : 'Suivant';
  currentStep++;

  if (nextBtn.textContent === 'Commencer') {
    nextBtn.onclick = () => {
      startTimer();
      showNextStep();
    };
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('nextBtn').addEventListener('click', showNextStep);
  showRulesWithNextButton();
});
