import { Tower } from './entities/tower.js';
import { Enemy } from './entities/enemy.js';
import { Projectile } from './entities/projectile.js';
import { PowerUp } from './entities/powerup.js';
import { EnemySpawner } from './spawner.js';
import { circleContainsPoint } from '../utils/collision.js';

const DEDADA_DAMAGE = 15;
const POWERUP_DROP_CHANCE = 0.3; // 30% de chance de dropar ao morrer
const POWERUP_HEAL = 20;

export class Game {
  constructor({ worldWidth, worldHeight }) {
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.spawner = new EnemySpawner({ worldWidth, worldHeight });
    this.enemyTexture = null;
    this.enemyFrameCount = 1;
    this.skullTexture = null;
    this.reset();
  }

  reset() {
    this.tower = new Tower({ x: 0, y: 0 });
    this.enemies = [];
    this.projectiles = [];
    this.powerups = [];
    this.score = 0;
    this.isGameOver = false;
    this.spawner.reset();
  }

  spawnEnemy(position) {
    this.enemies.push(new Enemy({
      x: position.x, y: position.y,
      texture: this.enemyTexture,
      frameCount: this.enemyFrameCount,
    }));
  }

  spawnProjectile(x, y, target, damage) {
    const p = new Projectile(x, y, target, damage);
    p.texture = this.skullTexture;
    this.projectiles.push(p);
  }

  handleClick(worldX, worldY) {
    if (this.isGameOver) return;

    // Checa se clicou num power-up
    for (const pu of this.powerups) {
      if (pu.alive && circleContainsPoint(pu, worldX, worldY)) {
        this.tower.hp = Math.min(this.tower.maxHp, this.tower.hp + POWERUP_HEAL);
        pu.alive = false;
        return;
      }
    }

    for (const enemy of this.enemies) {
      if (enemy.alive && circleContainsPoint(enemy, worldX, worldY)) {
        enemy.takeDamage(DEDADA_DAMAGE);
        break;
      }
    }
  }

  update(deltaTime) {
    if (this.isGameOver) return;

    this.spawner.update(deltaTime, (position) => this.spawnEnemy(position));

    this.tower.update(deltaTime, this.enemies, (x, y, target, damage) =>
      this.spawnProjectile(x, y, target, damage)
    );

    for (const enemy of this.enemies) enemy.update(deltaTime, this.tower);
    for (const projectile of this.projectiles) projectile.update(deltaTime);
    for (const pu of this.powerups) pu.update(deltaTime);

    this.enemies = this.enemies.filter((enemy) => {
      if (!enemy.alive) {
        this.score += enemy.scoreValue;
        if (Math.random() < POWERUP_DROP_CHANCE) {
          this.powerups.push(new PowerUp(enemy.x, enemy.y));
        }
        return false;
      }
      return true;
    });

    this.projectiles = this.projectiles.filter((projectile) => projectile.alive);
    this.powerups = this.powerups.filter((pu) => pu.alive);

    if (this.tower.isDestroyed()) {
      this.isGameOver = true;
    }
  }
}
