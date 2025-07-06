let roles = [];
let currentPlayer = 0;
let duration = 0;
let countdownInterval = null;
let activeLocations = JSON.parse(localStorage.getItem("locations")) || [];
let funRules = JSON.parse(localStorage.getItem("funRules")) || [];

const defaultLocations = [
  "Sous le lit", "Ascenseur", "Cirque", "Sous la mer", "Château", "Aéroport", "École", "Bunker", "Toilettes publiques",
  "Parc d’attraction", "Hôpital", "Piscine", "Forêt", "Désert", "Maison hantée", "Cimetière", "Salle de sport", "Zoo",
  "Train", "Métro", "Cabane dans les bois", "Salle d'interrogatoire", "Navette spatiale", "Croisière", "Banque",
  "Boîte de nuit", "Planétarium", "Salon de tatouage", "Labo scientifique", "Restaurant", "Montagne", "Base militaire",
  "Terrain de foot", "Café", "Studio TV", "Camion", "Garage", "Mine", "Chantier", "Île", "Dojo", "Camping", "Maison",
  "Studio d’enregistrement", "Rue commerçante", "Marché asiatique", "Temple", "Église", "Salon de coiffure", "Serre",
  "Bus", "Ambassade", "Toit", "Salle d’escalade", "Club d’échecs", "Fête foraine", "Tramway", "Bateau pirate",
  "Terrain de paintball", "Boutique magique", "Bar", "Station-service", "Jungle", "Épicerie", "Antarctique", "Banquise",
  "Vaisseau alien", "Base volcanique", "Maison de retraite", "Studio photo", "Aire d’autoroute", "Salle de karaoké",
  "Chambre d’hôtel", "Chambre forte", "Parking souterrain", "Station de ski", "Ferme", "Caserne", "Boutique high-tech",
  "Cave à vin", "Salle de concert", "Montagne russe", "Aquarium", "Caserne de pompiers", "Écurie", "Salle d'arcade",
  "Cuisine de restaurant", "Terrasse", "Observatoire", "Garage souterrain", "Prison", "Chambre d'enfant", "Salon VIP",
  "Téléphérique", "Abri antiatomique", "Tunnel", "Complexe sportif", "Salon d’esthétique", "Toit d’un immeuble"
];

const defaultFunRules = [
  "Tu ne peux dire que des verbes.",
  "Tu dois parler en rigolant.",
  "Tu dois être suspicieux.",
  "Tu dois dire ton mot à l’envers.",
  "Tu dois parler en chuchotant."
];

if (activeLocations.length === 0) {
  activeLocations = defaultLocations.map(loc => ({ name: loc, active: true }));
  localStorage.setItem("locations", JSON.stringify(activeLocations));
}
if (funRules.length === 0) {
  funRules = defaultFunRules.map(rule => ({ text: rule, active: true }));
  localStorage.setItem("funRules", JSON.stringify(funRules));
}

const startBtn = document.getElementById('startBtn');
const revealBtn = document.getElementById('revealBtn');
const restartBtn = document.getElementById('restartBtn');
const setupDiv = document.getElementById('setup');
const gameDiv = document.getElementById('game');
const playerTitle = document.getElementById('playerTitle');
const roleDisplay = document.getElementById('roleDisplay');
const gameInfo = document.getElementById('gameInfo');
const countdown = document.getElementById('countdown');
const startInfo = document.getElementById('startInfo');

const toggleLocations = document.getElementById("toggleLocations");
const locationSettings = document.getElementById("locationSettings");
const locationList = document.getElementById("locationList");
const newLocation = document.getElementById("newLocation");
const addLocationBtn = document.getElementById("addLocation");
const closeLocationsBtn = document.getElementById("closeLocations");

const toggleFun = document.getElementById("toggleFun");
const funSettings = document.getElementById("funSettings");
const funList = document.getElementById("funList");
const newFunRule = document.getElementById("newFunRule");
const addFunRuleBtn = document.getElementById("addFunRule");
const closeFunBtn = document.getElementById("closeFun");

startBtn.addEventListener('click', startGame);
revealBtn.addEventListener('click', revealRole);
restartBtn.addEventListener('click', () => location.reload());

toggleLocations.onclick = () => {
  renderLocationList();
  locationSettings.classList.toggle("hidden");
};
closeLocationsBtn.onclick = () => locationSettings.classList.add("hidden");

toggleFun.onclick = () => {
  renderFunList();
  funSettings.classList.toggle("hidden");
};
closeFunBtn.onclick = () => funSettings.classList.add("hidden");

addLocationBtn.onclick = () => {
  const loc = newLocation.value.trim();
  if (loc) {
    activeLocations.push({ name: loc, active: true });
    newLocation.value = "";
    updateLocations();
    renderLocationList();
  }
};

addFunRuleBtn.onclick = () => {
  const rule = newFunRule.value.trim();
  if (rule) {
    funRules.push({ text: rule, active: true });
    newFunRule.value = "";
    updateFunRules();
    renderFunList();
  }
};

function renderLocationList() {
  locationList.innerHTML = "";
  activeLocations.forEach((loc, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <label>
        <input type="checkbox" ${loc.active ? "checked" : ""} onchange="toggleLoc(${index})">
        ${loc.name}
      </label>
      <button class="remove-btn" onclick="removeLoc(${index})">✖</button>
    `;
    locationList.appendChild(li);
  });
}
function renderFunList() {
  funList.innerHTML = "";
  funRules.forEach((rule, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <label>
        <input type="checkbox" ${rule.active ? "checked" : ""} onchange="toggleFunRule(${index})">
        ${rule.text}
      </label>
      <button class="remove-btn" onclick="removeFunRule(${index})">✖</button>
    `;
    funList.appendChild(li);
  });
}

function toggleLoc(i) {
  activeLocations[i].active = !activeLocations[i].active;
  updateLocations();
}
function removeLoc(i) {
  activeLocations.splice(i, 1);
  updateLocations();
  renderLocationList();
}
function updateLocations() {
  localStorage.setItem("locations", JSON.stringify(activeLocations));
}

function toggleFunRule(i) {
  funRules[i].active = !funRules[i].active;
  updateFunRules();
}
function removeFunRule(i) {
  funRules.splice(i, 1);
  updateFunRules();
  renderFunList();
}
function updateFunRules() {
  localStorage.setItem("funRules", JSON.stringify(funRules));
}

function startGame() {
  const playerCount = parseInt(document.getElementById('playerCount').value);
  const spyCount = parseInt(document.getElementById('spyCount').value);
  duration = parseInt(document.getElementById('duration').value);

  const possibleLocations = activeLocations.filter(l => l.active);
  if (spyCount >= playerCount || possibleLocations.length === 0) {
    alert("Erreur : vérifie le nombre d'espions ou les lieux activés.");
    return;
  }

  const loc = possibleLocations[Math.floor(Math.random() * possibleLocations.length)].name;
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
  revealBtn.style.display = 'inline-block';
  playerTitle.style.display = 'block';
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
  startInfo.innerText = `🎲 Le joueur ${firstPlayer + 1} commence !`;
  restartBtn.classList.add('hidden');
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
      restartBtn.classList.remove('hidden');
      try {
        navigator.vibrate?.(500);
      } catch (e) {}
    }
  }, 1000);
}

function formatTime(s) {
  const min = Math.floor(s / 60);
  const sec = s % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}