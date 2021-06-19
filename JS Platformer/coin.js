class Coin{
	
	constructor(rect, scale, speed){
		this.rect = rect;
		this.startTime = Date.now();
		this.startY = rect.y;
		this.scale = scale;
		this.speed = speed * 1000;
		this.enabled = true;
	}
	
	update(){
		if(this.enabled){
			let time = (Date.now() - this.startTime) / this.speed;
			let val = Math.sin(time*(180/Math.PI)) * this.scale;
			
			this.rect.y = this.startY + val;
		}
	}
}