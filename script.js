const inputJ1 = document.getElementById('J1-nom');
const inputJ2 = document.getElementById('J2-nom');
const damier = document.getElementById('damier');
const generate = document.getElementById('generate');
const coordinates = document.getElementById('coord');
const cpuActivated = document.getElementById("J2-cpu")
const spanJ1c = document.getElementById("score1");
const spanJ2c = document.getElementById("score2");


/* Vérifier s'il y a les noms des joueurs */
function checkValues() {
	if(cpuActivated.value == "1") {
		/* Si CPU, désactiver uniquement si nom du joueur 1 est vide OU si nom = CPU */
		generate.disabled = (inputJ1.value === "") || (inputJ1.value == "CPU") ? true : false;
	} else {
		/* Désactiver le bouton "Générer" si axeX ET/OU axeY est vide OU si les noms sont identiques */
		generate.disabled = (inputJ1.value === "" && inputJ2.value === "") || (inputJ1.value === "" || inputJ2.value === "") || (inputJ1.value == inputJ2.value) ? true : false;
	}
}

/* Afficher/masquer l'input du J2 */
function showNameJ2() {
	let checkBox = document.getElementById("checkbox");
	let changeCPU = document.getElementById("CPU--J2");
	let showJ2 = document.getElementById("J2-nom");

	/* Gestion du CPU et du joueur 2 */
	if (checkBox.checked) {
		changeCPU.innerText = "Joueur 2";
		showJ2.style.display = "block";
		/* Si la checkbox est coché, le cpu est désactivé */
		cpuActivated.value = "0";
		/* Re-vérifier les noms des joueurs */
		checkValues();
	} else {
		changeCPU.innerText = "CPU";
		showJ2.style.display = "none";
		cpuActivated.value = "1";
		checkValues();
	}
}


class Morpion {
	constructor() {
		this.grid = ['','','','','','','','',''];
		this.score = [0,0,0];
		this.moves = 0;
		this.div = 0;
		this.winCond = false;
		this.victory = [
			[0,1,2],
			[3,4,5],
			[6,7,8],
			[0,3,6],
			[1,4,7],
			[2,5,8],
			[0,4,8],
			[2,4,6]
		];
		this.player1 = { 
			name: inputJ1.value,
			bgColor: "playerOne",
			color: "color1"
		}
		this.player2 = { 
			name: inputJ2.value,
			bgColor: "playerTwo",
			color: "color2"
		}
		this.playerName = this.player1.name;
		this.player2.name = this.player2.name === "" ? this.player2.name = "CPU" : this.player2.name;
	}

	playerTurn() {
		/* Le joueur commence toujours en premier : no pity for the fool */
		if(this.winCond && cpuActivated.value == "1") {
			this.playerName = this.player1.name;
		}
		/* Sinon on change de joueur (et que le perdant commence en premier) */ 
		else {

			this.playerName = this.playerName === this.player1.name ? this.player2.name : this.player1.name;
		}

		/* Gestion de l'IA unbelievebolia -- Si c'est au tour du CPU de jouer */
		if (!this.winCond && this.playerName === this.player2.name && cpuActivated.value == "1") {

			/* Get de toutes les cases */
			let randomDiv = document.getElementsByClassName('widthX');

			/* Boucle pour trouver une case vide ne contenant pas la classe CSS "played" */
			while (true) {
				/* Ou l'IA choisit une case au hasard */
				var randomizer = randomDiv[Math.floor(Math.random() * randomDiv.length)];

				/* On boucle jusqu'à trouver le graal */
				if(!(randomizer.classList.contains("played"))) {
					var selectId = randomizer.id;

					coordinates.innerText = `${this.playerName} joue n'importe comment\r\nC'est au tour de : ${this.playerName === this.player1.name ? this.player2.name : this.player1.name}.`;

					/* On arrête la boucle avec break */
					break;
				}
			}

			/* Vérifier si l'IA peut contrer le joueur (l'IA est belliqueuse) */
			for (let p = 0; p < this.victory.length; p++) {
				/* A la recherche de la combinaison gagnante */
				let w = this.grid[this.victory[p][0]];
				let i = this.grid[this.victory[p][1]];
				let n = this.grid[this.victory[p][2]];

				/* Vérifier si le joueur est sur le point de gagner */
				if ((w == i && w == this.player1.name && n == "") || (w == n && w == this.player1.name && i == "") || (i == n && i == this.player1.name && w == "")) {

					/* Et l'en empêcher */
					if (this.grid[this.victory[p][0]] == "") {
						var selectId = this.victory[p][0];
					} else if (this.grid[this.victory[p][1]] == "") {
						var selectId = this.victory[p][1];
					} else if (this.grid[this.victory[p][2]] == "") {
						var selectId = this.victory[p][2];
					}
					var randomizer = randomDiv[selectId];
					coordinates.innerText = `Le ${this.playerName} contre-attaque ! \r\n C'est au tour de : ${this.playerName === this.player1.name ? this.player2.name : this.player1.name}.`;

					/* On arrête la boucle avec break */
					break;
				}
			}

			/* Placer le symbole dans la div */
			let symbolHover = document.createElement("DIV");
			this.playerName === this.player1.name ? symbolHover.classList.add("player", this.player1.bgColor, this.player1.color) : symbolHover.classList.add("player", this.player2.bgColor, this.player2.color);
			randomizer.appendChild(symbolHover);
			randomizer.classList.add("played");

			/* Retenir la case qui a été jouée */
			this.grid[selectId] = this.playerName;

			/* Incrémenter le tour de jeu */
			this.moves++;

			/* Afficher toutes les infos du tour de jeu */
			document.getElementById("information").innerText = `Tour n°${this.moves}`;
			
			/* Vérifier si un gagnant + changer de joueur */
			this.checkWin().playerTurn();
		}
		return this;
	}

