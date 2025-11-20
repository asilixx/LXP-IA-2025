const button = document.getElementById('askBtn');
const input = document.getElementById('question');
const chat = document.getElementById('chat');

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

// const iaAnger = [{
//   role: "system",
//   content: promptAnger
// }]
// ;

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


let intervalId;
let dixiemeglobale = 0;
let minuteglobale = 0;
let secondeglobale = 0;

export function startTimer() {
  let minute = 2;
  let seconde = 30;
  let dixieme = 0;
  intervalId = setInterval(() => {
    seconde--;
    secondeglobale = seconde;
    if (seconde === 60) {
      seconde = 0;
      secondeglobale = seconde;
      minute--;
      minuteglobale = minute;
    }
    if (seconde >= 10) {
      dixieme = "";
      dixiemeglobale = dixieme;
    }

    const timerDisplay = document.getElementById("timer");
    timerDisplay.textContent = `Timer : ${minute}'${dixieme}${seconde}`;
  }, 1000);
}