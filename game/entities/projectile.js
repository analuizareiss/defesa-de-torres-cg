import { Entity } from './entity.js';

const PROJECTILE_COLOR = [0.95, 0.85, 0.35, 1]; // amarelo

export class Projectile extends Entity {
  constructor(x, y, target, damage, speed = 500) {
    super(x, y, 8, PROJECTILE_COLOR);
    this.target = target;
    this.damage = damage;
    this.speed = speed;
  }

  update(deltaTime) {
    if (!this.target || !this.target.alive) {
      this.alive = false;
      return;
    }

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distance = Math.hypot(dx, dy);
    const step = this.speed * deltaTime;

    if (distance <= step || distance <= this.target.radius) {
      this.target.takeDamage(this.damage);
      this.alive = false;
      return;
    }

    this.x += (dx / distance) * step;
    this.y += (dy / distance) * step;
  }
}
