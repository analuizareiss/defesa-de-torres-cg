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

const QUAD_TEXCOORDS = new Float32Array([
  0, 0,
  1, 0,
  0, 1,
  0, 1,
  1, 0,
  1, 1,
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
    this.texcoordAttribLocation = gl.getAttribLocation(this.program, 'a_texcoord');
    this.matrixUniformLocation = gl.getUniformLocation(this.program, 'u_matrix');
    this.colorUniformLocation = gl.getUniformLocation(this.program, 'u_color');
    this.textureUniformLocation = gl.getUniformLocation(this.program, 'u_texture');
    this.useTextureUniformLocation = gl.getUniformLocation(this.program, 'u_useTexture');
    this.uvOffsetUniformLocation = gl.getUniformLocation(this.program, 'u_uvOffset');
    this.uvScaleUniformLocation = gl.getUniformLocation(this.program, 'u_uvScale');

    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, QUAD_VERTICES, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.positionAttribLocation);
    gl.vertexAttribPointer(this.positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, QUAD_TEXCOORDS, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.texcoordAttribLocation);
    gl.vertexAttribPointer(this.texcoordAttribLocation, 2, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  resize() {
    if (resizeCanvasToDisplaySize(this.canvas)) {
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  clear() {
    const gl = this.gl;
    gl.clearColor(0.93, 0.94, 0.97, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  drawQuad(x, y, width, height, color, texture = null, uvOffset = [0, 0], uvScale = [1, 1]) {
    const gl = this.gl;
    const matrix = multiply(
      projection(this.worldWidth, this.worldHeight),
      multiply(translation(x, y), scaling(width, height))
    );

    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);
    gl.uniformMatrix3fv(this.matrixUniformLocation, false, matrix);
    gl.uniform4fv(this.colorUniformLocation, color);
    gl.uniform2fv(this.uvOffsetUniformLocation, uvOffset);
    gl.uniform2fv(this.uvScaleUniformLocation, uvScale);

    if (texture) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(this.textureUniformLocation, 0);
      gl.uniform1i(this.useTextureUniformLocation, 1);
    } else {
      gl.uniform1i(this.useTextureUniformLocation, 0);
    }

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  drawEntity(entity) {
    const frameCount = entity.frameCount || 1;
    const currentFrame = entity.currentFrame || 0;
    const uvScale = [1 / frameCount, 1];
    const uvOffset = [currentFrame / frameCount, 0];

    this.drawQuad(
      entity.x, entity.y, entity.radius * 2, entity.radius * 2,
      entity.color, entity.texture, uvOffset, uvScale
    );
  }

  drawBackground(texture) {
    if (!texture) return;
    this.drawQuad(0, 0, this.worldWidth, this.worldHeight, [1, 1, 1, 1], texture);
  }
}
