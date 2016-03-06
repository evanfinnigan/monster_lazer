// Create the canvas

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

// Background images

var bgReady = false;
var bgImage = new Image();
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


// MONSTER IMAGES

// First Monster

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


// Second Monster

var uglyReady = false;
var uglyImage = new Image();
uglyImage.onload = function() {
	uglyReady = true;
};
uglyImage.src = "images/ugly.png";

var uglyHitReady = false;
var uglyHit = new Image();
uglyHit.onload = function() {
	uglyHitReady = true;
};
uglyHit.src = "images/ugly_hit.png";


// Third Monster

var grumpyReady = false;
var grumpyImage = new Image();
grumpyImage.onload = function() {
	grumpyReady = true;
};
grumpyImage.src = "images/grumpy.png";

var grumpyHitReady = false;
var grumpyHit = new Image();
grumpyHit.onload = function() {
	grumpyHitReady = true;
};
grumpyHit.src = "images/grumpy_hit.png";


// Game Objects

// Player
var hero = {
	speed: 256 // movement in pixels per second
};


// Monster
var monster = {
	speed: 100,
	health: 2,
	max_health: 2,
	img: monsterImage,
	img_ready: monsterReady,
	img_hit: monsterHit,
	img_hit_ready: monsterHitReady
};


// Ugly
var ugly = {
	speed: 0,
	max_speed: 110,
	health: 3,
	max_health: 3,
	img: uglyImage,
	img_ready: uglyReady,
	img_hit: uglyHit,
	img_hit_ready: uglyHitReady
};


// Grumpy
var grumpy = {
	speed: 0,
	max_speed: 120,
	health: 4,
	max_health: 4,
	img: grumpyImage,
	img_ready: grumpyReady,
	img_hit: grumpyHit,
	img_hit_ready: grumpyHitReady
};


// Lazer beam
var lazer = {
	on: false,
	max_power: 5,
	power: 5,
	replenish_rate: 1,
	target: monster
};


// Points
var score = 0;
var highscore = 0;
var win_score = 12;
var level = 0;

var dead = 0;
var win = 0;
var new_level = 3;

var spawnMonster = function(mnstr) {
	
	// Turn off the lazer
	lazer.on = false;
	
	var pickWall = Math.random();
			
	// Throw new monster somewhere just off the screen randomly
	if (pickWall < 0.25) {
		mnstr.x = -100;
		mnstr.y = Math.random()*canvas.height;
	} else if (pickWall < 0.5) {
		mnstr.x = Math.random()*canvas.width;
		mnstr.y = -100;
	} else if (pickWall < 0.75) {
		mnstr.x = canvas.width + 100;
		mnstr.y = Math.random()*canvas.height;
	} else {
		mnstr.x = Math.random()*canvas.width;
		mnstr.y = canvas.height + 100;
	}
					
	mnstr.health = mnstr.max_health;
}

