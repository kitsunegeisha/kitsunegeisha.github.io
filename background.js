class ScrollingBackground {
    constructor(imageSrc, speed) {
      this.x = 0;
      this.y = 0;
      this.speed = speed;
      this.image = new Image();
      this.image.src = imageSrc;
    }
  
    draw() {
      ctx.drawImage(this.image, this.x, this.y, canvas.width, canvas.height);
      ctx.drawImage(
        this.image,
        this.x + canvas.width,
        this.y,
        canvas.width,
        canvas.height
      );
    }
  
    update() {
      this.x -= this.speed;
      if (this.x <= -canvas.width) {
        this.x = 0;
      }
    }
  }
  