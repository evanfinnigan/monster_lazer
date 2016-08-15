/*
*	MONSTER LAZER SHOOTER OF AWESOME
*	Author: Evan Finnigan
*	Created for QHacks 2016
*/

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
	speed: 50,
	speedx: 0,
	speedy: 0,
	health: 1,
	max_health: 1,
	img: monsterImage,
	img_ready: monsterReady,
	img_hit: monsterHit,
	img_hit_ready: monsterHitReady
};


// Ugly
var ugly = {
	speed: 0,
	speedx: 0,
	speedy: 0,
	max_speed: 30,
	health: 4,
	max_health: 4,
	img: uglyImage,
	img_ready: uglyReady,
	img_hit: uglyHit,
	img_hit_ready: uglyHitReady
};


// Grumpy
var grumpy = {
	speed: 0,
	speedx: 0,
	speedy: 0,
	max_speed: 10,
	health: 7,
	max_health: 7,
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
var win_level = 19;
var level = 0;

var dead = 0;
var win = 0;
var bg = 3;
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

	monster.speed = 100;
	spawnMonster(monster);
	remove(ugly);
	remove(grumpy);
};

// Controls Monster Movement towards player
var move = function(mnstr, modifier) {
	
	// Make monster move in a straight line:
	// 		The longest distance (x or y) will use the base speed.
	//		The shortest distance (x or y) will use a slower, altered speed
	//		The speed will be modified so the distance travelled in x to get to the player
	//			should always take the same amount of time as distance travelled in y.
	var dx = Math.abs(hero.x - mnstr.x);
	var dy = Math.abs(hero.y - mnstr.y);
	
	if (dx > dy) {
		mnstr.speedx = mnstr.speed;
		mnstr.speedy = mnstr.speed * (dy/dx);
	} else if (dx < dy) {
		mnstr.speedy = mnstr.speed;
		mnstr.speedx = mnstr.speed * (dx/dy);
	} else {
		mnstr.speedx = mnstr.speed;
		mnstr.speedy = mnstr.speed;
	}
	
	// x movement
	if ((mnstr.x - hero.x) > 1){
		mnstr.x -= modifier * mnstr.speedx;
	} else if ((hero.x - mnstr.x) > 1){
		mnstr.x += modifier * mnstr.speedx;
	}
	
	// y movement
	if ((mnstr.y - hero.y) > 1){
		mnstr.y -= modifier * mnstr.speedy;
	} else if ((hero.y - mnstr.y) > 1) {
		mnstr.y += modifier * mnstr.speedy;
	} 
};

var distance_squared = function(hro, mnstr) {
	return (Math.pow(mnstr.x - hro.x, 2) + Math.pow(mnstr.y - hro.y, 2));
};

var change_background = function(new_background){
	bg = 0;
	bgImage.src = new_background;
};

// Paused or Unpaused?
var paused = false;

// Number of kills
var kills = 0;
var next_level = 10;

// Update game objects
var update = function (modifier) {
	
	// Pause Game
	if (80 in keysDown) { // player pressed p
		paused = true;
	}
	
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
	
	// Choose lazer.target (closest monster)
	var d1 = distance_squared(hero, monster);
	var d2 = distance_squared(hero, ugly);
	var d3 = distance_squared(hero, grumpy);
	
	if (level == 0) {
		lazer.target = monster;
	}
	
	if (level == 1) {
		if (d1 < d2) {
			lazer.target = monster;
		} else {
			lazer.target = ugly;
		}
	}
	
	if (level > 1) {
		if (d1 < d2 && d1 < d3) {
			lazer.target = monster;
		} else if (d2 <= d1 && d2 < d3) {
			lazer.target = ugly;
		} else {
			lazer.target = grumpy;
		}
	}
	
	// Fire Lazer 
	if (65 in keysDown || 32 in keysDown) { // player holding 'a'
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
	
	if (bg < 3) {
		bg += 1*modifier;
		if (bg > 3){
			bg = 3;
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
		
		change_background("images/cave.png");
		
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
		
		score += Math.round(100*modifier);
		
		// Monster dies
		if (lazer.target.health <= 0) {
			
			kills += lazer.target.max_health;
			
			if (level == win_level){
				win = 3;
			}
			if (kills >= next_level) {
				level++;
				next_level = kills + level + 10;
				new_level = 3;
				
				// Let ugly enter game
				if (level == 1) {
					ugly.speed = ugly.max_speed;
					lazer.max_power += lazer.max_power;
				}
				
				// Let grumpy enter game
				if (level == 2) {
					grumpy.speed = grumpy.max_speed;
					lazer.max_power += lazer.max_power;
				}
				
				monster.speed += 5;
				
				if (level > 1) {
					ugly.speed += 5;
				}
				
				if (level > 2) {
					grumpy.speed += 5;
				}
				
				switch(level) {
					case 3:
						change_background("images/hell.png");
						break;
					case 7:
						change_background("images/orange.png");
						break;
					case 11:
						change_background("images/water.png");
						break;
					case 15:
						change_background("images/grass.png");
						break;
					case 19:
						change_background("images/gold.png");
						break;
					default:
						break;
				}
				
				lazer.replenish_rate++;
				
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
		ctx.save();
		ctx.globalAlpha = bg/3;
		ctx.drawImage(bgImage, 0, 0);
		ctx.restore();
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
	if (level < win_level){
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
	ctx.fillText("Score: " + score + "     High Score: " + highscore + "     Level: " + (level+1), 32, 32);
	
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
	ctx.fillText("Level " + (level+1), 280, 100);
	ctx.restore();
	
};

// The main game loop
var main = function () {
	
	// Unpause
	if (79 in keysDown) { // player pressed p
		paused = false;
	}
	
	var now = Date.now();
	
	if (!paused) {
		var delta = now - then;
		
		update(delta/1000);
		render();
	} 
	
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