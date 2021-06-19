document.onkeydown = keyDown;
document.onkeyup = keyUp;
document.onmousedown = clickDown;
document.onmouseup = clickUp;
document.onmousemove = mouseMove;

let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let FOREGROUND_COLOR = "#c7f0d8";
let BACKGROUND_COLOR = "#43523d";
let START_TIME = Date.now();
let TIME_ELAPSED = 0;

//GOD MODE
let GOD_MODE = false;
let GOD_WEAPON = false;
//GOD MODE

let segments =
[
	"1110111", // 0
	"0010010", // 1
	"1011101", // 2
	"1011011", // 3
	"0111010", // 4
	"1101011", // 5
	"1101111", // 6
	"1010010", // 7
	"1111111", // 8
	"1111011"  // 9
];

//CANVAS
canvas.width = innerWidth;//screen.width;
canvas.height = innerHeight;//screen.height;
canvas.style.backgroundColor = BACKGROUND_COLOR;
//canvas.width = 1180;
//canvas.height = 768;
//canvas.style.left = (screen.width-canvas.width)/2;
//canvas.style.top = (screen.height-canvas.height)/2;

//GAME VARIABLES
let moveSpeed = 7.5;
let jumpStrength = 11.75;
let bulletSpeed = 15;
let pixSize = 12;
let G = 0.02;
let powerupChance = 0.075;
let enemyChance = 0.65;
let coinChance = 0.5;

//START VARIABLES
let startX = innerWidth / 2;
let startY = innerHeight / 2;
//let startX = 574;
//let startY = 384;
let platformCount = 256;

//OBJECT VARIABLES
let player = new Player(new Rect(startX, startY, 32, 64, FOREGROUND_COLOR, BACKGROUND_COLOR), G);
let platforms = new Array(platformCount);
let enemies = new Array(0);
let bullets = new Array(0);
let powerups = new Array(0);
let coins = new Array(0);

//WEAPONS						  Cnt  Spr  Spd  Cldwn  Dmg  Grav   Cons*G
let pistol = 			new Weapon(1,  5.0, 15.0,  24,  5.0, false, 1*G);
let shotgun = 			new Weapon(3, 10.0, 17.5,  64,  4.0, false, 1*G);
let sniper = 			new Weapon(1,  1.0, 35.0, 128, 10.0, false, 1*G);
let minigun = 			new Weapon(1, 12.5, 20.0,   6,  2.0, false, 1*G);
let flamethrower = 		new Weapon(1,  3.5,  8.5,   2,  0.5,  true, 3*G);

//FOR TESTING
let godgun = new Weapon(360, 180, 20, 16, 10, false, 1*G);

//INITIALIZATION
player.currentWeapon = pistol;
let weapons = [pistol, shotgun, sniper, minigun, flamethrower];
platforms[0] = new Platform(new Rect(startX - 128, startY + 96, 256+32, 48, FOREGROUND_COLOR, BACKGROUND_COLOR));

//IN GAME VARIABLES
let left = false, right = false, shoot = false;
let pageX;
let pageY;

generateRandomLevel();
//gameLoop();


//CODE BELOW IS NOT MINE
let fps = 64;
let stop = false;
let frameCount = 0;
let fpsInterval, startTime, now, then, elapsed;
startAnimating();

function startAnimating() {
	fpsInterval = 1000 / fps;
	then = Date.now();
	startTime = then;
	animate();
}

function animate(){
	requestAnimationFrame(animate);
	now = Date.now();
	elapsed = now - then;
	if(elapsed > fpsInterval){
		then = now - (elapsed % fpsInterval);
		gameLoop();
	}
}
//END OF CODE THAT ISNT MINE

function keyDown(e){
	switch(e.key){
		case "w":
			if(player.grounded || GOD_MODE){
				player.accY = 0.25;
				player.velY = -1 * jumpStrength;
				player.grounded = false;
				player.doubleJump = true;
			} else if(player.doubleJump || GOD_MODE){
				player.accY = 0.25;
				player.velY = -1 * jumpStrength;
				player.doubleJump = false;
			}
		break;
		case "a":
			left = true;
		break;
		case "d":
			right = true;
		break;

	}
}

//INPUT
function keyUp(e){
	switch(e.key){
		case "a":
			left = false;
		break;
		case "d":
			right = false;
		break;
	}
}

//INPUT
function clickDown(e){
	shoot = true;
	pageX = e.pageX;
	pageY = e.pageY;
}

//INPUT
function clickUp(e){
	maxDist = 0;
	shoot = false;
}

//INPUT
function mouseMove(e){
	pageX = e.pageX;
	pageY = e.pageY;
}

function platformAt(_x, _y){
	
	let gameX = _x + player.rect.x - startX;
	let gameY = _y + player.rect.y - startY;
	
	for(let i = 0; i <  platforms.length; i++){
		let p = platforms[i];
		if(p.rect.x < gameX && p.rect.x + p.rect.w > gameX && p.rect.y < gameY && p.rect.y + p.rect.h > gameY) { return true; }
	}
	return false;
}

