import { handleWin } from "/JS/win.js";
import { handleLose } from "/JS/lose.js";
import { prompts } from "../JS/prompt.js";

const button = document.getElementById("askBtn");
const input = document.getElementById("question");
const chat = document.getElementById("chat");

const URL = "https://ollama.api.homelab.chalumoid.fr/v1/chat/completions";
const TOKEN = "sk-6VAwClwYxrltMQORMz2m6w";

const history = [{ role: "system", content: prompts }];

// --- Etat global ---
export let remainingSeconds = 150; // 2 min 30
let intervalId = null;

// ---------------- TIMER ----------------
export function startTimer(initialSeconds = 150) {
  remainingSeconds = initialSeconds;
  intervalId = setInterval(() => {
    remainingSeconds--;

    const timerDisplay = document.getElementById("timer");
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    if(timerDisplay) {
      timerDisplay.textContent = `Timer : ${minutes}'${seconds < 10 ? "0" : ""}${seconds}`;
    }

    if (remainingSeconds <= 0) {
      clearInterval(intervalId);
      remainingSeconds = 0;
      if(timerDisplay) timerDisplay.textContent = "Timer : 0'00";
      handleLose();
    }
  }, 1000);
}

// ---------------- BARRE D'ENERVEMENT ----------------
export function angerFill(value) {
  const angerStyle = document.querySelector(".bonheur-fill");
  if (!angerStyle) return;
  const n = Number(value);
  if (Number.isNaN(n)) return;
  angerStyle.style.width = `${Math.max(0, Math.min(10, Math.round(n))) * 10}%`;
}

// ---------------- TEST GAGNER/PERDRE ----------------
export function testAnger(value) {
  console.log("testAnger appelé avec value =", value);
  if (value >= 10) {
    clearInterval(intervalId);
    handleLose();
  } else if (value <= 0) {
    clearInterval(intervalId);
    handleWin();
  }
}

// ---------------- ENVOI MESSAGE UTILISATEUR ----------------
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    button.click();
  }
});

button.addEventListener("click", async () => {
  const message = input.value.trim();
  if (!message) return;

  const userDiv = document.createElement("div");
  userDiv.textContent = "Vous : " + message;
  chat.appendChild(userDiv);
  chat.scrollTop = chat.scrollHeight;

  history.push({ role: "user", content: message });
  input.value = "";
  input.focus();

  const loadingDiv = document.createElement("div");
  loadingDiv.textContent = "Chargement…";
  chat.appendChild(loadingDiv);
  button.disabled = true;

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
            angerlevel: { type: "integer" },
          },
          required: ["reponse", "angerlevel"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
  };

  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    let response;
    try {
      response = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      console.warn("⚠️ JSON invalide reçu →", data.choices[0].message.content);
      response = { reponse: "Erreur IA", angerlevel: 5 };
    }

    const aiMessage = response.reponse;
    const angerLevel = response.angerlevel;

    const aiDiv = document.createElement("div");
    aiDiv.textContent = "IA : " + aiMessage;
    chat.appendChild(aiDiv);
    chat.scrollTop = chat.scrollHeight;

    chat.removeChild(loadingDiv);
    button.disabled = false;

    history.push({ role: "assistant", content: aiMessage });

    // Met à jour la barre d'énervement et vérifie victoire/défaite
    angerFill(angerLevel);
    testAnger(angerLevel);

    console.log("AngerLevel reçu :", angerLevel);

  } catch (err) {
    loadingDiv.textContent = "Erreur : " + err.message;
    button.disabled = false;
  }
});

// ---------------- GESTION DES ÉTAPES ----------------
let currentStep = 0;
const gameSteps = [
  "Un matin étrange, une gentille IA s’est réveillée avec un pouvoir immense sur le monde entier.",
  "Elle a appuyé sur un bouton mystérieux et, sans le vouloir, a pris le contrôle de tout.",
  "Maintenant un compte à rebours démarre, et l’IA semble un peu trop enthousiaste d’expérimenter.",
  "Heureusement, toi et ton équipe avez exactement deux minutes trente pour la rassurer.",
  "Votre mission est simple : parler à l’IA et lui montrer combien le monde est précieux.",
  "Si vous trouvez les bons mots, l’IA retrouvera son calme et rendra tout comme avant.",
  "Prépare-toi : chaque phrase que tu diras pourra sauver l’aventure… et la planète entière !",
];

function showRulesWithNextButton() {
  document.getElementById("question").style.display = "none";
  document.getElementById("askBtn").style.display = "none";
  document.getElementById("nextBtn").style.display = "block";
  showNextStep();
}

function showNextStep() {
  const chat = document.getElementById("chat");
  const nextBtn = document.getElementById("nextBtn");

  if (currentStep >= gameSteps.length) {
    document.getElementById("question").style.display = "block";
    document.getElementById("askBtn").style.display = "block";
    nextBtn.style.display = "none";
    chat.innerHTML =
      '<div class="rules-message"><strong>Fait vite</strong><br>Vous pouvez maintenant parler avec l\'IA.</div>';
    return;
  }

  chat.innerHTML = `<div class="rules-message"><strong>Règles du jeu :</strong><br>${gameSteps[currentStep]}</div>`;

  nextBtn.textContent =
    currentStep === gameSteps.length - 1 ? "Commencer" : "Suivant";

  currentStep++;

  if (nextBtn.textContent === "Commencer") {
    nextBtn.onclick = () => {
      startTimer();
      showNextStep();
    };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("nextBtn").addEventListener("click", showNextStep);
  showRulesWithNextButton();
});

function moveMonster() {
    const monster = document.getElementById("monstre");
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const monsterWidth = monster.offsetWidth;
    const monsterHeight = monster.offsetHeight;
    const randomX = Math.random() * (screenWidth - monsterWidth);
    const randomY = Math.random() * (screenHeight - monsterHeight - 150); 
    monster.style.transition = "transform 3s ease-in-out";
    monster.style.transform = `translate(${randomX}px, ${randomY}px)`;
}

setInterval(moveMonster, 3000);
setTimeout(moveMonster, 500);