var drawMonster = function(img, mnstr){
	
	// Monster
	ctx.drawImage(img, mnstr.x, mnstr.y);
	
	// Health bar
	ctx.save();
	
	ctx.strokeStyle='yellow';
	ctx.lineWidth=10;
	ctx.beginPath();
	ctx.moveTo((mnstr.x + 50 + 50*(mnstr.health/mnstr.max_health)), mnstr.y);
	ctx.lineTo((mnstr.x + 50 - 50*(mnstr.health/mnstr.max_health)), mnstr.y);
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

// Remove a monster from the game
var remove = function(mnstr) {
	mnstr.speed = 0;
	spawnMonster(mnstr);
};

// Reset when the player dies
var reset = function() {
	
	hero.x = (canvas.width / 2) - 50;
	hero.y = (canvas.height / 2) - 50;
	
	lazer.power = 5;

	spawnMonster(monster);
	remove(ugly);
	remove(grumpy);
};

// Controls Monster Movement towards player
var move = function(mnstr, modifier) {
	if (hero.x < mnstr.x){
		mnstr.x -= modifier * mnstr.speed;
	} else {
		mnstr.x += modifier * mnstr.speed;
	}
	
	if (hero.y < mnstr.y){
		mnstr.y -= modifier * mnstr.speed;
	} else {
		mnstr.y += modifier * mnstr.speed;
	}
};

var distance_squared = function(hro, mnstr) {
	return (Math.pow(mnstr.x - hro.x, 2) + Math.pow(mnstr.y - hro.y, 2));
};

// Update game objects
var update = function (modifier) {
	
	// Player Motion Control
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
	
	// Choose lazer.lazer.lazer.lazer.lazer.lazer.target (closest monster)
	var d1 = distance_squared(hero, monster);
	var d2 = distance_squared(hero, ugly);
	var d3 = distance_squared(hero, grumpy);
	
	if (d1 <= d2 && d1 <= d3) {
		lazer.target = monster;
	} else if (d2 < d1 && d2 <= d3) {
		lazer.target = ugly;
	} else {
		lazer.target = grumpy;
	}
	
	// Fire Lazer 
	if (65 in keysDown) { // player holding 'a'
		// Only works if a monster is one the screen
		if (lazer.target.x < canvas.width - 50
			&& lazer.target.y < canvas.height - 50
			&& lazer.target.x > -50
			&& lazer.target.y > -50){
			// Attack
			lazer.on = true;
		} else {
			lazer.on = false;
		}
	} else {
		lazer.on = false;
	}
	
	move(monster, modifier);
	move(ugly, modifier);
	move(grumpy, modifier);
	
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
	
	if (new_level > 0) {
		new_level -= 1*modifier;
		if (new_level < 0){
			new_level = 0;
		}
	}

	// Are they touching? (Player Dies)
	if (hero.x <= (lazer.target.x + 32)
		&& lazer.target.x <= (hero.x + 32)
		&& hero.y <= (lazer.target.y + 32)
		&& lazer.target.y <= (hero.y + 32)) {
		
		if (score > highscore) {
			highscore = score;
		}
		
		score = 0;
		level = 0;
		new_level = 3;
		lazer.replenish_rate = 1;
		lazer.max_power = 5;
		
		dead = 3;
		
		reset();
	}
	
	if (lazer.on && lazer.power > 0) {
		
		lazer.power -= 3*modifier;
		
		lazer.target.health -= 2*modifier;
		
		// Monster dies
		if (lazer.target.health <= 0) {
			score++;
			if (score == win_score){
				win = 3;
			}
			if (score % 4 == 0) {
				level++;
				new_level = 3;
				
				// Let ugly enter game
				if (level == 1) {
					ugly.speed = ugly.max_speed;
					lazer.max_power += lazer.max_power;
					lazer.replenish_rate++;
				}
				
				// Let grumpy enter game
				if (level == 2) {
					grumpy.speed = grumpy.max_speed;
					lazer.max_power += lazer.max_power;
					lazer.replenish_rate++;
				}
				
				// Make it harder forever
				if (level > 3) {
					monster.speed += 10;
					ugly.speed += 10;
					grumpy.speed += 10;
					lazer.replenish_rate++;
				}
			}
			
			spawnMonster(lazer.target);
		}
		
	} else if (!lazer.on && lazer.power < lazer.max_power) {
		lazer.power += modifier*lazer.replenish_rate;
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
		ctx.lineTo(lazer.target.x + 50, lazer.target.y + 50);
		ctx.stroke();
		ctx.restore();
		
		// Draw Target Monster
		if (lazer.target == monster) {
			if (monsterHitReady){
				drawMonster(monsterHit, monster);
			}
		} else if (lazer.target == ugly) {
			if (uglyHitReady){
				drawMonster(uglyHit, ugly);
			}
		} else {
			if (grumpyHitReady){
				drawMonster(grumpyHit, grumpy);
			}
		}
		
	} else {
		
		// Draw Target Monster
		if (lazer.target == monster) {
			if (monsterReady){
				drawMonster(monsterImage, monster);
			}
		} else if (lazer.target == ugly) {
			if (uglyReady){
				drawMonster(uglyImage, ugly);
			}
		} else {
			if (grumpyReady){
				drawMonster(grumpyImage, grumpy);
			}
		}
		
	}
	
	// Draw remaining monsters
	if (lazer.target != monster){
		if (monsterReady) {
			drawMonster(monsterImage, monster);
		}
	}
	if (lazer.target != ugly){
		if (uglyReady) {
			drawMonster(uglyImage, ugly);
		}
	}
	if (lazer.target != grumpy){
		if (grumpyReady) {
			drawMonster(grumpyImage, grumpy);
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
	
	// Draw new level message
	ctx.save();
	ctx.globalAlpha = new_level/3;
	ctx.font = "80px Helvetica";
	ctx.fillStyle = "white";
	ctx.fillText("Level " + level, 450, 10);
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