//LEVEL GENERATION
function generateRandomLevel(){
	for(let i = 1; i < platformCount; i++){
		let prevPlat = platforms[i-1];
		
		let randX = Math.floor(Math.random() * 96) + 49;
		let randY = Math.floor(Math.random() * 384) - 191;
		let randW = Math.floor(Math.random() * 288) + 144;
		
		let newPlat = new Platform(new Rect(prevPlat.rect.x + prevPlat.rect.w + randX, prevPlat.rect.y + randY, randW, 48, FOREGROUND_COLOR, BACKGROUND_COLOR));
		platforms[i] = newPlat;
		
		let chance = Math.random();
		
		//POWERUP
		if(chance < powerupChance){
			chance = 0;
			let powerup = new Powerup(new Rect(newPlat.rect.x + (newPlat.rect.w/2) - 24, newPlat.rect.y - 64, 48, 48, FOREGROUND_COLOR, BACKGROUND_COLOR));
			powerups.push(powerup);
		}
		//ENEMY
		else if(chance < enemyChance){
			chance = 0;
			let enemy = new Enemy(new Rect(prevPlat.rect.x + prevPlat.rect.w + randX + (randW/2), prevPlat.rect.y + randY - 48, 32, 48, FOREGROUND_COLOR, BACKGROUND_COLOR), platforms[i], 10);
			enemies.push(enemy);
			//ENEMY AND COIN
			if(Math.random() < coinChance){
				let coin = new Coin(new Rect(newPlat.rect.x + (newPlat.rect.w/2) - 16, newPlat.rect.y - 96, 32, 32, FOREGROUND_COLOR, BACKGROUND_COLOR), 24, 32);
				coins.push(coin);
			}
		}
		//COIN
		else{
			if(Math.random() < coinChance){
				let coin = new Coin(new Rect(newPlat.rect.x + (newPlat.rect.w/2) - 16, newPlat.rect.y - 96, 32, 32, FOREGROUND_COLOR, BACKGROUND_COLOR), 24, 32);
				coins.push(coin);
			}
		}
	}
}

//GAME LOOP
function gameLoop(){
	
	//UPDATE CANVAS
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	startX = innerWidth/2;
	startY = innerHeight/2;
	ctx.save();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawUI();
	ctx.translate(startX - player.rect.x, startY - player.rect.y);
	
	//INPUT
	if(left && !right) { player.velX = -1 * moveSpeed; }
	else if(!left && right) { player.velX = 1 * moveSpeed; }
	
	if(shoot){
		let thetaRad = Math.atan2(pageY - (canvas.height/2) - 32, pageX - (canvas.width/2));
		let newX = player.rect.x + player.rect.w/2;
		player.shoot(bullets, thetaRad, newX, player.rect.y + 27, 10, 10, FOREGROUND_COLOR, BACKGROUND_COLOR, 256);
	}
	
	player.update();
	player.currentWeapon.update();
	
	//POWERUPS
	for(let i = 0; i < powerups.length; i++){
		let powerup = powerups[i];
		powerup.rect.draw(ctx);
		player.collisionPowerup(powerup, weapons);
		if(!powerup.enabled) {powerups.splice(i, 1); i--; }
	}
	
	//PLATFORMS
	for(let i = 0; i < platforms.length; i++){
		let platform = platforms[i];
		player.collision(platform);
		platform.rect.draw(ctx);
		
		for(let b = 0; b < bullets.length; b++){
			platform.collision(bullets[b]);
		}
	}
	
	//ENEMIES
	for(let i = 0; i < enemies.length; i++){
		let enemy = enemies[i];
		enemy.update();
		enemy.rect.draw(ctx);
		
		for(let b = 0; b < bullets.length; b++){
			enemy.collision(bullets[b]);
		}
		
		if(!enemy.enabled) {enemies.splice(i, 1); i--; }
		player.collisionEnemy(enemy);
	}
	
	//BULLETS
	for(let i = 0; i < bullets.length; i++){
		let bullet = bullets[i];
		bullet.update();
		bullet.rect.draw(ctx);
		
		if(!bullet.enabled) { bullets.splice(i, 1); i--; }
	}
	
	//COINS
	for(let i = 0; i < coins.length; i++){
		let coin = coins[i];
		coin.update();
		player.collisionCoin(coin);
		coin.rect.draw(ctx);
		
		if(!coin.enabled) { coins.splice(i, 1); i--; };
	}
	
	player.rect.draw(ctx);
	if(player.rect.y > 2560) location.reload();
	
	ctx.restore();
	TIME_ELAPSED = Date.now() - START_TIME;
	//requestAnimationFrame(gameLoop);
}

function drawUI(){
	let scoreStr = player.score.toString();
	let nums = scoreStr.length;
	let timeStr = (TIME_ELAPSED/1000).toString().split(".")[0];
	let numsTime = timeStr.length;
	
	for(let i = 0; i < numsTime; i++){
		let num = timeStr[i];
		
		let posX = 16 + (i*(6*pixSize));
		let posY = 16;
		
		drawDigit(num, posX, posY, pixSize);
	}
	
	for(let i = 0; i < nums; i++){
		let num = scoreStr[i];
		
		let posX = 16 + (i*(6*pixSize));
		let posY = 16 + (10*pixSize);
		
		drawDigit(num, posX, posY, pixSize);
	}
}

function drawDigit(num, posX, posY, pixSize){
	let segs = segments[num];
	
	ctx.fillStyle = FOREGROUND_COLOR;
	if(segs[0] == "1") { ctx.fillRect(posX+1*pixSize, posY,            3*pixSize, 1*pixSize); }
	if(segs[1] == "1") { ctx.fillRect(posX,           posY+1*pixSize,  1*pixSize, 3*pixSize); }
	if(segs[2] == "1") { ctx.fillRect(posX+4*pixSize, posY+1*pixSize,  1*pixSize, 3*pixSize); }
	if(segs[3] == "1") { ctx.fillRect(posX+1*pixSize, posY+4*pixSize,  3*pixSize, 1*pixSize); }
	if(segs[4] == "1") { ctx.fillRect(posX,           posY+5*pixSize,  1*pixSize, 3*pixSize); }
	if(segs[5] == "1") { ctx.fillRect(posX+4*pixSize, posY+5*pixSize,  1*pixSize, 3*pixSize); }
	if(segs[6] == "1") { ctx.fillRect(posX+1*pixSize, posY+8*pixSize,  3*pixSize, 1*pixSize); }
}














