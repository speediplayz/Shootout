class Enemy{
	
	constructor(rect, platform, health){
		this.rect = rect;
		this.vel = (Math.random() * 3) + 1;
		this.plat = platform;
		this.health = health;
		this.enabled = true;
	}
	
	update(){
		if(this.enabled){
			this.rect.x += this.vel;
			
			if(this.rect.x < this.plat.rect.x + 9) { this.vel *= -1; }
			if(this.rect.x + this.rect.w > this.plat.rect.x + this.plat.rect.w - 8) { this.vel *= -1; }
		}
	}
	
	collision(bullet){
		if(this.rect.x + this.rect.w > bullet.rect.x && this.rect.x < bullet.rect.x + bullet.rect.w){
			if(this.rect.y + this.rect.h > bullet.rect.y && this.rect.y < bullet.rect.y + bullet.rect.h){
				bullet.enabled = false;
				this.health -= bullet.damage;
				if(this.health <= 0 && this.enabled) { this.enabled = false; player.score++; }
			}
		}
	}
}