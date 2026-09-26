import { Renderer } from './renderer.js';
import { Game } from './game.js';
import { loadTexture } from '../utils/texture-loader.js';

const WORLD_WIDTH = 1600;
const WORLD_HEIGHT = 900;

const canvas = document.getElementById('game-canvas');
const renderer = new Renderer(canvas, WORLD_WIDTH, WORLD_HEIGHT);
const game = new Game({ worldWidth: WORLD_WIDTH, worldHeight: WORLD_HEIGHT });

loadTexture(renderer.gl, './assets/enemy_ghost.png')
  .then((texture) => {
    game.enemyTexture = texture;
    game.enemyFrameCount = 4;
  })
  .catch((err) => console.error(err));

let backgroundTexture = null;
loadTexture(renderer.gl, './assets/background.png')
  .then((texture) => {
    backgroundTexture = texture;
  })
  .catch((err) => console.error(err));

loadTexture(renderer.gl, './assets/tower.png')
  .then((texture) => {
    game.towerTexture = texture;
    game.tower.texture = texture;
  })
  .catch((err) => console.error(err));

loadTexture(renderer.gl, './assets/skull.png')
  .then((texture) => {
    game.skullTexture = texture;
  })
  .catch((err) => console.error(err));

loadTexture(renderer.gl, './assets/powerup_potion.png')
  .then((texture) => { game.potionTexture = texture; })
  .catch((err) => console.error(err));

const hpValueEl = document.getElementById('hp-value');
const hpBarFillEl = document.getElementById('hp-bar-fill');
const scoreValueEl = document.getElementById('score-value');
const gameOverScreenEl = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');
const restartButtonEl = document.getElementById('restart-button');

restartButtonEl.addEventListener('click', () => {
  game.reset();
});

function updateHud() {
  const hp = Math.max(0, game.tower.hp);
  const hpPercent = (hp / game.tower.maxHp) * 100;

  hpValueEl.textContent = Math.ceil(hp);
  scoreValueEl.textContent = game.score;

  hpBarFillEl.style.width = `${hpPercent}%`;
  hpBarFillEl.classList.toggle('mid', hpPercent <= 50 && hpPercent > 20);
  hpBarFillEl.classList.toggle('low', hpPercent <= 20);

  gameOverScreenEl.classList.toggle('hidden', !game.isGameOver);
  finalScoreEl.textContent = game.isGameOver ? `Pontuação final: ${game.score}` : '';
}

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const cssX = event.clientX - rect.left;
  const cssY = event.clientY - rect.top;

  const canvasAspect = canvas.width / canvas.height;
  const worldAspect = WORLD_WIDTH / WORLD_HEIGHT;
  const aspectFix = canvasAspect / worldAspect;

  const worldX =  (cssX / rect.width  - 0.5) * WORLD_WIDTH;
  const worldY = -(cssY / rect.height - 0.5) * WORLD_HEIGHT * aspectFix;

  game.handleClick(worldX, worldY);
});

const bgMusic = new Audio('./assets/music.ogg');
bgMusic.loop = true;
bgMusic.volume = 0.4;

canvas.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play();
  }
}, { once: true });

function render() {
  renderer.clear();
  renderer.drawBackground(backgroundTexture);
  renderer.drawEntity(game.tower);
  for (const enemy of game.enemies) renderer.drawEntity(enemy);
  for (const projectile of game.projectiles) renderer.drawEntity(projectile);
  for (const pu of game.powerups) renderer.drawEntity(pu);
}

let lastTime = 0;

function frame(now) {
  now *= 0.001; 
  const deltaTime = Math.min(now - lastTime, 0.1);
  lastTime = now;

  renderer.resize();
  game.update(deltaTime);
  render();
  updateHud();

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
