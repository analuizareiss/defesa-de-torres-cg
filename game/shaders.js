export const vertexShaderSource = `#version 300 es
in vec2 a_position;
in vec2 a_texcoord;

uniform mat3 u_matrix;
uniform vec2 u_uvOffset;
uniform vec2 u_uvScale;

out vec2 v_texcoord;

void main() {
  vec2 position = (u_matrix * vec3(a_position, 1.0)).xy;
  gl_Position = vec4(position, 0.0, 1.0);
  v_texcoord = a_texcoord * u_uvScale + u_uvOffset;
}
`;

export const fragmentShaderSource = `#version 300 es
precision mediump float;

uniform vec4 u_color;
uniform sampler2D u_texture;
uniform bool u_useTexture;

in vec2 v_texcoord;
out vec4 outColor;

void main() {
  if (u_useTexture) {
    outColor = texture(u_texture, v_texcoord);
  } else {
    outColor = u_color;
  }
}
`;

