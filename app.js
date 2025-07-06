const locations = [
  "Sous le lit", "Salle de classe", "Toit d'un immeuble", "Sous-marin", "Aéroport",
  "Cinéma", "Train", "Ascenseur", "Cirque", "Zoo", "Restaurant chic", "Plage déserte",
  "Stade", "Centre commercial", "Hôpital", "Montagne enneigée", "Navette spatiale",
  "Base militaire", "Cimetière", "Chambre d'hôtel", "Caverne", "Bibliothèque", "Ferme",
  "Garage", "Château médiéval", "Île tropicale", "Prison", "Théâtre", "Salle d'interrogatoire",
  "Boîte de nuit", "Piscine municipale", "Camping sauvage", "Cabane dans les arbres",
  "Toilettes publiques", "Aquarium", "Musée", "Bus scolaire", "Café cosy", "Bateau de croisière",
  "Maison hantée", "Parc d'attraction", "Station-service", "Désert", "Banquise",
  "Forêt tropicale", "Labo scientifique", "Base secrète", "Station spatiale", "Métro",
  "Maison de retraite", "Marché asiatique", "Jungle", "Salle d'escalade", "Stade olympique",
  "Salle de concert", "Boulangerie", "Caserne de pompiers", "Église", "Temple japonais",
  "Réseau d’égouts", "Montagne russe", "Serre botanique", "Rue commerçante", "Salle de karaoké",
  "Planétarium", "Fête foraine", "Mine", "Station de ski", "Croisière fluviale", "Fusée",
  "Tramway", "Chalet", "Terrasse de café", "Pizzeria", "Dojo", "Caserne militaire", "Gymnase",
  "Champ de bataille", "Studio de cinéma", "Quartier résidentiel", "Chantier",
  "Terrain de paintball", "Salon de tatouage", "Studio d’enregistrement", "Antre de hacker",
  "Salle d’arcade", "Salle de danse", "Club d’échecs", "Salle de sport", "Banque",
  "Salon de coiffure", "Boutique de magie", "Chambre forte", "Train fantôme",
  "Base volcanique secrète", "Parc national", "Aire d'autoroute", "Tunnel ferroviaire",
  "Vaisseau alien", "Bunker nucléaire"
];

let roles = [];
let currentPlayer = 0;
let duration = 0;
let countdownInterval = null;

const startBtn = document.getElementById('startBtn');
const revealBtn = document.getElementById('revealBtn');
const setupDiv = document.getElementById('setup');
const gameDiv = document.getElementById('game');
const playerTitle = document.getElementById('playerTitle');
const roleDisplay = document.getElementById('roleDisplay');
const gameInfo = document.getElementById('gameInfo');
const countdown = document.getElementById('countdown');
const startInfo = document.getElementById('startInfo');

startBtn.addEventListener('click', startGame);
revealBtn.addEventListener('click', revealRole);

function startGame() {
  const playerCount = parseInt(document.getElementById('playerCount').value);
  const spyCount = parseInt(document.getElementById('spyCount').value);
  duration = parseInt(document.getElementById('duration').value);

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
  gameInfo.classList.add('hidden');
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
      revealBtn.style.display = 'none';
      playerTitle.style.display = 'none';
      roleDisplay.innerText = "Tous les rôles ont été révélés. Début du jeu !";
      startRound();
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

function startRound() {
  const validPlayers = roles.map((r, i) => r !== 'SPY' ? i : null).filter(i => i !== null);
  const firstPlayer = validPlayers[Math.floor(Math.random() * validPlayers.length)];

  gameInfo.classList.remove('hidden');
  startInfo.innerText = `Le joueur ${firstPlayer + 1} commence !`;

  startCountdown(duration);
}

function startCountdown(seconds) {
  let remaining = seconds;
  countdown.innerText = formatTime(remaining);

  countdownInterval = setInterval(() => {
    remaining--;
    countdown.innerText = formatTime(remaining);

    if (remaining <= 0) {
      clearInterval(countdownInterval);
      countdown.innerText = "⏱ Temps écoulé ! Votez maintenant.";
      window.navigator.vibrate?.(500);
    }
  }, 1000);
}


function formatTime(s) {
  const min = Math.floor(s / 60);
  const sec = s % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}
