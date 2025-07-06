const locations = [
  "Sous le lit", "Salle de classe", "Toit d'un immeuble", "Sous-marin", "Aéroport",
  /* ... (les 100 lieux) ... */
  "Tunnel ferroviaire", "Vaisseau alien", "Bunker nucléaire"
];

let roles = [];
let currentPlayer = 0;

// Récupération des éléments
const startBtn    = document.getElementById('startBtn');
const revealBtn   = document.getElementById('revealBtn');
const setupDiv    = document.getElementById('setup');
const gameDiv     = document.getElementById('game');
const playerTitle = document.getElementById('playerTitle');
const roleDisplay = document.getElementById('roleDisplay');

// Liaison des événements
startBtn.addEventListener('click', startGame);
revealBtn.addEventListener('click', revealRole);

function startGame() {
  const playerCount = parseInt(document.getElementById('playerCount').value);
  const spyCount    = parseInt(document.getElementById('spyCount').value);

  if (spyCount >= playerCount) {
    alert("Le nombre d'espions doit être inférieur au nombre de joueurs.");
    return;
  }

  const loc = locations[Math.floor(Math.random() * locations.length)];
  roles = Array(playerCount).fill(loc);
  for (let i = 0; i < spyCount; i++) {
    let r;
    do { r = Math.floor(Math.random() * playerCount); }
    while (roles[r] === 'SPY');
    roles[r] = 'SPY';
  }

  currentPlayer = 0;
  setupDiv.classList.add('hidden');
  gameDiv.classList.remove('hidden');
  updatePlayerTitle();
}

function revealRole() {
  if (revealBtn.innerText === "Afficher mon rôle") {
    roleDisplay.innerText = 
      roles[currentPlayer] === 'SPY' 
        ? "Tu es l'ESPION !" 
        : `Lieu : ${roles[currentPlayer]}`;
    revealBtn.innerText = "Passer au joueur suivant";
  } else {
    currentPlayer++;
    if (currentPlayer >= roles.length) {
      roleDisplay.innerText = "Tous les rôles ont été révélés. Que le jeu commence !";
      revealBtn.style.display = 'none';
      playerTitle.style.display = 'none';
    } else {
      revealBtn.innerText = "Afficher mon rôle";
      roleDisplay.innerText = "";
      updatePlayerTitle();
    }
  }
}

function updatePlayerTitle() {
  playerTitle.innerText = `Joueur ${currentPlayer + 1}`;
}