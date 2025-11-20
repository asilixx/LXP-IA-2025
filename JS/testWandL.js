import { handleWin } from "/JS/win.js";
import { handleLose } from "/JS/lose.js";
import { prompts, promptAnger } from "/JS/prompt.js";
import { anger } from "./index.js";

  //ma partis : 

export function updateAnger(newValue) {
    anger = newValue;
    console.log("Nouveau taux d'énervement :", anger);

    if (anger >= 7) {
        handleLose();
    } else if (anger <= 4) {
        handleWin();
    }
}

// TESTS
//updateAnger(5);  
