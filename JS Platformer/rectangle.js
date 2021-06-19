class Rect{
	
	constructor(x, y, w, h, color, backColor){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.color = color;
		this.backColor = backColor;
	}
	
	draw(context){
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.w, this.h);
		context.fillStyle = this.backColor;
		context.fillRect(this.x + 2, this.y + 2, this.w - 4, this.h - 4);
		context.fillStyle = this.color;
		context.fillRect(this.x + 4, this.y + 4, this.w - 8, this.h - 8);
	}
}