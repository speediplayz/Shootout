class Player{
	
	constructor(rect, G){
		this.rect = rect;
		this.G = G;
		this.velX = 0;
		this.velY = 0;
		this.accX = 0;
		this.accY = 0;
		this.grounded = true;
		this.doubleJump = false;
		this.currentWeapon = null;
		this.score = 0;
	}
	
	update(){
		this.accY += G;
		
		this.velX += this.accX;
		this.velY += this.accY;
		
		this.rect.x += this.velX;
		this.rect.y += this.velY;
		
		this.velX *= 0.75;
		
	if(GOD_MODE && GOD_WEAPON) { this.currentWeapon = godgun; }
		
		/*if(this.velY != 0 && this.grounded) {
			this.grounded = false;
			this.doubleJump = true;
		}*/
	}
	
	shoot(bullets, angleRad, x, y, w, h, color, backColor, ticks){
		this.currentWeapon.shoot(bullets, angleRad, x, y, w, h, color, backColor, ticks);
	}
	
	collisionPowerup(pow, weaponList){
		if(this.rect.x + this.rect.w > pow.rect.x && this.rect.x < pow.rect.x + pow.rect.w){
			if(this.rect.y + this.rect.h > pow.rect.y && this.rect.y < pow.rect.y + pow.rect.h){
				pow.enabled = false;
				let newList = new Array(0);
				for(let i = 0; i < weaponList.length; i++){
					let weapon = weaponList[i];
					if(weapon != this.currentWeapon) { newList.push(weapon); }
				}
				this.score += 2;
				if(!GOD_MODE) { this.currentWeapon = newList[Math.floor(Math.random() * newList.length)]; }
			}
		}
	}
	
	collisionEnemy(enem){
		if(this.rect.x + this.rect.w > enem.rect.x && this.rect.x < enem.rect.x + enem.rect.w){
			if(this.rect.y + this.rect.h > enem.rect.y && this.rect.y < enem.rect.y + enem.rect.h){
				if(!GOD_MODE) { location.reload(); }
			}
		}
	}
	
	collisionCoin(coin){
		if(this.rect.x + this.rect.w > coin.rect.x && this.rect.x < coin.rect.x + coin.rect.w){
			if(this.rect.y + this.rect.h > coin.rect.y && this.rect.y < coin.rect.y + coin.rect.h){
				coin.enabled = false;
				this.score += 5;
			}
		}
	}
	
	collision(plat){
		
		if(this.rect.x + this.rect.w > plat.rect.x && this.rect.x < plat.rect.x + plat.rect.w){
			if(this.rect.y + this.rect.h > plat.rect.y && this.rect.y < plat.rect.y + plat.rect.h){
				//collision occured;
				
				let lastX = this.rect.x - this.velX - this.velX;
				let lastY = this.rect.y - this.velY - this.velY;
				
				let movePlayer = true;
				
				if(this.velY > 0 && this.rect.y + this.rect.h > plat.rect.y){ // up to down
					if(lastX >= plat.rect.x + plat.rect.w || lastX + this.rect.w <= plat.rect.x){
						movePlayer = false;
					}
					if(movePlayer){
						let diff = (this.rect.y + this.rect.h) - plat.rect.y;
						this.rect.y -= diff;
						this.velY = 0;
						this.accY = 0;
						this.grounded = true;
						this.doubleJump = false;
						return true;
					}
				}
				if(this.velY < 0 && this.rect.y < plat.rect.y + plat.rect.h){ // down to up
					if(lastX >= plat.rect.x + plat.rect.w || lastX + this.rect.w <= plat.rect.x){
						movePlayer = false;
					}
					if(movePlayer){
						let diff = this.rect.y - (plat.rect.y + plat.rect.h);
						this.rect.y -= diff;
						this.velY = 0;
						this.accY = 0;
						return true;
					}
				}
				if(this.velX > 0 && this.rect.x + this.rect.w > plat.rect.x){ // left to right
					let diff = plat.rect.x - (this.rect.x + this.rect.w);
					this.rect.x += diff;
					this.velX = 0;
					this.accX = 0;
					return true;
				}
				if(this.velX < 0 && this.rect.x < plat.rect.x + plat.rect.w){ // right to left
					let diff = this.rect.x - (plat.rect.x + plat.rect.w);
					this.rect.x -= diff;
					this.velX = 0;
					this.accX = 0;
					return true;
				}
			}
		}
		return false;
	}
}