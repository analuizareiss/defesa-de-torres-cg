import { Entity } from './entity.js';

const ENEMY_COLOR = [0.82, 0.24, 0.24, 1]; // vermelho

export class Enemy extends Entity {
  constructor({
    x, y, radius = 28, maxHp = 30, speed = 60, damage = 8, attackRate = 1, scoreValue = 10,
    texture = null, frameCount = 1, frameDuration = 0.15,
  } = {}) {
    super(x, y, radius, ENEMY_COLOR, texture);
    this.maxHp = maxHp;
    this.hp = maxHp;
    this.speed = speed;
    this.damage = damage;
    this.attackRate = attackRate; 
    this.attackCooldown = 0;
    this.scoreValue = scoreValue;

    this.frameCount = frameCount;
    this.frameDuration = frameDuration;
    this.frameTimer = 0;
    this.currentFrame = 0;
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    if (this.hp <= 0) this.alive = false;
  }

  updateAnimation(deltaTime) {
    if (this.frameCount <= 1) return;

    this.frameTimer += deltaTime;
    if (this.frameTimer >= this.frameDuration) {
      this.frameTimer -= this.frameDuration;
      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
    }
  }

  /**
   * @param {number} deltaTime
   * @param {import('./tower.js').Tower} tower
   */
  update(deltaTime, tower) {
    if (!this.alive) return;

    this.updateAnimation(deltaTime);

    const dx = tower.x - this.x;
    const dy = tower.y - this.y;
    const distance = Math.hypot(dx, dy);
    const attackReach = this.radius + tower.radius;

    if (distance > attackReach) {
      const nx = dx / distance;
      const ny = dy / distance;
      this.x += nx * this.speed * deltaTime;
      this.y += ny * this.speed * deltaTime;
      return;
    }

    this.attackCooldown -= deltaTime;
    if (this.attackCooldown <= 0) {
      tower.takeDamage(this.damage);
      this.attackCooldown = 1 / this.attackRate;
    }
  }
}
