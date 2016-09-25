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


// Power Meter

var powerBackgroundReady = false;
var powerBackgroundImage = new Image();
powerBackgroundImage.onload = function() {
	powerBackgroundReady = true;
};
powerBackgroundImage.src = "images/power_bg.png";

var powerForegroundReady = false;
var powerForegroundImage = new Image();
powerForegroundImage.onload = function() {
	powerForegroundReady = true;
};
powerForegroundImage.src = "images/power_fg.png";


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

// Mine images

var mineReady = false;
var mineImage = new Image();
mineImage.onload = function() {
	mineReady = true;
}
mineImage.src = "images/mine.png";

var explodeReady = false;
var explodeImage = new Image();
explodeImage.onload = function() {
	explodeReady = true;
}
explodeImage.src = "images/explosion.png";


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
	health: 2,
	max_health: 2,
	hit:0,
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
	starting_speed: 40,
	health: 5,
	max_health: 5,
	hit: 0,
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
	starting_speed: 30,
	health: 8,
	max_health: 8,
	hit: 0,
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
	replenish_rate: 1.0,
	target: monster
};

// Mine
var mine = {
	x: 0,
	y: 0,
	alpha: 0,
	ready: true,
	exploding: false,
	countdown: false,
	radius: 150,
	damage: 1000,
	time: 3.0
}


// Points
var score = 0;
var highscore = 0;
var win_level = 19;
var level = 0;
var highest_level = 0;

// Number of kills
var kill_points = 0;
var kills = 0;
var mostkills = 0;
var next_level = 10;

var dead = 0;
var win = 0;
var bg = 3;
var new_level = 3;


// Reset when the player dies
var reset = function() {
	
	mine.alpha = 0;
	mine.exploding = false;
	mine.countdown = false;
	mine.ready = true;
	
	if (score > highscore) {
		highscore = score;
	}
	
	if (level > highest_level) {
		highest_level = level;
	}
	
	hero.x = (canvas.width / 2) - 50;
	hero.y = (canvas.height / 2) - 50;
	
	lazer.power = 5;
	lazer.replenish_rate = 1.0;
	lazer.max_power = 5;
	
	score = 0;
	level = 0;
	kills = 0;
	kill_points = 0;
	
	next_level = 10;
	
	new_level = 3;

	monster.speed = 100;
	spawnMonster(monster);
	remove(ugly);
	remove(grumpy);
};


var spawnMonster = function(mnstr) {
	
	// Turn off the lazer
	lazer.on = false;
	
	var pickWall = Math.random();
	
	var spawn_distance = (level*10*mnstr.speed*Math.random())/(mnstr.max_health*mnstr.max_health)
			
	// Throw new monster somewhere just off the screen randomly
	if (pickWall < 0.25) {
		mnstr.x = -100 - spawn_distance;
		mnstr.y = Math.random()*canvas.height;
	} else if (pickWall < 0.5) {
		mnstr.x = Math.random()*canvas.width;
		mnstr.y = -100 - spawn_distance;
	} else if (pickWall < 0.75) {
		mnstr.x = canvas.width + 100 + spawn_distance;
		mnstr.y = Math.random()*canvas.height;
	} else {
		mnstr.x = Math.random()*canvas.width;
		mnstr.y = canvas.height + 100 + spawn_distance;
	}
					
	mnstr.health = mnstr.max_health;
}

var drawMonster = function(mnstr){
	
	// Monster
	ctx.save();
	

	hitAlpha = mnstr.hit;
	normalAlpha = 1 - mnstr.hit;
	
	ctx.globalAlpha = normalAlpha;
	ctx.drawImage(mnstr.img, mnstr.x, mnstr.y);
	ctx.globalAlpha = hitAlpha;
	ctx.drawImage(mnstr.img_hit, mnstr.x, mnstr.y);
	
	ctx.restore();
	
	ctx.save();
	
	// Health bar
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
}

var drawPower = function(){
	
	//  Power Background Image
	if (powerBackgroundReady){
		ctx.drawImage(powerBackgroundImage, 0, 574);
	}
	
	// Lazer Power Level
	ctx.save();
	
	ctx.strokeStyle='blue';
	ctx.lineWidth=23;
	ctx.beginPath();
	ctx.moveTo(0, 586);
	ctx.lineTo(0 + 20*lazer.power, 586);
	ctx.stroke();
	
	ctx.restore();
	
	// Power Foreground Image
	if (powerForegroundReady){
		ctx.drawImage(powerForegroundImage, 0, 574);
	}
}

