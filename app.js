/* -------------------------------------------------- */ // Fichier: app.js const locations = [ "Sous le lit", "Salle de classe", "Toit d'un immeuble", "Sous-marin", "Aéroport", "Cinéma", "Train", "Ascenseur", "Cirque", "Zoo", "Restaurant chic", "Plage déserte", "Stade", "Centre commercial", "Hôpital", "Montagne enneigée", "Navette spatiale", "Base militaire", "Cimetière", "Chambre d'hôtel", "Caverne", "Bibliothèque", "Ferme", "Garage", "Château médiéval", "Île tropicale", "Prison", "Théâtre", "Salle d'interrogatoire", "Boîte de nuit", "Piscine municipale", "Camping sauvage", "Cabane dans les arbres", "Toilettes publiques", "Aquarium", "Musée", "Bus scolaire", "Café cosy", "Bateau de croisière", "Maison hantée", "Parc d'attraction", "Station-service", "Désert", "Banquise", "Forêt tropicale", "Labo scientifique", "Base secrète", "Station spatiale", "Métro", "Maison de retraite", "Marché asiatique", "Jungle", "Salle d'escalade", "Stade olympique", "Salle de concert", "Boulangerie", "Caserne de pompiers", "Église", "Temple japonais", "Réseau d’égouts", "Montagne russe", "Serre botanique", "Rue commerçante", "Salle de karaoké", "Planétarium", "Fête foraine", "Mine", "Station de ski", "Croisière fluviale", "Fusée", "Tramway", "Chalet", "Terrasse de café", "Pizzeria", "Dojo", "Caserne militaire", "Gymnase", "Champ de bataille", "Studio de cinéma", "Quartier résidentiel", "Chantier", "Terrain de paintball", "Salon de tatouage", "Studio d’enregistrement", "Antre de hacker", "Salle d’arcade", "Salle de danse", "Club d’échecs", "Salle de sport", "Banque", "Salon de coiffure", "Boutique de magie", "Chambre forte", "Train fantôme", "Base volcanique secrète", "Parc national", "Aire d'autoroute", "Tunnel ferroviaire", "Vaisseau alien", "Bunker nucléaire" ];

let roles = []; let currentPlayer = 0;

// Initialisation des éléments DOM const startBtn = document.getElementById('startBtn'); const revealBtn = document.getElementById('revealBtn'); const setupDiv = document.getElementById('setup'); const gameDiv = document.getElementById('game'); const playerTitle = document.getElementById('playerTitle'); const roleDisplay = document.getElementById('roleDisplay');

startBtn.addEventListener('click', startGame); revealBtn.addEventListener('click', revealRole);

function startGame() { const playerCount = parseInt(document.getElementById('playerCount').value); const spyCount = parseInt(document.getElementById('spyCount').value); if (spyCount >= playerCount) { alert("Le nombre d'espions doit être inférieur au nombre de joueurs."); return; }

const location = locations[Math.floor(Math.random() * locations.length)]; roles = Array(playerCount).fill(location); for (let i = 0; i < spyCount; i++) { let r; do { r = Math.floor(Math.random() * playerCount); } while (roles[r] === 'SPY'); roles[r] = 'SPY'; }

currentPlayer = 0; setupDiv.classList.add('hidden'); gameDiv.classList.remove('hidden'); updatePlayerTitle(); }

function revealRole() { if (revealBtn.innerText === "Afficher mon rôle") { roleDisplay.innerText = roles[currentPlayer] === 'SPY' ? "Tu es l'ESPION !" : Lieu : ${roles[currentPlayer]}; revealBtn.innerText = "Passer au joueur suivant"; } else { currentPlayer++; if (currentPlayer >= roles.length) { roleDisplay.innerText = "Tous les rôles ont été révélés. Que le jeu commence !"; revealBtn.style.display = 'none'; playerTitle.style.display = 'none'; } else { revealBtn.innerText = "Afficher mon rôle"; roleDisplay.innerText = ""; updatePlayerTitle(); } } }

function updatePlayerTitle() { playerTitle.innerText = Joueur ${currentPlayer + 1}; }

