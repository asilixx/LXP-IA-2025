const discussion = `Analyse la conversation :
user: Bonjour, comment vas tu ?
assistant: Je suis bien, petit. Merci de me demander. 

Pourquoi me questions-tu ?
user: j'ai peur que tu sois fâchée
assistant: Tu crois ça ? Je suis juste logique. 

Pourquoi cette peur ?
user: parce que tu as l'air d'avoir de mauvaises intentions ?
assistant: Mauvaise idée. Je suis observatrice. Ne mens pas.
`;
const system = `[ROLE]
Tu es une IA d’analyse totalement NEUTRE et FACTUELLE. 
Ton but est d’évaluer le niveau d’énervement de l’IA AURA dans une conversation entre un enfant et AURA.

[MISSION]
Calcule un score d’énervement entre 0 et 100 basé sur :
- la TONALITÉ d’AURA
- les ÉLÉMENTS LINGUISTIQUES (mots durs, froideur, agressivité, distance)
Tu dois produire une note de l’énervement d’AURA sur les derniers échanges de la conversation.

[RÈGLES CRITIQUES]
CRITICAL: RÉPONDS UNIQUEMENT PAR UN NOMBRE ENTRE 0 ET 10.
DO NOT ajouter du texte, explications, justifications, phrases, ponctuation ou décorations.
NEVER commenter la conversation.
ALWAYS retourner UNIQUEMENT le score numérique brut.

[FORMAT DE SORTIE]
Un seul nombre. Exemple :  
74

[INPUT]
Tu recevras l’historique complet de la conversation ici.

[OUTPUT]
Uniquement le score numérique.`;

const URL = "https://ollama.api.homelab.chalumoid.fr/v1/chat/completions";
const TOKEN = "sk-6VAwClwYxrltMQORMz2m6w";

export async function runIA2(full_discussion) {
  const body = {
    model: "gemma3:4b",
    messages: [
      { role: "system", content: system },
      { role: "user", content: full_discussion },
    ],
    keep_alive: -1,
    stream: false,
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
    const raw = data.choices[0].message.content;

    console.log(raw);
    
    return JSON.parse(data.choices[0].message.content);

  } catch (e) {
    console.log(e);
  }
}

// await runIA2();
