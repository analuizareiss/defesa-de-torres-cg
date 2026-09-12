export function identity() {
  return new Float32Array([
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
  ]);
}

/**
 * @param {Float32Array} a
 * @param {Float32Array} b
 * @returns {Float32Array}
 */
export function multiply(a, b) {
  const out = new Float32Array(9);

  for (let col = 0; col < 3; col++) {
    for (let row = 0; row < 3; row++) {
      let sum = 0;
      for (let k = 0; k < 3; k++) {
        sum += a[k * 3 + row] * b[col * 3 + k];
      }
      out[col * 3 + row] = sum;
    }
  }

  return out;
}


export function translation(tx, ty) {
  return new Float32Array([
    1, 0, 0,
    0, 1, 0,
    tx, ty, 1,
  ]);
}


export function scaling(sx, sy) {
  return new Float32Array([
    sx, 0, 0,
    0, sy, 0,
    0, 0, 1,
  ]);
}


export function rotation(angleRad) {
  const c = Math.cos(angleRad);
  const s = Math.sin(angleRad);
  return new Float32Array([
    c, s, 0,
    -s, c, 0,
    0, 0, 1,
  ]);
}

/**
 * (-1 a 1 em X e Y). 
 * @param {number} worldWidth
 * @param {number} worldHeight
 */
export function projection(worldWidth, worldHeight) {
  return new Float32Array([
    2 / worldWidth, 0, 0,
    0, 2 / worldHeight, 0,
    0, 0, 1,
  ]);
}
