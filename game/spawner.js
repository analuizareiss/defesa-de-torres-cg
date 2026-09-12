export class EnemySpawner {
  constructor({ worldWidth, worldHeight, initialInterval = 2.5, minInterval = 0.6, difficultyRampSeconds = 45 } = {}) {
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.initialInterval = initialInterval;
    this.minInterval = minInterval;
    this.difficultyRampSeconds = difficultyRampSeconds;

    this.timer = initialInterval;
    this.elapsed = 0;
  }

  reset() {
    this.timer = this.initialInterval;
    this.elapsed = 0;
  }

  currentInterval() {
    const t = Math.min(this.elapsed / this.difficultyRampSeconds, 1);
    return this.initialInterval + (this.minInterval - this.initialInterval) * t;
  }

  randomEdgePosition() {
    const margin = 80;
    const halfWidth = this.worldWidth / 2 + margin;
    const halfHeight = this.worldHeight / 2 + margin;
    const side = Math.floor(Math.random() * 4);

    switch (side) {
      case 0: 
        return { x: (Math.random() * 2 - 1) * (this.worldWidth / 2), y: halfHeight };
      case 1:
        return { x: (Math.random() * 2 - 1) * (this.worldWidth / 2), y: -halfHeight };
      case 2: 
        return { x: -halfWidth, y: (Math.random() * 2 - 1) * (this.worldHeight / 2) };
      default:
        return { x: halfWidth, y: (Math.random() * 2 - 1) * (this.worldHeight / 2) };
    }
  }

  /**
   * @param {number} deltaTime
   * @param {(position: {x: number, y: number}) => void} onSpawn
   */
  update(deltaTime, onSpawn) {
    this.elapsed += deltaTime;
    this.timer -= deltaTime;

    if (this.timer <= 0) {
      onSpawn(this.randomEdgePosition());
      this.timer = this.currentInterval();
    }
  }
}
