import { Renderer } from './renderer.js';
import { Game } from './game.js';


const WORLD_WIDTH = 1600;
const WORLD_HEIGHT = 900;

const canvas = document.getElementById('game-canvas');
const renderer = new Renderer(canvas, WORLD_WIDTH, WORLD_HEIGHT);
const game = new Game({ worldWidth: WORLD_WIDTH, worldHeight: WORLD_HEIGHT });

const hpValueEl = document.getElementById('hp-value');
const scoreValueEl = document.getElementById('score-value');
const gameOverScreenEl = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');
const restartButtonEl = document.getElementById('restart-button');

restartButtonEl.addEventListener('click', () => {
  game.reset();
});

function updateHud() {
  hpValueEl.textContent = Math.max(0, Math.ceil(game.tower.hp));
  scoreValueEl.textContent = game.score;

  gameOverScreenEl.classList.toggle('hidden', !game.isGameOver);
  finalScoreEl.textContent = game.isGameOver ? `Pontuação final: ${game.score}` : '';
}

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const cssX = event.clientX - rect.left;
  const cssY = event.clientY - rect.top;

  const worldX = (cssX / rect.width - 0.5) * WORLD_WIDTH;
  const worldY = -(cssY / rect.height - 0.5) * WORLD_HEIGHT;

  game.handleClick(worldX, worldY);
});

function render() {
  renderer.clear();
  renderer.drawEntity(game.tower);
  for (const enemy of game.enemies) renderer.drawEntity(enemy);
  for (const projectile of game.projectiles) renderer.drawEntity(projectile);
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
