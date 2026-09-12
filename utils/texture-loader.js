const PLACEHOLDER_PIXEL = new Uint8Array([255, 0, 255, 255]);

/**
 * @param {WebGL2RenderingContext} gl
 * @param {string} url
 * @param {(image: HTMLImageElement) => void} [onLoaded]
 * @returns {WebGLTexture}
 */
export function createTexture(gl, url, onLoaded, onError) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
    gl.RGBA, gl.UNSIGNED_BYTE, PLACEHOLDER_PIXEL
  );

  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    const isPowerOf2 = (value) => (value & (value - 1)) === 0;

    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

    if (onLoaded) onLoaded(image);
  };
  image.onerror = (err) => {
    console.error(`Falha ao carregar textura: ${url}`);
    if (onError) onError(err);
  };
  image.src = url;

  return texture;
}

/**
 * @param {WebGL2RenderingContext} gl
 * @param {string} url
 * @returns {Promise<WebGLTexture>}
 */
export function loadTexture(gl, url) {
  return new Promise((resolve, reject) => {
    const texture = createTexture(
      gl, url,
      () => resolve(texture),
      () => reject(new Error(`Falha ao carregar textura: ${url}`))
    );
  });
}
