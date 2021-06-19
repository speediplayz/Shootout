class Bullet{
	
	constructor(rect, velX, velY, maxFrames, damage, applyGrav, G){
		this.rect = rect;
		this.velX = velX;
		this.velY = velY;
		this.maxFrames = maxFrames;
		this.frame = 0;
		this.enabled = true;
		this.damage = damage;
		this.applyGrav = applyGrav;
		this.G = G;
	}
	
	update(){
		if(this.enabled){
			if(this.applyGrav){
				this.velY += this.G;
			}
			this.rect.x += this.velX;
			this.rect.y += this.velY;
			this.frame++;
			if(this.frame > this.maxFrames) { this.enabled = false; }
		}
	}
}