import { Entity } from './entity.js';

const TOWER_COLOR = [0.91, 0.64, 0.29, 1]; //laranja

export class Tower extends Entity {
  constructor({ x = 0, y = 0, radius = 60, maxHp = 100, range = 500, fireRate = 1.5, damage = 12 } = {}) {
    super(x, y, radius, TOWER_COLOR);
    this.maxHp = maxHp;
    this.hp = maxHp;
    this.range = range;
    this.fireRate = fireRate; 
    this.damage = damage;
    this.fireCooldown = 0;
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
  }

  isDestroyed() {
    return this.hp <= 0;
  }

  findTarget(enemies) {
    let nearest = null;
    let nearestDistance = Infinity;

    for (const enemy of enemies) {
      if (!enemy.alive) continue;
      const dx = enemy.x - this.x;
      const dy = enemy.y - this.y;
      const distance = Math.hypot(dx, dy);
      if (distance <= this.range && distance < nearestDistance) {
        nearest = enemy;
        nearestDistance = distance;
      }
    }

    return nearest;
  }

  /**
   * @param {number} deltaTime
   * @param {import('./enemy.js').Enemy[]} enemies
   * @param {(x: number, y: number, target: object, damage: number) => void} spawnProjectile
   */
  update(deltaTime, enemies, spawnProjectile) {
    this.fireCooldown -= deltaTime;
    if (this.fireCooldown > 0) return;

    const target = this.findTarget(enemies);
    if (!target) return;

    spawnProjectile(this.x, this.y, target, this.damage);
    this.fireCooldown = 1 / this.fireRate;
  }
}
