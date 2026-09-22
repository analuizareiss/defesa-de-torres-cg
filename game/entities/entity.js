export class Entity {
  constructor(x, y, radius, color, texture = null) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.texture = texture;
    this.alive = true;
  }
}
