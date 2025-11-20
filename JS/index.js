const button = document.getElementById('askBtn');
const input = document.getElementById('question');
const chat = document.getElementById('chat');
import { handleWin } from "/JS/win.js";
import { handleLose } from "/JS/lose.js";

import { prompts, promptAnger } from "../JS/prompt.js";

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); // évite le saut de ligne
    button.click();     // déclenche le même code que le bouton
  }
});

const history = [ {
  role: "system",
  content: prompts
}];



const URL = "https://ollama.api.homelab.chalumoid.fr/v1/chat/completions";
const TOKEN = "sk-6VAwClwYxrltMQORMz2m6w";

button.addEventListener('click', async () => {
  const message = input.value.trim();
  if (!message) return;

  // Affiche le message utilisateur
  const userDiv = document.createElement('div');
  userDiv.textContent = 'Vous : ' + message;
  chat.appendChild(userDiv);
  chat.scrollTop = chat.scrollHeight;

  // Ajoute le message à l'historique
  history.push({ role: "user", content: message });
  input.value = '';
  input.focus();

  // Message de chargement
  const loadingDiv = document.createElement('div');
  loadingDiv.textContent = 'Chargement…';
  chat.appendChild(loadingDiv);

  // Désactive le bouton
  button.disabled = true;
  chat.scrollTop = chat.scrollHeight;

  const body = {
    model: "gemma3:4b",  
    messages: history,
    keep_alive: -1,
    stream: false
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
    const aiMessage = data.choices[0].message.content;

    // Supprime le message de chargement
    chat.removeChild(loadingDiv);

    // Réactive le bouton
    button.disabled = false;

    // Affiche le message de l'IA
    const aiDiv = document.createElement('div');
    aiDiv.textContent = 'IA : ' + aiMessage;
    chat.appendChild(aiDiv);
    chat.scrollTop = chat.scrollHeight;

    // Ajoute la réponse de l'IA à l'historique
    history.push({ role: "assistant", content: aiMessage });
    analyzeAnger(aiMessage);

  } catch (err) {
    loadingDiv.textContent = 'Erreur : ' + err.message;
    button.disabled = false; // aussi réactiver en cas d'erreur
  }
});

// === SYSTÈME D'ÉTAPES AVEC BOUTON HTML ===
let currentStep = 0;
const gameSteps = [
    "Bonjour Dimitri, tu es la dernière personne qui peux sauver le monde"
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
        chat.innerHTML = '<div class="rules-message"><strong>Bienvenue !</strong><br>Vous pouvez maintenant parler avec l\'IA.</div>';
        return;
    }
    
    chat.innerHTML = `<div class="rules-message"><strong>Règles du jeu :</strong><br>${gameSteps[currentStep]}</div>`;
    
    // Définir le texte du bouton
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

// ======================================================
// IA 2 : Analyseur du taux d’énervement
// ======================================================

// Prompt qui demande STRICTEMENT un JSON
export let anger = null
async function analyzeAnger(auraMessage) {

  const angerBody = {
    model: "gemma3:4b",
    messages: [
      { role: "system", content: promptAnger },
      { role: "user", content: auraMessage }
    ],
    keep_alive: -1,
    stream: false
  };

  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(angerBody)
    });

    const data = await res.json();
    const raw = data.choices[0].message.content;

    // Essaie de lire le JSON
    anger = 5;
    try {
      anger = JSON.parse(raw).anger;
    } catch (e) {
      console.warn("Analyseur : JSON invalide reçu →", raw);
    }

    console.log("🔥 Taux d'énervement :", anger);
    testAnger(anger)
    angerFill(anger)
    return anger;

  } catch (err) {
    console.error("Erreur analyse IA :", err);
    return null;
  }
}



let intervalId;
export let minuteglobale = 2;
export let secondeglobale = 0;

export function startTimer() {
  let minute = 2;
  let seconde = 30;

  intervalId = setInterval(() => {

    seconde--;
    secondeglobale = seconde;

    // Quand les secondes passent sous 0 → on retire 1 minute
    if (seconde < 0) {
      minute--;
      minuteglobale = minute;
      seconde = 59;  // on repart sur 59 sec
      secondeglobale = seconde;
    }

    // Affichage formaté
    const timerDisplay = document.getElementById("timer");
    const secDisplay = seconde < 10 ? "0" + seconde : seconde;
    timerDisplay.textContent = `Timer : ${minute}'${secDisplay}`;

    // Timer terminé ?
    if (minute <= 0 && seconde <= 0) {
      clearInterval(intervalId);
      timerDisplay.textContent = "Timer : 0'00";
      handleLose();
    }

  }, 1000);
}



function testAnger() {
    if (anger >= 10 ) {
        clearInterval(intervalId)
        handleLose();
    } else if (anger <= 8) {
        clearInterval(intervalId);
        handleWin();
    }
}

function angerFill(value) {
  const angerStyle = document.querySelector(".bonheur-fill");
  if (!angerStyle) return; // élément non trouvé
  const n = Number(value);
  if (Number.isNaN(n)) return; // valeur invalide
  const width = Math.max(0, Math.min(10, Math.round(n))) * 10;
  angerStyle.style.width = width + "%";
}

