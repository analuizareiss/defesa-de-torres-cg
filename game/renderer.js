import { createProgram, resizeCanvasToDisplaySize } from '../utils/shader-loader.js';
import { multiply, translation, scaling, projection } from '../utils/math.js';
import { vertexShaderSource, fragmentShaderSource } from './shaders.js';

const QUAD_VERTICES = new Float32Array([
  -0.5, -0.5,
   0.5, -0.5,
  -0.5,  0.5,
  -0.5,  0.5,
   0.5, -0.5,
   0.5,  0.5,
]);

export class Renderer {
  constructor(canvas, worldWidth, worldHeight) {
    this.canvas = canvas;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;

    this.gl = canvas.getContext('webgl2');
    if (!this.gl) {
      throw new Error('WebGL2 não é suportado neste navegador.');
    }

    this._setup();
  }

  _setup() {
    const gl = this.gl;

    this.program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    this.positionAttribLocation = gl.getAttribLocation(this.program, 'a_position');
    this.matrixUniformLocation = gl.getUniformLocation(this.program, 'u_matrix');
    this.colorUniformLocation = gl.getUniformLocation(this.program, 'u_color');

    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, QUAD_VERTICES, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(this.positionAttribLocation);
    gl.vertexAttribPointer(this.positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);
  }

  resize() {
    if (resizeCanvasToDisplaySize(this.canvas)) {
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  clear() {
    const gl = this.gl;
    gl.clearColor(0.05, 0.06, 0.09, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  drawQuad(x, y, width, height, color) {
    const gl = this.gl;
    const matrix = multiply(
      projection(this.worldWidth, this.worldHeight),
      multiply(translation(x, y), scaling(width, height))
    );

    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);
    gl.uniformMatrix3fv(this.matrixUniformLocation, false, matrix);
    gl.uniform4fv(this.colorUniformLocation, color);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  drawEntity(entity) {
    this.drawQuad(entity.x, entity.y, entity.radius * 2, entity.radius * 2, entity.color);
  }
}
