class Platform{
	
	constructor(rect){
		this.rect = rect;
	}
	
	collision(bullet){
		if(this.rect.x + this.rect.w > bullet.rect.x && this.rect.x < bullet.rect.x + bullet.rect.w){
			if(this.rect.y + this.rect.h > bullet.rect.y && this.rect.y < bullet.rect.y + bullet.rect.h){
				bullet.enabled = false;
			}
		}
	}
}