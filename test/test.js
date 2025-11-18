const button = document.getElementById('askBtn');
const input = document.getElementById('question');
const chat = document.getElementById('chat');
const history = []; // stocke le contexte de la conversation
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
  chat.scrollTop = chat.scrollHeight;

  // Prépare le body comme dans ton premier code
  const body = {
    model: "gemma3:4b",  // modèle de ton premier code
    messages: history,
    keep_alive: -1,
    stream: false
  };

  try {
    const res = await fetch(URL, {  // utilise l'URL et le TOKEN de ton premier code
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

    // Affiche le message de l'IA
    const aiDiv = document.createElement('div');
    aiDiv.textContent = 'IA : ' + aiMessage;
    chat.appendChild(aiDiv);
    chat.scrollTop = chat.scrollHeight;

    // Ajoute la réponse de l'IA à l'historique
    history.push({ role: "assistant", content: aiMessage });

  } catch (err) {
    loadingDiv.textContent = 'Erreur : ' + err.message;
  }
});
