export function handleWin() {
    console.log("🎉 Victoire ! L'IA se calme et le monde est sauvé !");
    
    const winScreen = document.createElement("div");
    winScreen.innerHTML = `
        <h1>🎉 VICTOIRE 🎉</h1>
        <p>Tu as réussi à convaincre l'IA !</p>
    `;
    winScreen.style.cssText = `
        position: fixed; inset: 0;
        background: rgba(0, 255, 100, 0.8);
        display: flex; flex-direction: column;
        justify-content: center; align-items: center;
        font-size: 2rem; color: white;
        z-index: 9999;
    `;
    document.body.appendChild(winScreen);
}