	checkWin() {
		/* Boucle pour vérifier si victoire */
		for(let k = 0; k < this.victory.length; k++) {

			/* A la recherche de la combinaison gagnante */
			let d = this.grid[this.victory[k][0]];
			let e = this.grid[this.victory[k][1]];
			let f = this.grid[this.victory[k][2]];
			/* A la recherche des cases de la combinaison gagnante */
			let x = this.victory[k][0];
			let y = this.victory[k][1];
			let z = this.victory[k][2];

			if(d == e && d == f && d != "") {
				/* Coloriser les cases de la ligne gagnante */
				let selectDiv = document.getElementsByClassName('widthX');
				selectDiv[x].classList.add("backgroundColorWin");
				selectDiv[y].classList.add("backgroundColorWin");
				selectDiv[z].classList.add("backgroundColorWin");

				/* Incrémenter le score du gagnant et actualiser le score */
				this.playerName == this.player1.name ? this.score[0]++ : this.score[1]++;
				this.playerName == this.player1.name ? spanJ1c.textContent = `${this.score[0]}` : spanJ2c.textContent = `${this.score[1]}`;

				/* Afficher le gagnant */
				coordinates.innerText = `${this.playerName} remporte cette manche.`;
				this.endGame();
			}
		}
		/* Si match nul */
		if (!this.winCond && this.moves === 9) {
			/* Match nul, incrémenter le compteur Egalité et l'actualiser */
			this.score[2]++;
			document.getElementById("scoreD").textContent = `${this.score[2]}`;

			coordinates.innerText = `Match nul.`;
			this.endGame();
		}
		return this;
	}

	endGame() {
		/* That's all folks -- la partie est terminée */
		
		/* Masquer le damier avec un div légérement translucide */
		let dimmer = document.createElement("DIV");
		dimmer.classList.add("dimmer");
		damier.appendChild(dimmer);

		/* Popup pour relancer une partie */
		let popup = document.createElement("DIV");
		popup.classList.add("popup");
		setTimeout(function(){ damier.appendChild(popup)}, 400);

		/* Relancer une partie quand on clique sur l'image */
		popup.addEventListener('click', () => {
			this.restartGame();
		});

		/* C'est fini, la manche est vérrouillée */
		this.winCond = true;

		return this;
	}

