export class PowerUp {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 14;
    this.color = [0.4, 0.9, 0.5, 1];
    this.alive = true;
    this.lifetime = 8;
  }

  update(deltaTime) {
    this.lifetime -= deltaTime;
    if (this.lifetime <= 0) this.alive = false;
  }
}