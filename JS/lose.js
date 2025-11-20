export function handleLose() {
    console.log("💀 Défaite ! L'IA s'énerve trop… Fin du monde !");
    
    const loseScreen = document.createElement("div");
    loseScreen.innerHTML = `
        <h1>💀 GAME OVER 💀</h1>
        <p>L'IA est entrée en mode destructeur...</p>
    `;
    loseScreen.style.cssText = `
        position: fixed; inset: 0;
        background: rgba(255, 0, 0, 0.8);
        display: flex; flex-direction: column;
        justify-content: center; align-items: center;
        font-size: 2rem; color: white;
        z-index : 9999;
    `;
    document.body.appendChild(loseScreen);
}
