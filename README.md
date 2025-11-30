🌌 Aura – IA de Débat

Projet développé dans le cadre du Hackathon EFREI 2025 (novembre)

🎯 Présentation

Aura est une intelligence artificielle conçue pour débattre avec l’utilisateur sur différents sujets.
L’objectif du projet est de créer une expérience interactive où l’utilisateur peut échanger, argumenter et tester la capacité de l’IA à raisonner, contredire et défendre un point de vue.

Ce projet a été développé durant le Hackathon 2025 de l’école EFREI, dans un temps limité, par une équipe dédiée à l'exploration des interactions homme–IA.

🧠 Fonctionnalités

💬 Débat en temps réel avec Aura

🧭 Gestion dynamique des arguments

🎭 Personnalité configurable de l’IA (selon le prompt défini)

🕒 Système de timer de débat (gestion du temps de parole)

📊 Classement / leaderboard

🎨 Interface web complète (HTML / CSS / JS)

🤖 Intégration d’un modèle LLM via Ollama

🛠️ Technologies utilisées
Technologie	Description
JavaScript	Logique de débat, dynamique du chat, gestion du timer
HTML / CSS	Interface utilisateur
Ollama	Exécution locale du modèle IA
Node.js (package.json)	Dépendances et scripts
📁 Structure du projet
LXP-IA-2025
├── CSS/               # Styles de l'interface
├── JS/                # Scripts (logique du débat, timer...)
├── assets/            # Images, icônes...
├── node_modules/      # Dépendances Node
├── index.html         # Page d’accueil / interface de débat
├── classement.html    # Système de classement
├── prompt_ai1.txt     # Prompt principal définissant Aura
├── package.json       # Dépendances
└── package-lock.json

🚀 Installation & Lancement
1️⃣ Installer les dépendances
npm install

2️⃣ Installer et configurer Ollama

Assurez-vous qu’Ollama est installé sur votre machine.

Exemple pour lancer un modèle :

ollama run mistral

3️⃣ Lancer l’interface

Il suffit d’ouvrir index.html dans un navigateur.

👥 Équipe

Projet réalisé par :

asilix ( Paul )

Astar2493 ( Mael )

cimc0 ( Dimitri )

📜 Licence

Ce projet est développé dans le cadre d’un hackathon éducatif.
Usage libre et modifiable selon vos besoins.
