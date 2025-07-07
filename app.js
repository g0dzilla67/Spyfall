let roles = [];
let funForPlayers = [];
let currentPlayer = 0;
let duration = 0;
let countdownInterval = null;
let activeLocations = JSON.parse(localStorage.getItem("locations")) || [];
let funRules = JSON.parse(localStorage.getItem("funRules")) || [];

const defaultLocations = [
  "Banque", "Plage", "Base militaire", "Train", "Avion", "Restaurant", "Hôpital", "École", "Hôtel", "Supermarché",
  "Bateau de croisière", "Cirque", "Ambassade", "Station spatiale", "Caserne de pompiers", "Cinéma", "Casino", "Prison",
  "Cathédrale", "Marché", "Chantier", "Zoo", "Parc d’attractions", "Musée", "Station de ski", "Piscine", "Ferme",
  "Université", "Montagne", "Camping", "Submarine", "Jungle", "Café", "Salon de coiffure", "Galerie d’art", "Bibliothèque",
  "Château", "Stade", "Garage", "Manoir", "Opéra", "Cimetière", "Monastère", "Pompe à essence", "Quincaillerie",
  "Boutique de vêtements", "Studio TV", "Station essence", "Parc", "Salle de sport", "Discothèque", "Mairie", "Crèche",
  "Garderie", "Salle de concert", "Aéroport", "Forêt", "Cabane", "Salle informatique", "Bureau", "Salle de jeux vidéo",
  "Dojo", "Salle d’escalade", "Animalerie", "Salle de danse", "Garage automobile", "Caserne militaire", "Montagne russe",
  "Salon de tatouage", "Salle de réunion", "Salle de classe", "Salle de réception", "Salle d’attente", "Laboratoire",
  "Ranch", "Usine", "Champ de bataille", "Plage nudiste", "Fête foraine", "Église", "Mosquée", "Synagogue", "Temple",
  "Orphelinat", "Maison hantée", "Salle de boxe", "Salle des fêtes", "Patinoire", "Terrain de foot", "Terrain de basket",
  "Terrain de tennis", "Terrasse", "Boulangerie", "Fromagerie", "Pizzeria", "Bar", "Brasserie", "Vignoble", "Cave à vin",
  "Aquarium", "Planétarium"
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
const funDisplay = document.getElementById('funDisplay');

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

const funModeCheckbox = document.getElementById('funMode');
const funChanceInput = document.getElementById('funChance');
const funChanceContainer = document.getElementById('funChanceContainer');

// --- Patch localStorage : restauration ---
if (localStorage.getItem('funMode') !== null) {
  funModeCheckbox.checked = localStorage.getItem('funMode') === 'true';
  funChanceContainer.classList.toggle("hidden", !funModeCheckbox.checked);
}
if (localStorage.getItem('funChance')) {
  funChanceInput.value = localStorage.getItem('funChance');
}
if (localStorage.getItem('playerCount')) {
  document.getElementById('playerCount').value = localStorage.getItem('playerCount');
}
if (localStorage.getItem('spyCount')) {
  document.getElementById('spyCount').value = localStorage.getItem('spyCount');
}
if (localStorage.getItem('duration')) {
  document.getElementById('duration').value = localStorage.getItem('duration');
}

// --- Patch localStorage : sauvegarde auto ---
funModeCheckbox.onchange = () => {
  funChanceContainer.classList.toggle("hidden", !funModeCheckbox.checked);
  localStorage.setItem('funMode', funModeCheckbox.checked);
};
funChanceInput.oninput = () => {
  localStorage.setItem('funChance', funChanceInput.value);
};
document.getElementById('playerCount').oninput = (e) => {
  localStorage.setItem('playerCount', e.target.value);
};
document.getElementById('spyCount').oninput = (e) => {
  localStorage.setItem('spyCount', e.target.value);
};
document.getElementById('duration').oninput = (e) => {
  localStorage.setItem('duration', e.target.value);
};

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
  const funModeEnabled = funModeCheckbox.checked;
  const funChance = parseInt(funChanceInput.value) || 0;

  const possibleLocations = activeLocations.filter(l => l.active);
  const activeFunRules = funRules.filter(f => f.active);

  if (spyCount >= playerCount || possibleLocations.length === 0) {
    alert("Erreur : vérifie le nombre d'espions ou les lieux activés.");
    return;
  }

  const loc = possibleLocations[Math.floor(Math.random() * possibleLocations.length)].name;
  roles = Array(playerCount).fill(loc);
  funForPlayers = Array(playerCount).fill(null);

  // Ajout des espions
  for (let i = 0; i < spyCount; i++) {
    let r;
    do { r = Math.floor(Math.random() * playerCount); }
    while (roles[r] === 'SPY');
    roles[r] = 'SPY';
  }

  // Ajout des défis fun
  if (funModeEnabled) {
    for (let i = 0; i < playerCount; i++) {
      if (roles[i] !== 'SPY' && Math.random() < funChance / 100) {
        const chosen = activeFunRules[Math.floor(Math.random() * activeFunRules.length)];
        funForPlayers[i] = chosen?.text || null;
      }
    }
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
  funDisplay.innerText = "";
  if (revealBtn.innerText === "Afficher mon rôle") {
    if (roles[currentPlayer] === 'SPY') {
      roleDisplay.innerText = "Tu es l'ESPION !";
    } else {
      roleDisplay.innerText = `Lieu : ${roles[currentPlayer]}`;
      if (funForPlayers[currentPlayer]) {
        funDisplay.innerText = `🎭 Défi : ${funForPlayers[currentPlayer]}`;
      }
    }
    revealBtn.innerText = "Passer au joueur suivant";
  } else {
    currentPlayer++;
    if (currentPlayer >= roles.length) {
      revealBtn.style.display = 'none';
      playerTitle.style.display = 'none';
      roleDisplay.innerText = "Tous les rôles ont été révélés. Début du jeu !";
      funDisplay.innerText = "";
      startRound();
    } else {
      revealBtn.innerText = "Afficher mon rôle";
      roleDisplay.innerText = "";
      funDisplay.innerText = "";
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


// --- Import / Export JSON boutons ---
const exportDataBtn = document.getElementById("exportDataBtn");
const importDataBtn = document.getElementById("importDataBtn");

exportDataBtn.onclick = () => {
  const data = {
    locations: activeLocations,
    funRules: funRules
  };
  const json = JSON.stringify(data, null, 2);
  navigator.clipboard.writeText(json).then(() => {
    alert("📋 Données copiées dans le presse-papiers !");
  }).catch(() => {
    alert("❌ Impossible de copier dans le presse-papiers.");
  });
};

importDataBtn.onclick = () => {
  const input = prompt("Collez ici les données JSON à importer :");
  if (!input) return;

  try {
    const data = JSON.parse(input);

    if (!Array.isArray(data.locations) || !Array.isArray(data.funRules)) {
      throw new Error("Format invalide.");
    }

    activeLocations = data.locations;
    funRules = data.funRules;
    updateLocations();
    updateFunRules();

    alert("✅ Données importées avec succès !");
  } catch (e) {
    alert("❌ Erreur d'importation : Données invalides.");
  }
};