	create(e,f,i,j) {
		/* Si la case est vide, alors on place le symbole du joueur */
		if (!this.winCond && this.grid[f] == "") {
			/* Création d'une div pour accueillir la croix ou le rond (la magie opère avec la propriété CSS mask) */
			let symbolHover = document.createElement("DIV");

			/* Placer le symbole dans la div */
			this.playerName === this.player1.name ? symbolHover.classList.add("player", this.player1.bgColor, this.player1.color) : symbolHover.classList.add("player", this.player2.bgColor, this.player2.color);
			e.appendChild(symbolHover);
			e.classList.add("played");

			/* Retenir la case qui a été jouée */
			this.grid[f] = this.playerName;

			/* Incrémenter le tour de jeu */
			this.moves++;

			/* Afficher toutes les infos du tour de jeu */
			document.getElementById("information").innerText = `Tour n°${this.moves}`;
			coordinates.innerText = `${this.playerName} a joué en : x=${j-1} ; y=${i-1} \r\n C'est au tour de : ${this.playerName === this.player1.name ? this.player2.name : this.player1.name}.`;

			/* Vérifier si un gagnant + changer de joueur (et pour que le perdant commence en premier) */
			this.checkWin().playerTurn();
		}
		/* Si un vainqueur est désigné, la partie s'arrête là */
		else if (this.winCond) {
			coordinates.innerText = `Pas de triche ! \r\n C'est ${this.playerName} qui a gagné !`;
		}
		/* Alors la case est occupée et le joueur est invité à rejouer */
		else {
			coordinates.innerText = `Case occupée !`;
		}
		return this;
	}

	restartGame() {
		/* Ré-initialisation des variables pour la nouvelle partie */
		this.grid = ['','','','','','','','',''];
		this.moves = 0;
		this.div = 0;
		this.winCond = false;

		/* On efface tout le damier... */
		while (damier.firstChild) {
			damier.firstChild.remove();
		}

		/* ... et on recommence */
		this.generateGrid(3,3);

		return this;
	}

	launchMorpion() {
		/* Au lancement du jeu, masquer les paramètres */
		document.getElementById('settings').classList.add("hide");
		document.getElementById('magic').classList.add("superb", "show");

		/* Récupérer les valeurs des couleurs */
		let colorX = $("#J1-couleur").spectrum("get");
		let colorY = $("#J2-couleur").spectrum("get");

		/* Création et injection d'une balise style avec les couleurs */
		let styleBg = document.createElement('style');
		styleBg.innerText = `.color1 { color: ${colorX}; } .colorBg1 { background-color: ${colorX}; } .color2 { color: ${colorY}; } .colorBg2 { background-color: ${colorY}; } .widthX { width:33.33333%; }`;
		document.head.appendChild(styleBg);

		/* Afficher le panneau des scores et des infos */
		document.getElementById('score').classList.add("show", "animate");
		document.getElementById('infoBox').classList.add("show", "animate");
		document.getElementById("playerName1").textContent = `${this.player1.name}`;
		document.getElementById("playerName2").textContent = `${this.player2.name}`;
		spanJ1c.classList.add("colorBg1");
		spanJ2c.classList.add("colorBg2");

		/* Définir une bordure tout autour du damier */
		damier.style.border = `2px solid #ffe4ca`;

		return this;
	}

	generateGrid(y,x) {
		/* Indiquer le joueur qui commence */
		document.getElementById("information").innerText = `Info`;
		coordinates.innerText = `C'est à ${this.playerName} de jouer.`;

		/* Création du damier */
		/* Boucle de création des lignes */
		for (let i = 1; i <= x; i++) {
			let rows = document.createElement("DIV");
			rows.classList.add("row");
			damier.appendChild(rows);

			/* Boucle de création des colonnes */
			for (let j = 1; j <= y; j++) {
				let colums = document.createElement("DIV");

				/* Utilisation d'un ternaire à la place de IF...ELSE */
				i%2 && j%2 ? colums.classList.add("widthX", "backgroundColor1", "animate") : 
				i%2 || j%2 ? colums.classList.add("widthX", "backgroundColor2", "animate") : 
				colums.classList.add("widthX", "backgroundColor1", "animate");

				colums.style.height = `187px`;

				rows.appendChild(colums);
				colums.id = `${this.div++}`

				/* Dès qu'on clique sur une case, ça déclenche la méthode create() */
				colums.addEventListener('click', () => {
					this.create(colums,colums.id,i,j);
				});
			}
		}
		return this;
	}

}

window.addEventListener("load", () => {
	console.log("This.is.morpion!");
	console.log("Now, with 70% less stupid AI.");

	generate.addEventListener('click', () => {
		/* Gère que le morpion en (3,3) uniquement : don't try this at home, kids */
		new Morpion().launchMorpion().generateGrid(3,3);
	});
});