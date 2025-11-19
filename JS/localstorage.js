let nom = "emma";
let temps = "01:48";

localStorage.setItem(nom, temps);

// Fonction pour convertir MM:SS → secondes
function timeToSeconds(timeStr) {
  const [m, s] = timeStr.split(":").map(Number);
  return m * 60 + s;
}

// Récupérer toutes les entrées du localStorage
const entries = Object.entries(localStorage);

// Filtrer uniquement les valeurs au format MM:SS
const users = entries
  .filter(([nom, chrono]) => /^\d{1,2}:\d{2}$/.test(chrono))
  .map(([nom, chrono]) => ({
    nom,
    chrono,
    seconds: timeToSeconds(chrono)
  }));

// Trier par chrono croissant
users.sort((a, b) => a.seconds - b.seconds);

// Afficher dans la console
users.forEach(user => {
  console.log(`${user.nom} : ${user.chrono}`);
});