var drawMine = function(){
	
	ctx.save();
	
	ctx.globalAlpha = mine.alpha;
	
	if (mineReady && mine.countdown) {
		ctx.drawImage(mineImage, mine.x, mine.y);
		ctx.font = "30px Monospace";
		ctx.fillText("" + Math.ceil(mine.time), mine.x + 90, mine.y + 40);
	}

	if (explodeReady && mine.exploding) {
		ctx.drawImage(explodeImage, mine.x, mine.y);
	}

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

// Mine Damage on a monster
var mine_damage = function(mnstr) {
	
	var d = Math.sqrt(distance_squared(mine, mnstr));
	// monster is completely safe at mine.radius px away
	if (d < mine.radius && mine.alpha >= 0.0){
		mnstr.health -= Math.abs(mine.damage*mine.alpha*(1/((d*d) + 1)));
	}
	
	if (mnstr.health <= 0) {
		kill_monster(mnstr);
	}
	
};


// Monster dies
var kill_monster = function(mnstr) {
	
	kills++;
	kill_points += mnstr.max_health;
	mnstr.hit = 0;
	
	if (level == win_level){
		win = 3;
	}
	if (kill_points >= next_level) {
		level_up();
	}
	
	spawnMonster(mnstr);
}


// Level up function
var level_up = function(){
	
	level++;
	next_level = kill_points + level + 10;
	new_level = 3;
	
	// Let ugly enter game
	if (level == 1) {
		ugly.speed = ugly.starting_speed;
		lazer.max_power += lazer.max_power;
	}
	
	// Let grumpy enter game
	if (level == 2) {
		grumpy.speed = grumpy.starting_speed;
		lazer.max_power += lazer.max_power;
	}
	
	monster.speed += 10;
	
	if (level > 1) {
		ugly.speed += 10;
	}
	
	if (level > 2) {
		grumpy.speed += 10;
	}
	
	lazer.replenish_rate += 0.2;
}

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
	
	// Drop mine with 'b' key
	if (mine.ready && 66 in keysDown) {
		mine.x = hero.x;
		mine.y = hero.y;
		mine.countdown = true;
		mine.ready = false;
		mine.alpha = 1.0;
	}
	
	// explosion countdown
	if (mine.countdown) {
		mine.alpha = 0.99;
		
		mine.time -= modifier;
		if (mine.time <= 0) {
			mine.countdown = false;
			mine.exploding = true;
			mine.time = 3.0;
		}
		
	}
	
	// boom
	if (mine.exploding) {
		
		mine_damage(monster);
		mine_damage(ugly);
		mine_damage(grumpy);
		
		// Mine might kill hero :(
		if (distance_squared(hero, mine) < 2000) {
			dead = 3;
			reset();
		}
		
		mine.alpha -= modifier;
		if (mine.alpha <= 0){
			mine.alpha = 0;
			mine.exploding = false;
			mine.ready = true;
		}
	}
	
	// Choose lazer.target (closest monster)
	var d1 = distance_squared(hero, monster);
	var d2 = distance_squared(hero, ugly);
	var d3 = distance_squared(hero, grumpy);
	
	if (level == 0) {
		lazer.target = monster;
	} else if (level == 1) {
		switch (Math.min(d1, d2)) {
			case d1:
				lazer.target = monster;
				break;
			case d2:
				lazer.target = ugly;
				break;
			default:
				lazer.target = monster;
				break;
		}
	} else {
		switch (Math.min(d1, d2, d3)) {
			case d1:
				lazer.target = monster;
				break;
			case d2:
				lazer.target = ugly;
				break;
			case d3:
				lazer.target = grumpy;
				break;
			default:
				lazer.target = monster;
				break;
		}
	}
	
	// Fire Lazer 
	if (65 in keysDown || 32 in keysDown) { // player holding 'a'
		// Only works if a monster is one the screen
		if (lazer.target.x < canvas.width - 20
			&& lazer.target.y < canvas.height - 20
			&& lazer.target.x > -80
			&& lazer.target.y > -80){
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
		
		dead = 3;
		
		reset();
	}
	
	
	if (lazer.on && lazer.power > 0) {
		
		lazer.power -= 3*modifier;
		
		lazer.target.health -= 2*modifier;
		
		score += Math.round(100*modifier);
		
		// fade between images
		lazer.target.hit += 5*modifier;
		if (lazer.target.hit > 1){
			lazer.target.hit = 1;
		}
		
		// Monster dies
		if (lazer.target.health <= 0) {
			kill_monster(lazer.target);
		}
		
	} else if (!lazer.on && lazer.power < lazer.max_power) {
		
		lazer.power += modifier*lazer.replenish_rate;
		
	}
	
	if (lazer.target != monster || !lazer.on || lazer.power <= 0){
		monster.hit -= modifier*3;
		if (monster.hit < 0){
			monster.hit = 0;
		}
	}
	
	if (lazer.target != ugly || !lazer.on || lazer.power <= 0){
		ugly.hit -= modifier*3;
		if (ugly.hit < 0){
			ugly.hit = 0;
		}
	}
	
	if (lazer.target != grumpy || !lazer.on || lazer.power <= 0){
		grumpy.hit -= modifier*3;
		if (grumpy.hit < 0){
			grumpy.hit = 0;
		}
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
	} 
	
	// Draw mine
	drawMine();
	
	// Draw Monsters
	drawMonster(monster);
	drawMonster(ugly);
	drawMonster(grumpy);
	
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
	
	// Draw Power bar
	drawPower();
	
	// Score stuff
	ctx.fillStyle = "rgb(250,250,250)";
	ctx.font = "24px Monospace";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	
	// Categories
	ctx.fillText("          Score       Kills       Level", 10, 10);
	
	// Score
	ctx.fillText("Current:   " + score, 10, 40);
	ctx.fillText("" + kills, 340, 40);
	ctx.fillText("" + (level+1), 515, 40);
	
	// High Scores
	ctx.fillText("Best:      " + highscore, 10, 70);
	ctx.fillText("" + mostkills, 340, 70);
	ctx.fillText("" + (highest_level+1), 515, 70);
	
	// Draw death message
	ctx.save();
	ctx.globalAlpha = dead/3;
	ctx.font = "350px Monospace";
	ctx.fillStyle = "red";
	ctx.fillText("DEAD", -25, 150);
	ctx.restore();
	
	// Draw win message
	ctx.save();
	ctx.globalAlpha = win/3;
	ctx.font = "300px Monospace";
	ctx.fillStyle = "white";
	ctx.fillText("WIN", 50, 150);
	ctx.restore();
	
	// Draw new level message
	ctx.save();
	ctx.globalAlpha = new_level/3;
	ctx.font = "80px Monospace";
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