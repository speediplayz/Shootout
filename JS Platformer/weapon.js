class Weapon{
	
	constructor(bulletCount, spread, bulletSpeed, cooldown, damage, applyGrav, G){
		this.bulletCount = bulletCount;
		this.spread = spread;
		this.bulletSpeed = bulletSpeed;
		this.cooldown = cooldown;
		this.lastFired = cooldown;
		this.ready = false;
		this.damage = damage;
		this.applyGrav = applyGrav;
		this.G = G;
	}
	
	update(){
		this.lastFired++;
		if(this.lastFired > this.cooldown) { this.lastFired = 0; this.ready = true; }
	}
	
	shoot(bullets, angleRad, x, y, w, h, color, backColor, ticks){
		if(this.ready){
			this.ready = false;
			this.lastFired = 0;
			let min = 360 + (angleRad * (180/Math.PI)) - this.spread;
		
			for(let i = 0; i < this.bulletCount; i++){
				let randAngle = ((Math.random() * (this.spread * 2) + min) - 360)/180*Math.PI;
				
				let velX = Math.cos(randAngle) * this.bulletSpeed;
				let velY = Math.sin(randAngle) * this.bulletSpeed;
				let rect = new Rect(x, y, w, h, color, backColor);
				let bullet = new Bullet(rect, velX, velY, ticks, this.damage, this.applyGrav, this.G);
				bullets.push(bullet);
			}	
		}
	}
}