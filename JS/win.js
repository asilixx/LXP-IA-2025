export let playerName = null;

export function setPlayerName(name) {
    playerName = name;
}

import { remainingSeconds } from "./index.js"; // pour récupérer le chrono

export function handleWin() {
    console.log("🎉 Victoire ! L'IA se calme et le monde est sauvé !");

    const winScreen = document.createElement("div");
    winScreen.style.cssText = `
        position: fixed; inset: 0; background: rgba(0, 255, 100, 0.85);
        display: flex; justify-content: center; align-items: center; z-index: 9999;
        font-family: Arial, sans-serif;
    `;

    const box = document.createElement("div");
    box.style.cssText = `
        background: white; padding: 30px 40px; border-radius: 12px;
        text-align: center; color: black; width: 350px;
        box-shadow: 0 0 25px rgba(0,0,0,0.3);
    `;

    box.innerHTML = `
        <h1>🎉 VICTOIRE 🎉</h1>
        <p>Tu as réussi à convaincre l'IA !</p>
        <p><strong>Entre ton nom :</strong></p>
        <input id="playerNameInput" type="text" placeholder="Ton nom"
               style="padding:10px; width:100%; margin-top:10px; border-radius:6px; border:1px solid #ccc; font-size:1rem;">
        <button id="validateNameBtn"
            style="margin-top:15px;padding:10px 20px;background:#00c853;color:white;border:none;border-radius:6px;cursor:pointer;">
            Valider
        </button>
    `;

    winScreen.appendChild(box);
    document.body.appendChild(winScreen);

    const btn = box.querySelector("#validateNameBtn");
    const input = box.querySelector("#playerNameInput");

   btn.addEventListener("click", () => {
    const name = input.value.trim();

    if (!name) {
        input.style.border = "2px solid red";
        return;
    }

    setPlayerName(name); // Met à jour la variable exportée

    // Calcul du temps écoulé
    const TOTAL_TIME = 150; // 2 min 30
    const elapsed = TOTAL_TIME - remainingSeconds; // remainingSeconds vient de index.js
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const chrono = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    // Sauvegarde dans localStorage
    localStorage.setItem(name, chrono);
    console.log(`✔ Score enregistré : ${name} → ${chrono}`);

    // Supprime la popup
    winScreen.remove();

    // Redirige vers classement
    window.location.href = "classement.html";
});

}
