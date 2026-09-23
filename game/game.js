import { Tower } from './entities/tower.js';
import { Enemy } from './entities/enemy.js';
import { Projectile } from './entities/projectile.js';
import { EnemySpawner } from './spawner.js';
import { circleContainsPoint } from '../utils/collision.js';

const DEDADA_DAMAGE = 15;

export class Game {
  constructor({ worldWidth, worldHeight }) {
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.spawner = new EnemySpawner({ worldWidth, worldHeight });
    this.enemyTexture = null;
    this.enemyFrameCount = 1;
    this.reset();
  }

  reset() {
    this.tower = new Tower({ x: 0, y: 0 });
    this.enemies = [];
    this.projectiles = [];
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

    this.enemies = this.enemies.filter((enemy) => {
      if (!enemy.alive) {
        this.score += enemy.scoreValue;
        return false;
      }
      return true;
    });

    this.projectiles = this.projectiles.filter((projectile) => projectile.alive);

    if (this.tower.isDestroyed()) {
      this.isGameOver = true;
    }
  }
}
