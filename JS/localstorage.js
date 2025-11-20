import { playerName, setPlayerName } from "./win.js";
import { minuteglobale, secondeglobale } from "./index.js";

setInterval(() => {
    if (playerName) {

         const chrono = `${minuteglobale}:${secondeglobale < 10 ? "0" + secondeglobale : secondeglobale}`;

        localStorage.setItem(playerName, chrono);

        console.log(`✔ Score enregistré : ${playerName} → ${chrono}`);

        setPlayerName(null);
    }
}, 500);
