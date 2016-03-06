// Create the canvas

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

// Background images

var bgReady = false;
var bgImage = new Image();
var dead = 0;
var win = 0;

bgImage.onload = function() {
	bgReady = true;
};
bgImage.src = "images/cave.png";

// Hero image

var heroReady = false;
var heroImage = new Image();
heroImage.onload = function() {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Champion image
var championReady = false;
var championImage = new Image();
championImage.onload = function() {
	championReady = true;
};
championImage.src = "images/champion.png";

// Monster images

var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function() {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

var monsterHitReady = false;
var monsterHit = new Image();
monsterHit.onload = function() {
	monsterHitReady = true;
};
monsterHit.src = "images/monster_hit.png";

// Game Objects

// Player
var hero = {
	speed: 256 // movement in pixels per second
};

// Stationary monster
var monster = {
	speed: 100,
	health: 3
};

// Lazer beam
var lazer = {
	on: false,
	power: 5
};

// Points
var score = 0;
var highscore = 0;
var win_score = 10;

var spawnMonster = function(monster) {
	
	lazer.on = false;
	
	var pickWall = Math.random();
			
	// Throw new monster somewhere just off the screen randomly
	if (pickWall < 0.25) {
		monster.x = -100;
		monster.y = Math.random()*canvas.height;
	} else if (pickWall < 0.5) {
		monster.x = Math.random()*canvas.width;
		monster.y = -100;
	} else if (pickWall < 0.75) {
		monster.x = canvas.width + 100;
		monster.y = Math.random()*canvas.height;
	} else {
		monster.x = Math.random()*canvas.width;
		monster.y = canvas.height + 100;
	}
					
	monster.health = 3;
}

var drawMonster = function(img){
	
	// Monster
	ctx.drawImage(img, monster.x, monster.y);
	
	// Health bar
	ctx.save();
	
	ctx.strokeStyle='yellow';
	ctx.lineWidth=10;
	ctx.beginPath();
	ctx.moveTo((monster.x + 50 + 50*(monster.health/3)), monster.y);
	ctx.lineTo((monster.x + 50 - 50*(monster.health/3)), monster.y);
	ctx.stroke();
	
	ctx.restore();
	
}

var drawHero = function(img){
	
	// Hero
	ctx.drawImage(img, hero.x, hero.y);
	
	// Lazer Power Level
	ctx.save();
	
	ctx.strokeStyle='red';
	ctx.lineWidth=20;
	ctx.beginPath();
	ctx.moveTo(110, (600 - 20));
	ctx.lineTo(110 + 20*lazer.power, (600 - 20));
	ctx.stroke();
	
	ctx.restore();
	
}

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function() {
	
	hero.x = (canvas.width / 2) - 50;
	hero.y = (canvas.height / 2) - 50;
	
	lazer.power = 5;

	spawnMonster(monster);
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // player holding up
		hero.y -= hero.speed * modifier;
		if (hero.y < -36) {
			hero.y = -36;
		}
	}
	if (40 in keysDown) { // player holding down
		hero.y += hero.speed * modifier;
		if (hero.y > canvas.height - 68) {
			hero.y = canvas.height - 68;
		}
	}
	if (37 in keysDown) { // player holding left
		hero.x -= hero.speed * modifier;
		if (hero.x < -36) {
			hero.x = -36;
		}
	}
	if (39 in keysDown) { // player holding right
		hero.x += hero.speed * modifier;
		if (hero.x > canvas.width - 68) {
			hero.x = canvas.width - 68;
		}
	}
	if (65 in keysDown) { // player holding 'a'
		// Only works if a monster is one the screen
		if (monster.x < canvas.width - 50
			&& monster.y < canvas.height - 50
			&& monster.x > -50
			&& monster.y > -50){
			// Attack
			lazer.on = true;
		} else {
			lazer.on = false;
		}
	} else {
		lazer.on = false;
	}
	
	if (hero.x < monster.x){
		monster.x -= modifier * monster.speed;
	} else {
		monster.x += modifier * monster.speed;
	}
	
	if (hero.y < monster.y){
		monster.y -= modifier * monster.speed;
	} else {
		monster.y += modifier * monster.speed;
	}
	
	if (dead > 0) {
		dead -= 1*modifier;
		if (dead < 0){
			dead = 0;
		}
	}
	
	if (win > 0) {
		win -= 1*modifier;
		if (win < 0){
			win = 0;
		}
	}

	// Are they touching? (Player Dies)
	if (hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)) {
		
		if (score > highscore) {
			highscore = score;
		}
		
		score = 0;
		
		dead = 3;
		
		reset();
	}
	
	if (lazer.on && lazer.power > 0) {
		
		lazer.power -= 3*modifier;
		
		monster.health -= 2*modifier;
		
		// Monster dies
		if (monster.health <= 0) {
			score++;
			if (score == win_score){
				win = 3;
			}
			spawnMonster(monster);
		}
		
	} else if (!lazer.on && lazer.power < 5) {
		lazer.power += modifier
	}
	
};

var render = function () {
	
	// Draw Background
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}
	
	// Draw Lazer Beam
	if (lazer.on && lazer.power > 0) {
		ctx.save();
		ctx.strokeStyle='red';
		ctx.shadowOffsetX=0;
		ctx.shadowOffsetY=0;
		ctx.shadowBlur=7;
		ctx.shadowColor='red';
		ctx.lineWidth=4;
		ctx.beginPath();
		ctx.moveTo(hero.x + 50, hero.y + 50);
		ctx.lineTo(monster.x + 50, monster.y + 50);
		ctx.stroke();
		ctx.restore();
		
		// Draw Monster
		if (monsterHitReady) {
			drawMonster(monsterHit);
		}
		
	} else {
		
		// Draw Monster
		if (monsterReady) {
			drawMonster(monsterImage);
		}
		
	}
	
	// Draw Hero
	if (score < win_score){
		if (heroReady) {
			drawHero(heroImage);
		}
	} else {
		if (championReady) {
			drawHero(championImage);
		}
	}
	
	// Score
	ctx.fillStyle = "rgb(250,250,250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Score: " + score + "    High Score: " + highscore, 32, 32);
	
	// Lazer Power
	ctx.fillText("Power:", 32, (600 - 32));
	
	// Draw death message
	ctx.save();
	ctx.globalAlpha = dead/3;
	ctx.font = "300px Helvetica";
	ctx.fillStyle = "red";
	ctx.fillText("DEAD", -20, 150);
	ctx.restore();
	
	// Draw win message
	ctx.save();
	ctx.globalAlpha = win/3;
	ctx.font = "300px Helvetica";
	ctx.fillStyle = "white";
	ctx.fillText("WIN", 50, 150);
	ctx.restore();
	
};

// The main game loop
var main = function () {
	
	var now = Date.now();
	var delta = now - then;
	
	update(delta/1000);
	render();
	
	then=now;
	
	// Request to do this again ASAP
	requestAnimationFrame(main);
	
};

// Cross browser support
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play!
var then = Date.now();
reset();
main();